'use client';
import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import type { BudgetStatus, ReviewResult } from '../packages/contracts/ai';
import './ai-review.css';

const money=(micros:number)=>`$${(micros/1000000).toFixed(4)}`;
const errors:Record<string,string>={
 AI_DISABLED:'AI review is currently disabled.',AI_FORBIDDEN:'AI testing is restricted to the owner account.',
 AI_BUDGET_EXHAUSTED:'The lifetime testing allowance is exhausted. No request was sent.',
 AI_RATE_LIMIT:'Please wait 15 seconds between new reviews. No request was sent.',
 AI_DRAFT_TOO_LARGE:'This saved draft exceeds the initial 24 KB review limit. Your full draft is preserved; shorten a copy for this bounded test.',
 AI_REQUEST_PENDING:'This version already has a request in progress or with an uncertain outcome. It will not be sent again.',
 AI_REQUEST_UNCERTAIN:'The provider response was lost. The full reservation remains held; automatic retries are disabled.',
 AI_REVIEW_REQUIRED:'AI is paused pending review of pricing or spending safeguards.',
 AI_INVALID_OUTPUT:'The response did not pass validation. Nothing was applied to your world.',
 AI_REFUSED:'The model declined this request. Nothing was applied to your world.',
 AI_INCOMPLETE:'The model reached its response limit. Nothing was applied to your world.',
 PROVIDER_LIMIT:'The provider rejected the request due to a rate or account limit. No automatic retry was attempted.',
 PROVIDER_FAILED:'The provider request failed. The reservation is held conservatively until reviewed.'
};
export default function AIReviewPanel({campaignId,version,clean,enabled,request}:{campaignId?:string;version?:number;clean:boolean;enabled:boolean;request:(path:string,options?:RequestInit)=>Promise<any>}){
 const [budget,setBudget]=useState<BudgetStatus|null>(null),[result,setResult]=useState<ReviewResult|null>(null),[busy,setBusy]=useState(false),[error,setError]=useState('');
 useEffect(()=>{if(enabled)request('ai/budget').then(setBudget).catch(e=>setError(errors[e.message]??e.message));},[enabled]); // eslint-disable-line react-hooks/exhaustive-deps
 async function review(){
  if(!campaignId||!version)return;setBusy(true);setError('');
  try{setResult(await request(`campaigns/${campaignId}/draft/review`,{method:'POST',body:JSON.stringify({expectedVersion:version})}));}
  catch(e){const message=(e as Error).message;setError(errors[message]??message);}
  finally{setBusy(false);request('ai/budget').then(setBudget).catch(()=>{});}
 }
 return <section className="ai-review" aria-labelledby="ai-review-title">
  <div className="eyebrow">OPTIONAL · WORLD-CREATION ASSISTANCE</div><h2 id="ai-review-title"><Sparkles size={22}/> A second reading of your world</h2>
  <p>Review the saved notes for contradictions, missing details and optional improvements. This sends this draft—not other campaigns—to OpenAI. No web research, time advance or automatic changes.</p>
  {!enabled?<p>Sign in to the authorized testing account to use AI review.</p>:<>
   <p className="field-note">One review per saved version. A new request reserves up to $0.10; verified usage replaces that reservation. Reopening the same version’s review is free. Save your changes first.</p>
   <button className="button gold" onClick={review} disabled={busy||!clean||!campaignId||budget?.stopped||!!budget&&budget.remainingMicros<100000}>{busy?'Reviewing saved draft…':'Review saved draft · up to $0.10'}</button>
   {!clean&&<p className="small-muted">Save the draft to review this version.</p>}
   {budget&&<p className="budget-line">Lifetime test ledger: {money(budget.spentMicros)} accounted · {money(budget.heldMicros)} held · {money(budget.remainingMicros)} available. Stops at $9, leaving $1 of the approved $10 as a safety margin. No monthly reset.</p>}
  </>}
  {error&&<p className="notice" role="alert">{error}</p>}
  {result&&<div className="ai-result" aria-live="polite">
   <div className="eyebrow">AI SUGGESTIONS · SAVED VERSION {result.draftVersion} · NOT APPLIED</div>
   <p>{result.review.summary}</p>
   {!!result.review.strengths.length&&<><h3>Strong foundations</h3><ul>{result.review.strengths.map((x,i)=><li key={i}>{x}</li>)}</ul></>}
   {!!result.review.issues.length&&<><h3>Points to resolve</h3><ul>{result.review.issues.map((x,i)=><li key={i}><strong>{x.domain} · {x.severity}:</strong> {x.message}</li>)}</ul></>}
   {!!result.review.questions.length&&<><h3>Questions for you</h3><ul>{result.review.questions.map((x,i)=><li key={i}>{x}</li>)}</ul></>}
   {result.review.suggestions.map((x,i)=><article className="ai-suggestion" key={i}><h3>Proposed {x.section} notes</h3><p>{x.reason}</p><blockquote>{x.text}</blockquote><small>Optional proposal. Edit your notes yourself if you accept it.</small></article>)}
   <p className="small-muted">{result.model} · {result.usage.inputTokens} input / {result.usage.outputTokens} output tokens · {money(result.costMicros)} conservatively accounted. Not historical verification.</p>
  </div>}
 </section>;
}
