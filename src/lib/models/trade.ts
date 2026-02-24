export type TradeDirection = 'long' | 'short';

export type TradeStatus = 'pending' | 'open' | 'closed' | 'cancelled';

export interface Trade {
  id: string;
  instrument: string;
  direction: TradeDirection;
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  lotSize: number;
  riskPercent: number;
  status: TradeStatus;
  entryTime: string;
  exitTime?: string;
  pnl: number;
  duration: number;
  rrRatio: number;
  qualityScore: number;
  emotionalTag?: string;
  disciplineScore: number;
}

