import { z } from 'zod';

export const ReviewSchema = z.object({
  summary: z.string().max(2000),
  strengths: z.array(z.string().max(700)).max(6),
  questions: z.array(z.string().max(700)).max(8),
  issues: z.array(z.object({
    severity: z.enum(['information','warning','conflict']),
    domain: z.enum(['identity','governance','politics','cabinet','military','economy','intelligence','world','general']),
    message: z.string().max(1000)
  }).strict()).max(10),
  suggestions: z.array(z.object({
    section: z.enum(['identity','governance','politics','cabinet','military','economy','intelligence','world']),
    reason: z.string().max(700),
    text: z.string().max(2000)
  }).strict()).max(4)
}).strict();
export type DraftReview = z.infer<typeof ReviewSchema>;
export type BudgetStatus = {
  limitMicros: number; spentMicros: number; heldMicros: number; remainingMicros: number;
  calls: number; stopped: boolean;
};
export type ReviewResult = {
  review: DraftReview; draftVersion: number; model: string;
  usage: { inputTokens: number; outputTokens: number }; costMicros: number;
};
