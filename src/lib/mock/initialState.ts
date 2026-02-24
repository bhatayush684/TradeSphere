import type { Account } from '@/lib/models/account';
import type { Trade } from '@/lib/models/trade';
import type { AnalyticsSnapshot } from '@/lib/models/analytics';
import type { JournalEntry } from '@/lib/models/journal';
import { computeAnalyticsSnapshot } from '@/lib/services/analytics.service';
import { createJournalEntry } from '@/lib/services/journal.service';

export function createInitialMockState(): {
  account: Account;
  closedTrades: Trade[];
  analytics: AnalyticsSnapshot;
  journal: JournalEntry[];
} {
  const baseAccount: Account = {
    balance: 100_000,
    equity: 101_250,
    marginUsed: 12_500,
    freeMargin: 88_750,
    dailyPnL: 1_250,
    maxDrawdown: -2_000,
    riskUsedPercent: 8,
  };

  const closedTrades: Trade[] = Array.from({ length: 8 }).map((_, i) => {
    const win = i % 2 === 0;
    const pnl = win ? 350 + i * 25 : -220 - i * 20;
    return {
      id: `SEED-${i}`,
      instrument: i % 3 === 0 ? 'EURUSD' : i % 3 === 1 ? 'BTCUSD' : 'AAPL',
      direction: i % 2 === 0 ? 'long' : 'short',
      entryPrice: 1.1,
      stopLoss: 1.095,
      takeProfit: 1.12,
      lotSize: 1,
      riskPercent: 1,
      status: 'closed',
      entryTime: new Date(Date.now() - (i + 4) * 3_600_000).toISOString(),
      exitTime: new Date(Date.now() - (i + 3) * 3_600_000).toISOString(),
      pnl,
      duration: 3_600,
      rrRatio: 2,
      qualityScore: win ? 80 : 65,
      emotionalTag: win ? undefined : 'fear',
      disciplineScore: win ? 90 : 75,
    };
  });

  const analytics = computeAnalyticsSnapshot(closedTrades);
  const journal: JournalEntry[] = closedTrades.map((t) => createJournalEntry(t));

  return {
    account: baseAccount,
    closedTrades,
    analytics,
    journal,
  };
}

