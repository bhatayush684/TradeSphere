import type { Trade } from '@/lib/models/trade';
import type { AIInsight, AIInsightType, AISeverity } from '@/lib/models/ai';

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

class AICoachService {
  private history: Trade[] = [];

  setHistory(trades: Trade[]) {
    this.history = trades;
  }

  private createInsight(type: AIInsightType, severity: AISeverity, message: string): AIInsight {
    return {
      id: `AI-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      type,
      severity,
      message,
      timestamp: new Date().toISOString(),
    };
  }

  getPreTradeWarnings(trade: Trade): AIInsight[] {
    const insights: AIInsight[] = [];
    const winRate =
      this.history.length === 0
        ? 50
        : (this.history.filter((t) => t.pnl > 0).length / this.history.length) * 100;

    if (winRate < 40) {
      insights.push(
        this.createInsight(
          'preTrade',
          'warning',
          `Your historical win rate is ${winRate.toFixed(
            1
          )}%. Consider reducing size or skipping marginal setups.`
        )
      );
    }
    if (trade.riskPercent > 2) {
      insights.push(
        this.createInsight(
          'preTrade',
          'critical',
          `Risk per trade is ${trade.riskPercent}%, above your configured limit.`
        )
      );
    }

    return insights;
  }

  getLiveWarnings(trade: Trade): AIInsight[] {
    const insights: AIInsight[] = [];
    if (trade.duration > 60 * 60) {
      insights.push(
        this.createInsight(
          'live',
          'warning',
          `Trade duration exceeded 1 hour. Confirm this still fits your playbook.`
        )
      );
    }
    if (Math.abs(trade.pnl) > 0.03 * 100_000) {
      insights.push(
        this.createInsight(
          'live',
          'critical',
          `Open PnL is large relative to equity. Reassess your risk.`
        )
      );
    }
    return insights;
  }

  getPostTradeFeedback(trade: Trade): AIInsight[] {
    const insights: AIInsight[] = [];
    if (trade.rrRatio < 1 && trade.pnl < 0) {
      insights.push(
        this.createInsight(
          'postTrade',
          'warning',
          `Losing trade with RR < 1. Focus on asymmetric setups with higher RR.`
        )
      );
    }
    if (trade.emotionalTag === 'fear') {
      insights.push(
        this.createInsight(
          'behavioral',
          'info',
          `You tagged this trade as fear-driven. Consider pre-defined exit rules to reduce discretion.`
        )
      );
    }
    return insights;
  }

  async chat(message: string, contextTrades: Trade[]): Promise<AIInsight> {
    await delay(800);
    const summary =
      contextTrades.length === 0
        ? 'No trade history yet. Start logging trades to unlock deeper coaching.'
        : `You have ${contextTrades.length} trades logged. Focus on your best instrument and consistent RR.`;

    return this.createInsight(
      'behavioral',
      'info',
      `You asked: "${message}". ${summary}`
    );
  }
}

export const aiCoachService = new AICoachService();

