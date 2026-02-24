export interface AnalyticsSnapshot {
  winRate: number;
  lossRate: number;
  expectancy: number;
  profitFactor: number;
  sharpeRatio: number;
  maxDrawdown: number;
  avgRR: number;
  bestInstrument: string | null;
  worstSetup: string | null;
  overtradingScore: number;
}

