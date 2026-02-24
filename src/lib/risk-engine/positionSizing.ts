export function calculatePositionSize(params: {
  accountBalance: number;
  riskPercent: number;
  entryPrice: number;
  stopLoss: number;
  pipValuePerLot?: number;
}): number {
  const { accountBalance, riskPercent, entryPrice, stopLoss, pipValuePerLot = 10 } = params;
  const riskAmount = accountBalance * (riskPercent / 100);
  const pipDistance = Math.abs(entryPrice - stopLoss);
  if (pipDistance === 0) return 0;
  const lotSize = riskAmount / (pipDistance * pipValuePerLot);
  return Number(lotSize.toFixed(2));
}

