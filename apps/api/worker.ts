import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { DraftSchema } from '../../packages/contracts/draft';

type Env = { ASSETS: { fetch(request: Request): Promise<Response> }; SUPABASE_URL: string; SUPABASE_PUBLISHABLE_KEY?: string; AI_ENABLED: string };
const json = (data: unknown, status = 200) => Response.json(data, { status, headers: { 'Cache-Control':'no-store', 'X-Content-Type-Options':'nosniff' } });
export default {
 async fetch(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  if (!url.pathname.startsWith('/api/')) return env.ASSETS.fetch(request);
  if (url.pathname === '/api/v1/health') return json({ status:'ok', phase:'campaign-drafts', aiEnabled:false });
  if (url.pathname === '/api/v1/config') return json({ supabaseUrl:env.SUPABASE_URL, supabaseKey:env.SUPABASE_PUBLISHABLE_KEY ?? null, aiEnabled:false });
  if (!env.SUPABASE_PUBLISHABLE_KEY) return json({ error:'SUPABASE_NOT_CONFIGURED' },503);
  const auth = request.headers.get('Authorization');
  if (!auth?.startsWith('Bearer ')) return json({error:'UNAUTHENTICATED'},401);
  const db = createClient(env.SUPABASE_URL,env.SUPABASE_PUBLISHABLE_KEY,{global:{headers:{Authorization:auth}},auth:{persistSession:false,autoRefreshToken:false}});
  const {data:user,error:authError} = await db.auth.getUser(auth.slice(7));
  if(authError || !user.user) return json({error:'UNAUTHENTICATED'},401);
  try {
   let result;
   if(url.pathname==='/api/v1/campaigns' && request.method==='GET') result=await db.rpc('imperium_list_campaigns');
   else {
    const match=url.pathname.match(/^\/api\/v1\/campaigns\/([\da-f-]+)\/draft$/i);
    if(!match || !z.uuid().safeParse(match[1]).success) return json({error:'NOT_FOUND'},404);
    if(request.method==='GET') result=await db.rpc('imperium_get_draft',{p_campaign_id:match[1]});
    else if(request.method==='PUT') {
     if(request.headers.get('Origin')!==url.origin) return json({error:'ORIGIN_REJECTED'},403);
     const text=await request.text();
     if(new TextEncoder().encode(text).length>262144) return json({error:'PAYLOAD_TOO_LARGE'},413);
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
   if(error instanceof z.ZodError || error instanceof SyntaxError) return json({error:'INVALID_REQUEST'},422);
   return json({error:'REQUEST_FAILED'},500);
  }
 }
};
