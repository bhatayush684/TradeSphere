import type { Trade } from '@/lib/models/trade';
import type { JournalEntry, MistakeType } from '@/lib/models/journal';

export function classifyMistakes(trade: Trade): MistakeType[] {
  const mistakes: MistakeType[] = [];

  if (trade.riskPercent > 2) mistakes.push('Exceeded risk');
  if (trade.duration < 60 && trade.pnl < 0) mistakes.push('Closed early');
  if (trade.rrRatio < 1) mistakes.push('Moved SL');

  if (mistakes.length === 0) mistakes.push('None');
  return mistakes;
}

export function computeDisciplineScore(trade: Trade, mistakes: MistakeType[]): number {
  let score = 100;
  if (mistakes.includes('Exceeded risk')) score -= 30;
  if (mistakes.includes('Moved SL')) score -= 20;
  if (mistakes.includes('Overtraded')) score -= 20;
  if (mistakes.includes('Closed early')) score -= 15;
  return Math.max(0, score);
}

export function createJournalEntry(trade: Trade): JournalEntry {
  const mistakes = classifyMistakes(trade);
  const disciplineScore = computeDisciplineScore(trade, mistakes);

  return {
    id: `J-${trade.id}`,
    tradeId: trade.id,
    createdAt: new Date().toISOString(),
    snapshot: trade,
    disciplineScore,
    emotionalTag: trade.emotionalTag,
    mistakes,
  };
}

