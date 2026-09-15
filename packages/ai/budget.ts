import type { WorldDraft } from '../contracts/draft.ts';
import { ReviewSchema, type BudgetStatus, type ReviewResult } from '../contracts/ai.ts';
import { MAX_DRAFT_BYTES, PRICE_VALID_UNTIL, RESERVATION_MICROS, usageCost, type ReviewProvider } from './provider.ts';

// Deliberately below the $10 authorization: $1 remains as a pricing/enforcement safety margin.
// This lifetime ledger never resets with a date, deploy, login or campaign.
export const LIMIT_MICROS = 9000000;
export interface Store {
  get<T>(key:string):Promise<T|undefined>;
  put<T>(key:string,value:T):Promise<unknown>;
}
export interface TransactionalStore extends Store { transaction<T>(fn:(store:Store)=>Promise<T>):Promise<T> }
type Ledger={spent:number;held:number;calls:number;nextAt:number;stopped:boolean};
type Entry={fingerprint:string;state:'pending'|'done'|'failed';result?:ReviewResult;error?:string;reserved:number};
export type ReviewJob={ownerId:string;campaignId:string;draftVersion:number;draft:WorldDraft};
const initial=():Ledger=>({spent:0,held:0,calls:0,nextAt:0,stopped:false});
export class AIError extends Error { code:string;status:number;constructor(code:string,status=409){super(code);this.code=code;this.status=status;} }

export class BudgetedReview {
  private storage:TransactionalStore;
  private provider:ReviewProvider;
  private now:()=>number;
  constructor(storage:TransactionalStore,provider:ReviewProvider,now:()=>number=Date.now){this.storage=storage;this.provider=provider;this.now=now;}
  async status():Promise<BudgetStatus>{
    const l=await this.storage.get<Ledger>('ledger')??initial();
    return {limitMicros:LIMIT_MICROS,spentMicros:l.spent,heldMicros:l.held,remainingMicros:Math.max(0,LIMIT_MICROS-l.spent-l.held),calls:l.calls,stopped:l.stopped||this.now()>=PRICE_VALID_UNTIL};
  }
  async run(job:ReviewJob):Promise<ReviewResult>{
    const encoded=JSON.stringify(job.draft);
    if(new TextEncoder().encode(encoded).length>MAX_DRAFT_BYTES)throw new AIError('AI_DRAFT_TOO_LARGE',413);
    const fingerprint=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(encoded)))).map(n=>n.toString(16).padStart(2,'0')).join('');
    const key=`review:${job.ownerId}:${job.campaignId}:${job.draftVersion}`;
    const cached=await this.storage.transaction(async store=>{
      const old=await store.get<Entry>(key);
      if(old){
        if(old.fingerprint!==fingerprint)throw new AIError('AI_IDEMPOTENCY_CONFLICT');
        if(old.state==='done'&&old.result)return old.result;
        throw new AIError(old.state==='pending'?'AI_REQUEST_PENDING':old.error??'AI_REQUEST_UNCERTAIN');
      }
      const ledger=await store.get<Ledger>('ledger')??initial();
      if(ledger.stopped||this.now()>=PRICE_VALID_UNTIL)throw new AIError('AI_REVIEW_REQUIRED',503);
      if(ledger.spent+ledger.held+RESERVATION_MICROS>LIMIT_MICROS)throw new AIError('AI_BUDGET_EXHAUSTED',429);
      if(this.now()<ledger.nextAt)throw new AIError('AI_RATE_LIMIT',429);
      ledger.held+=RESERVATION_MICROS;ledger.calls++;ledger.nextAt=this.now()+15000;
      await store.put('ledger',ledger);
      await store.put<Entry>(key,{fingerprint,state:'pending',reserved:RESERVATION_MICROS});
      return null;
    });
    if(cached)return cached;
    // Never retry a dispatched request: the provider may have charged even if its response was lost.
    let output;
    try{output=await this.provider.review(job.draft);}catch{output={usage:null,error:'AI_REQUEST_UNCERTAIN'};}
    let cost:number|null=null;
    try{if(output.usage)cost=usageCost(output.usage);}catch{/* Keep full reservation on unverifiable usage. */}
    let result:ReviewResult|undefined;
    const validated=ReviewSchema.safeParse(output.review);
    if(validated.success&&output.usage&&cost!==null&&cost<=RESERVATION_MICROS&&!output.error)
      result={review:validated.data,draftVersion:job.draftVersion,model:this.provider.model,usage:output.usage,costMicros:cost};
    const error=output.error??(cost!==null&&cost>RESERVATION_MICROS?'AI_COST_ANOMALY':'AI_INVALID_OUTPUT');
    await this.storage.transaction(async store=>{
      const ledger=await store.get<Ledger>('ledger');
      if(!ledger)throw new AIError('AI_LEDGER_MISSING',503);
      if(cost!==null){ledger.held-=RESERVATION_MICROS;ledger.spent+=cost;if(cost>RESERVATION_MICROS)ledger.stopped=true;}
      await store.put('ledger',ledger);
      await store.put<Entry>(key,{fingerprint,state:result?'done':'failed',result,error:result?undefined:error,reserved:cost===null?RESERVATION_MICROS:0});
    });
    if(!result)throw new AIError(error,502);
    return result;
  }
}
