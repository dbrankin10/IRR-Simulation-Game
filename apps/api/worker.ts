import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { DraftSchema } from '../../packages/contracts/draft.ts';
import type { DurableObjectNamespace } from '@cloudflare/workers-types';
export { AIBudget } from './ai-budget.ts';

type Env = { ASSETS: { fetch(request: Request): Promise<Response> }; SUPABASE_URL: string; SUPABASE_PUBLISHABLE_KEY?: string; AI_ENABLED: string; AI_ALLOWED_USER_ID?:string; OPENAI_API_KEY?:string; AI_BUDGET?:DurableObjectNamespace };
const json = (data: unknown, status = 200) => Response.json(data, { status, headers: { 'Cache-Control':'no-store', 'X-Content-Type-Options':'nosniff' } });
async function boundedText(request:Request,max:number){
 const reader=request.body?.getReader();if(!reader)return '';
 const chunks:Uint8Array[]=[];let size=0;
 try{while(true){const {value,done}=await reader.read();if(done)break;size+=value.length;if(size>max){await reader.cancel();throw new Error('PAYLOAD_TOO_LARGE');}chunks.push(value);}}finally{reader.releaseLock();}
 const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}return new TextDecoder().decode(bytes);
}
export default {
 async fetch(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  if (!url.pathname.startsWith('/api/')) return env.ASSETS.fetch(request);
  const aiEnabled=env.AI_ENABLED==='true'&&!!env.OPENAI_API_KEY&&!!env.AI_BUDGET&&!!env.AI_ALLOWED_USER_ID;
  if (url.pathname === '/api/v1/health') return json({ status:'ok', phase:'draft-ai-review', aiEnabled });
  if (url.pathname === '/api/v1/config') return json({ supabaseUrl:env.SUPABASE_URL, supabaseKey:env.SUPABASE_PUBLISHABLE_KEY ?? null, aiEnabled });
  if (!env.SUPABASE_PUBLISHABLE_KEY) return json({ error:'SUPABASE_NOT_CONFIGURED' },503);
  const auth = request.headers.get('Authorization');
  if (!auth?.startsWith('Bearer ')) return json({error:'UNAUTHENTICATED'},401);
  const db = createClient(env.SUPABASE_URL,env.SUPABASE_PUBLISHABLE_KEY,{global:{headers:{Authorization:auth}},auth:{persistSession:false,autoRefreshToken:false}});
  const {data:user,error:authError} = await db.auth.getUser(auth.slice(7));
  if(authError || !user.user) return json({error:'UNAUTHENTICATED'},401);
  try {
   const aiMatch=url.pathname.match(/^\/api\/v1\/campaigns\/([\da-f-]+)\/draft\/review$/i);
   if(url.pathname==='/api/v1/ai/budget'||aiMatch){
    if(!aiEnabled)return json({error:'AI_DISABLED'},503);
    if(user.user.id!==env.AI_ALLOWED_USER_ID)return json({error:'AI_FORBIDDEN'},403);
    // This fixed singleton name is a durable lifetime budget, not a per-campaign allowance.
    const budget=env.AI_BUDGET!.get(env.AI_BUDGET!.idFromName('imperium-testing-lifetime-v1'));
    if(url.pathname==='/api/v1/ai/budget'){
     if(request.method!=='GET')return json({error:'METHOD_NOT_ALLOWED'},405);
     const response=await budget.fetch('https://budget/status');return json(await response.json(),response.status);
    }
    if(request.method!=='POST')return json({error:'METHOD_NOT_ALLOWED'},405);
    if(request.headers.get('Origin')!==url.origin)return json({error:'ORIGIN_REJECTED'},403);
    if(!z.uuid().safeParse(aiMatch![1]).success)return json({error:'NOT_FOUND'},404);
    const body=z.object({expectedVersion:z.number().int().positive()}).strict().parse(JSON.parse(await boundedText(request,1024)));
    const saved=await db.rpc('imperium_get_draft',{p_campaign_id:aiMatch![1]});
    if(saved.error||!saved.data)return json({error:'NOT_FOUND'},404);
    if(saved.data.status!=='draft')return json({error:'NOT_DRAFT'},409);
    if(saved.data.draftVersion!==body.expectedVersion)return json({error:'VERSION_CONFLICT'},409);
    const draft=DraftSchema.parse(saved.data.draft);
    const response=await budget.fetch('https://budget/review',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({ownerId:user.user.id,campaignId:aiMatch![1],draftVersion:body.expectedVersion,draft})});
    return json(await response.json(),response.status);
   }
   let result;
   if(url.pathname==='/api/v1/campaigns' && request.method==='GET') result=await db.rpc('imperium_list_campaigns');
   else {
    const match=url.pathname.match(/^\/api\/v1\/campaigns\/([\da-f-]+)\/draft$/i);
    if(!match || !z.uuid().safeParse(match[1]).success) return json({error:'NOT_FOUND'},404);
    if(request.method==='GET') result=await db.rpc('imperium_get_draft',{p_campaign_id:match[1]});
    else if(request.method==='PUT') {
     if(request.headers.get('Origin')!==url.origin) return json({error:'ORIGIN_REJECTED'},403);
     const text=await boundedText(request,262144);
     const body=z.object({expectedVersion:z.number().int().nonnegative(),document:DraftSchema}).strict().parse(JSON.parse(text));
     const key=z.uuid().parse(request.headers.get('Idempotency-Key'));
     result=await db.rpc('imperium_save_draft',{p_campaign_id:match[1],p_expected_version:body.expectedVersion,p_document:body.document,p_command_id:key});
    } else return json({error:'METHOD_NOT_ALLOWED'},405);
   }
   if(result.error) {
    const code=['VERSION_CONFLICT','IDEMPOTENCY_CONFLICT','NOT_FOUND','NOT_DRAFT','INVALID_DRAFT'].find(x=>result.error!.message.includes(x));
    return json({error:code??'DATABASE_ERROR'},code?.includes('CONFLICT')?409:code==='NOT_FOUND'?404:422);
   }
   return json({data:result.data});
  } catch(error) {
   if(error instanceof Error&&error.message==='PAYLOAD_TOO_LARGE')return json({error:'PAYLOAD_TOO_LARGE'},413);
   if(error instanceof z.ZodError || error instanceof SyntaxError) return json({error:'INVALID_REQUEST'},422);
   return json({error:'REQUEST_FAILED'},500);
  }
 }
};
