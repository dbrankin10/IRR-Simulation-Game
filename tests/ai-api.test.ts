import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../apps/api/worker.ts';
import { newDraft } from '../packages/contracts/draft.ts';

test('AI API authenticates, restricts owner, checks origin/version and forwards only owned saved drafts',async()=>{
 const owner='290c51ee-2d6a-4f2d-a6a3-4bee86a45fdf',campaign='102b02c2-dd52-45a3-afaa-ea728dfd980b';
 const original=globalThis.fetch;let userId=owner;let available=true;let dispatched=0;let forwarded:any;
 globalThis.fetch=(async(input:RequestInfo|URL)=>{
  const url=typeof input==='string'?input:input instanceof URL?input.href:input.url;
  if(url.includes('/auth/v1/user'))return Response.json({id:userId,aud:'authenticated',email:'test@example.test'});
  if(url.includes('/rest/v1/rpc/imperium_get_draft'))return available?Response.json({id:campaign,status:'draft',draftVersion:2,draft:{...newDraft(),name:'Owned saved world'}}):Response.json({message:'NOT_FOUND'},{status:404});
  throw new Error('Unexpected network request');
 }) as typeof fetch;
 const env={ASSETS:{fetch:async()=>new Response('shell')},SUPABASE_URL:'https://test.supabase.co',SUPABASE_PUBLISHABLE_KEY:'test-key',AI_ENABLED:'true',OPENAI_API_KEY:'never-public',AI_ALLOWED_USER_ID:owner,
  AI_BUDGET:{idFromName:(name:string)=>{assert.equal(name,'imperium-testing-lifetime-v1');return name;},get:()=>({fetch:async(_url:string,init?:RequestInit)=>{dispatched++;forwarded=init?.body?JSON.parse(String(init.body)):null;return Response.json({data:{ok:true}});}})}} as unknown as Parameters<typeof worker.fetch>[1];
 const path=`https://imperium.test/api/v1/campaigns/${campaign}/draft/review`;
 const req=(body:unknown={expectedVersion:2},origin='https://imperium.test',token=true)=>new Request(path,{method:'POST',headers:{Origin:origin,...(token?{Authorization:'Bearer test-jwt'}:{})},body:JSON.stringify(body)});
 try{
  assert.equal((await worker.fetch(req(undefined,undefined,false),env)).status,401);
  userId='aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa';assert.equal((await worker.fetch(req(),env)).status,403);userId=owner;
  assert.equal((await worker.fetch(req(undefined,'https://attacker.test'),env)).status,403);
  assert.equal((await worker.fetch(req({expectedVersion:1}),env)).status,409);
  assert.equal((await worker.fetch(req({expectedVersion:2,model:'expensive'}),env)).status,422);
  assert.equal((await worker.fetch(req({padding:'x'.repeat(2000)}),env)).status,413);
  available=false;assert.equal((await worker.fetch(req(),env)).status,404);available=true;
  assert.equal(dispatched,0);
  assert.equal((await worker.fetch(req(),env)).status,200);assert.equal(dispatched,1);
  assert.equal(forwarded.ownerId,owner);assert.equal(forwarded.draft.name,'Owned saved world');assert.equal(forwarded.campaignId,campaign);
  assert.ok(!JSON.stringify(forwarded).includes('never-public'));
  const config=await worker.fetch(new Request('https://imperium.test/api/v1/config'),env);assert.ok(!(await config.text()).includes('never-public'));
 }finally{globalThis.fetch=original;}
});
