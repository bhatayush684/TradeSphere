import { calculatePositionSize } from '@/lib/risk-engine/positionSizing';
import { calculateRRRatio } from '@/lib/calculations/rrCalculator';
import type { Trade } from '@/lib/models/trade';

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

class TradeService {
  private trades = new Map<string, Trade>();

  async placeOrder(params: {
    instrument: string;
    direction: Trade['direction'];
    entryPrice: number;
    stopLoss: number;
    takeProfit: number;
    riskPercent: number;
    accountBalance: number;
    orderType: 'market' | 'limit' | 'stop' | 'trailing-stop';
  }): Promise<Trade> {
    await delay(600);

    const lotSize = calculatePositionSize({
      accountBalance: params.accountBalance,
      riskPercent: params.riskPercent,
      entryPrice: params.entryPrice,
      stopLoss: params.stopLoss,
    });

    const rrRatio = calculateRRRatio(params.entryPrice, params.stopLoss, params.takeProfit);

    const now = new Date().toISOString();
    const id = `T-${Date.now()}-${Math.random().toString(16).slice(2)}`;

    const trade: Trade = {
      id,
      instrument: params.instrument,
      direction: params.direction,
      entryPrice: params.entryPrice,
      stopLoss: params.stopLoss,
      takeProfit: params.takeProfit,
      lotSize,
      riskPercent: params.riskPercent,
      status: 'open',
      entryTime: now,
      pnl: 0,
      duration: 0,
      rrRatio,
      qualityScore: 0,
      emotionalTag: undefined,
      disciplineScore: 100,
    };

    this.trades.set(id, trade);
    return trade;
  }

  updateTradePrice(trade: Trade, currentPrice: number): Trade {
    const directionFactor = trade.direction === 'long' ? 1 : -1;
    const priceDiff = (currentPrice - trade.entryPrice) * directionFactor;
    const pnl = priceDiff * trade.lotSize * 1000;

    let status = trade.status;
    let exitTime = trade.exitTime;

    if (directionFactor === 1) {
      if (currentPrice <= trade.stopLoss || currentPrice >= trade.takeProfit) {
        status = 'closed';
        exitTime = new Date().toISOString();
      }
    } else {
      if (currentPrice >= trade.stopLoss || currentPrice <= trade.takeProfit) {
        status = 'closed';
        exitTime = new Date().toISOString();
      }
    }

    const updated: Trade = {
      ...trade,
      pnl,
      status,
      exitTime,
    };

    this.trades.set(trade.id, updated);
    return updated;
  }
}

export const tradeService = new TradeService();

