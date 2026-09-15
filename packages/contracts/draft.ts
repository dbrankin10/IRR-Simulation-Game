import { z } from 'zod';

export const sections = [
  ['identity', 'Nation & identity', 'Territories, provinces, capital, people, culture and historical divergence.'],
  ['governance', 'Governance & authority', 'Your office, institutions, approval rules, emergency powers and succession.'],
  ['politics', 'Domestic politics', 'Important figures, political blocs, seats, coalitions and internal tensions.'],
  ['cabinet', 'Cabinet & people', 'Officials, biographies, doctrine and generally accurate candidate assessments.'],
  ['military', 'Armed forces', 'Command hierarchy, formations, bases, personnel, exact stocks and readiness.'],
  ['economy', 'Economy & finance', 'GDP, treasury, budgets, debt, industries, resources and supply chains.'],
  ['intelligence', 'Intelligence', 'Collection capabilities, legal authorities and starting knowledge.'],
  ['world', 'International order', 'Other nations, treaties, tensions and starting conflicts. Minor actors stay lightweight until relevant.']
] as const;
export const DraftSchema = z.object({
  name: z.string().trim().min(1).max(120),
  startDate: z.iso.date(),
  nation: z.string().max(120),
  role: z.string().max(120),
  duration: z.enum(['3 days','1 week','2 weeks','1 month','3 months','6 months']),
  grounding: z.boolean(),
  identity: z.string().max(20000), governance: z.string().max(20000),
  politics: z.string().max(20000), cabinet: z.string().max(20000),
  military: z.string().max(20000), economy: z.string().max(20000),
  intelligence: z.string().max(20000), world: z.string().max(20000)
}).strict();
export type WorldDraft = z.infer<typeof DraftSchema>;
export function newDraft(): WorldDraft {
  return { name: '', startDate: '2026-01-01', nation: '', role: '', duration: '1 month', grounding: false,
    identity: '', governance: '', politics: '', cabinet: '', military: '', economy: '', intelligence: '', world: '' };
}
export function reviewDraft(draft: WorldDraft) {
  return [
    ...(!draft.nation.trim() ? ['Define your nation.'] : []),
    ...(!draft.role.trim() ? ['Define the office you will hold.'] : []),
    ...sections.filter(([key]) => !draft[key].trim()).map(([,title]) => `Complete ${title.toLowerCase()}.`),
    'Structured world validation and AI setup assistance are not connected yet. These notes cannot launch a campaign.'
  ];
}
