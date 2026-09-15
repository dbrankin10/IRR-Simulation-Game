import type { DurableObjectState } from '@cloudflare/workers-types';
import { z } from 'zod';
import { DraftSchema } from '../../packages/contracts/draft.ts';
import { AIError, BudgetedReview } from '../../packages/ai/budget.ts';
import { OpenAIReviewProvider } from '../../packages/ai/provider.ts';

const Job=z.object({ownerId:z.uuid(),campaignId:z.uuid(),draftVersion:z.number().int().positive(),draft:DraftSchema}).strict();
export class AIBudget {
  private service:BudgetedReview;
  private env:{OPENAI_API_KEY?:string;AI_ALLOWED_USER_ID?:string;AI_ENABLED?:string};
  constructor(state:DurableObjectState,env:{OPENAI_API_KEY?:string;AI_ALLOWED_USER_ID?:string;AI_ENABLED?:string}){
    this.env=env;
    this.service=new BudgetedReview(state.storage,new OpenAIReviewProvider(env.OPENAI_API_KEY??''));
  }
  async fetch(request:Request):Promise<Response>{
    try{
      if(request.method==='GET')return Response.json({data:await this.service.status()});
      if(!this.env.OPENAI_API_KEY||this.env.AI_ENABLED!=='true')return Response.json({error:'AI_DISABLED'},{status:503});
      const job=Job.parse(await request.json());
      if(!this.env.AI_ALLOWED_USER_ID||job.ownerId!==this.env.AI_ALLOWED_USER_ID)return Response.json({error:'AI_FORBIDDEN'},{status:403});
      return Response.json({data:await this.service.run(job)});
    }catch(e){return Response.json({error:e instanceof AIError?e.code:'AI_REQUEST_FAILED'},{status:e instanceof AIError?e.status:503});}
  }
}
