export type Stock = Readonly<{
  campaignId: string;
  resourceId: string;
  quantity: bigint;
  reserved: bigint;
}>;

export function consume(stock: Stock, campaignId: string, quantity: bigint): Stock {
  if (stock.campaignId !== campaignId) throw new Error('CAMPAIGN_MISMATCH');
  if (stock.quantity < 0n || stock.reserved < 0n || stock.reserved > stock.quantity)
    throw new Error('INVALID_STOCK');
  if (quantity <= 0n) throw new Error('INVALID_QUANTITY');
  if (quantity > stock.quantity - stock.reserved) throw new Error('INSUFFICIENT_STOCK');
  return { ...stock, quantity: stock.quantity - quantity };
}
