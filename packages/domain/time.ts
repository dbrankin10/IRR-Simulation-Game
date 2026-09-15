export type Crisis = Readonly<{
  occurredAt: number;
  learnedAt: number | null;
  severity: number;
  decisionRelevant: boolean;
}>;

/** Pure boundary selection, not authorization to advance or a persistence layer. */
export function advanceBoundary(start: number, target: number, crises: readonly Crisis[], threshold = 4): number {
  if (!Number.isFinite(start) || !Number.isFinite(target) || target <= start)
    throw new Error('INVALID_INTERVAL');
  if (!Number.isInteger(threshold) || threshold < 0 || threshold > 5)
    throw new Error('INVALID_THRESHOLD');
  let boundary = target;
  for (const crisis of crises) {
    if (!Number.isFinite(crisis.occurredAt) || !Number.isInteger(crisis.severity) || crisis.severity < 0 || crisis.severity > 5)
      throw new Error('INVALID_CRISIS');
    if (crisis.learnedAt !== null && (!Number.isFinite(crisis.learnedAt) || crisis.learnedAt < crisis.occurredAt))
      throw new Error('INVALID_DETECTION_TIME');
    if (crisis.learnedAt !== null && crisis.learnedAt >= start && crisis.learnedAt <= boundary && crisis.severity >= threshold && crisis.decisionRelevant)
      boundary = crisis.learnedAt;
  }
  return boundary;
}
