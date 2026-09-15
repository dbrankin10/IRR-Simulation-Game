import {test} from 'node:test';
import assert from 'node:assert/strict';
import {DraftSchema,newDraft,reviewDraft} from '../packages/contracts/draft.ts';
test('draft dates are real calendar dates and unknown fields rejected',()=>{
 const draft={...newDraft(),name:'A'};
 assert.equal(DraftSchema.safeParse(draft).success,true);
 assert.equal(DraftSchema.safeParse({...draft,startDate:'2026-02-30'}).success,false);
 assert.equal(DraftSchema.safeParse({...draft,hiddenTruth:{}}).success,false);
 assert.ok(reviewDraft(draft).length>5);
});
