import type { Trade } from './trade';

export type MistakeType =
  | 'Moved SL'
  | 'Exceeded risk'
  | 'Overtraded'
  | 'Closed early'
  | 'None';

export interface JournalEntry {
  id: string;
  tradeId: string;
  createdAt: string;
  snapshot: Trade;
  disciplineScore: number;
  emotionalTag?: string;
  mistakes: MistakeType[];
  notes?: string;
}

