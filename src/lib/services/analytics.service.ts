import type { Trade } from '@/lib/models/trade';
import type { AnalyticsSnapshot } from '@/lib/models/analytics';

export function computeAnalyticsSnapshot(trades: Trade[]): AnalyticsSnapshot {
  const closed = trades.filter((t) => t.status === 'closed');
  const wins = closed.filter((t) => t.pnl > 0);
  const losses = closed.filter((t) => t.pnl < 0);

  const winRate = closed.length ? (wins.length / closed.length) * 100 : 0;
  const lossRate = closed.length ? (losses.length / closed.length) * 100 : 0;
  const totalProfit = wins.reduce((s, t) => s + t.pnl, 0);
  const totalLoss = Math.abs(losses.reduce((s, t) => s + t.pnl, 0));
  const expectancy = closed.length ? (totalProfit - totalLoss) / closed.length : 0;
  const profitFactor = totalLoss > 0 ? totalProfit / totalLoss : 0;

  const maxDrawdown = Math.max(
    0,
    ...closed.map((t) => -Math.min(0, t.pnl))
  );

  const avgRR = closed.length
    ? closed.reduce((s, t) => s + (t.rrRatio || 0), 0) / closed.length
    : 0;

  const byInstrument = new Map<string, { pnl: number; count: number }>();
  closed.forEach((t) => {
    const rec = byInstrument.get(t.instrument) ?? { pnl: 0, count: 0 };
    rec.pnl += t.pnl;
    rec.count += 1;
    byInstrument.set(t.instrument, rec);
  });

  let bestInstrument: string | null = null;
  let worstInstrument: string | null = null;
  let bestExpect = -Infinity;
  let worstExpect = Infinity;

  byInstrument.forEach((v, k) => {
    const e = v.pnl / v.count;
    if (e > bestExpect) {
      bestExpect = e;
      bestInstrument = k;
    }
    if (e < worstExpect) {
      worstExpect = e;
      worstInstrument = k;
    }
  });

  const overtradingScore = Math.min(
    100,
    Math.max(0, (closed.length - 10) * 5)
  );

  const sharpeRatio = expectancy !== 0 ? expectancy / (Math.abs(expectancy) || 1) : 0;

  return {
    winRate,
    lossRate,
    expectancy,
    profitFactor,
    sharpeRatio,
    maxDrawdown,
    avgRR,
    bestInstrument,
    worstSetup: worstInstrument,
    overtradingScore,
  };
}

