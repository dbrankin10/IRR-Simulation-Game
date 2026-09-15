import test from 'node:test';
import assert from 'node:assert/strict';
import { BudgetedReview, LIMIT_MICROS, type Store, type TransactionalStore, type ReviewJob } from '../packages/ai/budget.ts';
import { MODEL, OpenAIReviewProvider, PRICE_VALID_UNTIL, RESERVATION_MICROS, requestBody, usageCost, type ReviewProvider } from '../packages/ai/provider.ts';
import { newDraft } from '../packages/contracts/draft.ts';

class MemoryStore implements TransactionalStore {
 data=new Map<string,unknown>();tail=Promise.resolve();
 async get<T>(key:string){return structuredClone(this.data.get(key)) as T|undefined;}
 async put<T>(key:string,value:T){this.data.set(key,structuredClone(value));}
 async transaction<T>(fn:(store:Store)=>Promise<T>):Promise<T>{
  const prior=this.tail;let release!:()=>void;this.tail=new Promise<void>(r=>release=r);await prior;
  const snapshot=structuredClone(this.data);
  try{return await fn(this);}catch(e){this.data=snapshot;throw e;}finally{release();}
 }
}
const review={summary:'No canonical changes.',strengths:[],issues:[],questions:['What is the treasury?'],suggestions:[]};
const now=()=>Date.parse('2026-09-14T12:00:00Z');
const job:ReviewJob={ownerId:'290c51ee-2d6a-4f2d-a6a3-4bee86a45fdf',campaignId:'102b02c2-dd52-45a3-afaa-ea728dfd980b',draftVersion:1,draft:{...newDraft(),name:'Test'}};
function provider(fn?:()=>Promise<any>):ReviewProvider{return {model:MODEL,review:fn??(async()=>({review,usage:{inputTokens:1000,outputTokens:500}}))};}

test('AI ledger reserves before dispatch, settles rounded-up usage and replays without charge',async()=>{
 const store=new MemoryStore();let calls=0;
 const service=new BudgetedReview(store,provider(async()=>{calls++;assert.equal((await service.status()).heldMicros,RESERVATION_MICROS);return {review,usage:{inputTokens:1000,outputTokens:500}};}),now);
 const first=await service.run(job);assert.equal(first.costMicros,3000);
 assert.deepEqual(await service.run(job),first);assert.equal(calls,1);
 const status=await service.status();assert.equal(status.spentMicros,3000);assert.equal(status.heldMicros,0);
 assert.equal((await new BudgetedReview(store,provider(),now).status()).spentMicros,3000);
 await assert.rejects(service.run({...job,draft:{...job.draft,nation:'Changed'}}),/AI_IDEMPOTENCY_CONFLICT/);
});

test('Concurrent requests for one version dispatch only once',async()=>{
 const store=new MemoryStore();let calls=0;let release!:()=>void;
 const wait=new Promise<void>(r=>release=r);
 const service=new BudgetedReview(store,provider(async()=>{calls++;await wait;return {review,usage:{inputTokens:1,outputTokens:1}};}),now);
 const a=service.run(job);const b=service.run(job);await assert.rejects(b,/AI_REQUEST_PENDING/);release();await a;assert.equal(calls,1);
});

test('Budget stops concurrent overspend and does not reset in a new service instance',async()=>{
 const store=new MemoryStore();await store.put('ledger',{spent:LIMIT_MICROS-RESERVATION_MICROS,held:0,calls:89,nextAt:0,stopped:false});
 let calls=0;const service=new BudgetedReview(store,provider(async()=>{calls++;throw new Error('connection lost');}),now);
 const settled=await Promise.allSettled([service.run(job),service.run({...job,draftVersion:2})]);
 assert.equal(settled.filter(x=>x.status==='rejected').length,2);assert.equal(calls,1);
 const restarted=new BudgetedReview(store,provider(),()=>now()+86400000);
 await assert.rejects(restarted.run({...job,draftVersion:3}),/AI_BUDGET_EXHAUSTED/);
 assert.equal((await restarted.status()).remainingMicros,0);
});

test('Lost/invalid usage keeps reservation; failed versions cannot auto retry',async()=>{
 const store=new MemoryStore();let calls=0;
 const service=new BudgetedReview(store,provider(async()=>{calls++;throw new Error('timeout');}),now);
 await assert.rejects(service.run(job),/AI_REQUEST_UNCERTAIN/);
 await assert.rejects(service.run(job),/AI_REQUEST_UNCERTAIN/);
 assert.equal(calls,1);assert.equal((await service.status()).heldMicros,RESERVATION_MICROS);
});

test('Refused or malformed content still accounts for valid billed usage',async()=>{
 const service=new BudgetedReview(new MemoryStore(),provider(async()=>({usage:{inputTokens:1,outputTokens:1},error:'AI_REFUSED'})),now);
 await assert.rejects(service.run(job),/AI_REFUSED/);assert.equal((await service.status()).spentMicros,6);
});

test('Oversized drafts, rapid calls, expired prices and cost anomalies fail closed',async()=>{
 let calls=0;const service=new BudgetedReview(new MemoryStore(),provider(async()=>{calls++;return {review,usage:{inputTokens:1,outputTokens:1}};}),now);
 await assert.rejects(service.run({...job,draft:{...job.draft,identity:'é'.repeat(13000)}}),/AI_DRAFT_TOO_LARGE/);assert.equal(calls,0);
 await service.run(job);await assert.rejects(service.run({...job,draftVersion:2}),/AI_RATE_LIMIT/);
 const expired=new BudgetedReview(new MemoryStore(),provider(),()=>PRICE_VALID_UNTIL);
 await assert.rejects(expired.run(job),/AI_REVIEW_REQUIRED/);
 const anomaly=new BudgetedReview(new MemoryStore(),provider(async()=>({review,usage:{inputTokens:1000000,outputTokens:1000000}})),now);
 await assert.rejects(anomaly.run(job),/AI_COST_ANOMALY/);assert.equal((await anomaly.status()).stopped,true);
});

test('Budget is shared across campaigns; review content is not shared',async()=>{
 const store=new MemoryStore();let clock=now();let calls=0;
 const service=new BudgetedReview(store,provider(async()=>{calls++;return {review,usage:{inputTokens:1,outputTokens:1}};}),()=>clock);
 await service.run(job);clock+=16000;
 await service.run({...job,campaignId:'e7f0c216-4012-470d-838b-ef7e6b177aa0'});
 assert.equal(calls,2);assert.equal((await service.status()).spentMicros,12);
});

test('Provider requests are bounded, stateless, pinned and tool-free; output is validated',async()=>{
 const body=requestBody(job.draft);assert.equal(body.store,false);assert.deepEqual(body.tools,[]);assert.equal(body.model,MODEL);assert.equal(body.service_tier,'default');
 assert.equal(body.max_output_tokens,2400);assert.equal(body.reasoning.effort,'none');
 assert.ok(new TextEncoder().encode(JSON.stringify(body)).length<8000);
 const transport=(async(_url:unknown,init:RequestInit)=>{assert.ok(!JSON.stringify(init.body).includes('Bearer'));return Response.json({model:MODEL,status:'completed',usage:{input_tokens:10,output_tokens:10},output:[{type:'message',content:[{type:'output_text',text:JSON.stringify(review)}]}]});}) as typeof fetch;
 const output=await new OpenAIReviewProvider('test-only-key',transport).review(job.draft);assert.deepEqual(output.review,review);
 assert.throws(()=>usageCost({inputTokens:-1,outputTokens:0}),/INVALID_USAGE/);
});
