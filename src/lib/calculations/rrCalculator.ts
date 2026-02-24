export function calculateRRRatio(entryPrice: number, stopLoss: number, takeProfit: number): number {
  const risk = Math.abs(entryPrice - stopLoss);
  const reward = Math.abs(takeProfit - entryPrice);
  if (risk === 0) return 0;
  return Number((reward / risk).toFixed(2));
}

