import { build } from 'esbuild';
import { Miniflare, Response as RuntimeResponse, convertV4MiniflareOptions } from 'miniflare';
import assert from 'node:assert/strict';

// Real workerd + SQLite Durable Object; every outbound request is mocked. No paid API traffic.
const owner='290c51ee-2d6a-4f2d-a6a3-4bee86a45fdf';
const result={summary:'Validated in workerd.',strengths:[],issues:[],questions:[],suggestions:[]};
const bundled=await build({stdin:{contents:`import { AIBudget } from './apps/api/ai-budget.ts'; export { AIBudget }; export default { fetch(request,env){return env.BUDGET.get(env.BUDGET.idFromName('runtime-test')).fetch(request);} };`,resolveDir:process.cwd(),sourcefile:'runtime-test.ts',loader:'ts'},bundle:true,format:'esm',write:false,platform:'browser',target:'es2022'});
let outbound=0;
const mf=new Miniflare(convertV4MiniflareOptions({workers:[{name:'runtime-test',modules:true,script:bundled.outputFiles[0].text,compatibilityDate:'2026-09-14',durableObjects:{BUDGET:{className:'AIBudget',useSQLite:true}},bindings:{OPENAI_API_KEY:'test-only',AI_ENABLED:'true',AI_ALLOWED_USER_ID:owner},outboundService:async request=>{
 outbound++;assert.equal(request.url,'https://api.openai.com/v1/responses');
 const body=await request.json();assert.equal(body.store,false);assert.deepEqual(body.tools,[]);
 return RuntimeResponse.json({status:'completed',model:body.model,usage:{input_tokens:100,output_tokens:100},output:[{type:'message',content:[{type:'output_text',text:JSON.stringify(result)}]}]});
}}]}));
try{
 const body={ownerId:owner,campaignId:'102b02c2-dd52-45a3-afaa-ea728dfd980b',draftVersion:1,draft:{name:'Runtime test',startDate:'2026-01-01',nation:'Test',role:'President',duration:'1 month',grounding:false,identity:'',governance:'',politics:'',cabinet:'',military:'',economy:'',intelligence:'',world:''}};
 const first=await mf.dispatchFetch('https://test/review',{method:'POST',body:JSON.stringify(body)});const data=await first.json();
 assert.equal(first.status,200,JSON.stringify(data));assert.equal(data.data.review.summary,result.summary);
 const replay=await mf.dispatchFetch('https://test/review',{method:'POST',body:JSON.stringify(body)});assert.equal(replay.status,200);assert.equal(outbound,1);
 const status=await (await mf.dispatchFetch('https://test/status')).json();assert.equal(status.data.heldMicros,0);assert.equal(status.data.spentMicros,525);
 console.log('PASS real workerd + SQLite budget + mocked provider + replay; no paid calls.');
}finally{await mf.dispose();}
