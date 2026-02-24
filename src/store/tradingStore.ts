'use client';

import { create } from 'zustand';
import type { Account } from '@/lib/models/account';
import type { Trade } from '@/lib/models/trade';
import type { JournalEntry } from '@/lib/models/journal';
import type { RiskSettings } from '@/lib/models/risk-settings';
import type { AnalyticsSnapshot } from '@/lib/models/analytics';
import type { BrokerConnection } from '@/lib/models/broker';
import type { AIInsight } from '@/lib/models/ai';
import { tradeService } from '@/lib/services/trade.service';
import { computeAnalyticsSnapshot } from '@/lib/services/analytics.service';
import { createJournalEntry } from '@/lib/services/journal.service';
import { brokerConnectorService } from '@/lib/services/brokerConnector.service';
import { createInitialMockState } from '@/lib/mock/initialState';

export interface TradingState {
  account: Account;
  openTrades: Trade[];
  closedTrades: Trade[];
  journal: JournalEntry[];
  risk: RiskSettings;
  analytics: AnalyticsSnapshot;
  brokers: BrokerConnection[];
  aiInsights: AIInsight[];
  placingOrder: boolean;
  error?: string;
  // actions
  placeTrade: (params: {
    instrument: string;
    direction: Trade['direction'];
    entryPrice: number;
    stopLoss: number;
    takeProfit: number;
    riskPercent: number;
    orderType: 'market' | 'limit' | 'stop' | 'trailing-stop';
  }) => Promise<void>;
  updateFromPrice: (instrument: string, price: number) => void;
  connectBroker: (broker: BrokerConnection['broker'], apiKey: string, apiSecret: string) => Promise<void>;
  applyPnLToAccount: () => void;
  setRiskSettings: (partial: Partial<RiskSettings>) => void;
}

const seeded = createInitialMockState();

const defaultAccount: Account = seeded.account;

const defaultRisk: RiskSettings = {
  maxDailyLoss: 2_000,
  maxTradesPerDay: 20,
  maxRiskPerTrade: 2,
};

const emptyAnalytics: AnalyticsSnapshot = seeded.analytics;

export const useTradingStore = create<TradingState>((set, get) => ({
  account: defaultAccount,
  openTrades: [],
  closedTrades: seeded.closedTrades,
  journal: seeded.journal,
  risk: defaultRisk,
  analytics: emptyAnalytics,
  brokers: [],
  aiInsights: [],
  placingOrder: false,
  error: undefined,

  async placeTrade(params) {
    const { account, openTrades, risk, closedTrades } = get();

    // basic risk checks
    const tradesToday = openTrades.length + closedTrades.length;
    if (tradesToday >= risk.maxTradesPerDay) {
      set({ error: 'Max trades per day exceeded.' });
      return;
    }
    if (params.riskPercent > risk.maxRiskPerTrade) {
      set({ error: 'Risk per trade exceeds configured maximum.' });
      return;
    }
    if (Math.abs(account.dailyPnL) >= risk.maxDailyLoss) {
      set({ error: 'Max daily loss reached. New trades blocked.' });
      return;
    }

    try {
      set({ placingOrder: true, error: undefined });
      const trade = await tradeService.placeOrder({
        ...params,
        accountBalance: account.balance,
      });
      set((state) => ({
        openTrades: [...state.openTrades, trade],
        placingOrder: false,
      }));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to place trade';
      set({ error: message, placingOrder: false });
    }
  },

  updateFromPrice(instrument, price) {
    const { openTrades, closedTrades, account } = get();
    const updatedOpen: Trade[] = [];
    const newlyClosed: Trade[] = [...closedTrades];

    openTrades.forEach((t) => {
      if (t.instrument !== instrument) {
        updatedOpen.push(t);
        return;
      }
      const updated = tradeService.updateTradePrice(t, price);
      if (updated.status === 'closed') {
        newlyClosed.push(updated);
      } else {
        updatedOpen.push(updated);
      }
    });

    const totalClosedPnl = newlyClosed.reduce((sum, t) => sum + t.pnl, 0);
    const newEquity = account.balance + totalClosedPnl;
    const dailyPnL = totalClosedPnl;

    const analytics = computeAnalyticsSnapshot(newlyClosed);

    const newJournalEntries: JournalEntry[] = [];
    newlyClosed.forEach((t) => {
      if (!get().journal.find((j) => j.tradeId === t.id)) {
        newJournalEntries.push(createJournalEntry(t));
      }
    });

    set((state) => ({
      openTrades: updatedOpen,
      closedTrades: newlyClosed,
      account: {
        ...state.account,
        equity: newEquity,
        freeMargin: newEquity - state.account.marginUsed,
        dailyPnL,
        maxDrawdown: Math.max(state.account.maxDrawdown, -dailyPnL),
      },
      analytics,
      journal: [...state.journal, ...newJournalEntries],
    }));
  },

  async connectBroker(broker, apiKey, apiSecret) {
    const current = get().brokers;
    try {
      const connection = await brokerConnectorService.connect(broker, apiKey, apiSecret);
      const history = await brokerConnectorService.importHistory(broker);
      const analytics = computeAnalyticsSnapshot(history);
      set((state) => ({
        brokers: [...current, connection],
        closedTrades: [...state.closedTrades, ...history],
        analytics,
      }));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Broker connection failed';
      set({ error: message });
    }
  },

  applyPnLToAccount() {
    const { closedTrades } = get();
    const totalClosedPnl = closedTrades.reduce((sum, t) => sum + t.pnl, 0);
    set((state) => ({
      account: {
        ...state.account,
        balance: defaultAccount.balance + totalClosedPnl,
      },
    }));
  },

  setRiskSettings(partial) {
    set((state) => ({
      risk: {
        ...state.risk,
        ...partial,
      },
    }));
  },
}));

