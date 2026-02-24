import type { BrokerConnection, BrokerType } from '@/lib/models/broker';
import type { Trade } from '@/lib/models/trade';

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

class BrokerConnectorService {
  async validateCredentials(broker: BrokerType, apiKey: string, apiSecret: string) {
    await delay(1000);
    if (!apiKey || !apiSecret) throw new Error('Missing credentials');
    if (apiKey.length < 8) throw new Error('API key invalid');
    return true;
  }

  async connect(broker: BrokerType, apiKey: string, apiSecret: string): Promise<BrokerConnection> {
    await this.validateCredentials(broker, apiKey, apiSecret);
    await delay(1000);
    return {
      id: `BR-${broker}-${Date.now()}`,
      broker,
      apiKeyMasked: `${apiKey.slice(0, 4)}****${apiKey.slice(-2)}`,
      connectedAt: new Date().toISOString(),
      isSyncing: false,
      lastSyncAt: undefined,
    };
  }

  async importHistory(broker: BrokerType): Promise<Trade[]> {
    await delay(1500);
    const now = Date.now();
    return Array.from({ length: 12 }).map((_, i) => ({
      id: `H-${broker}-${i}`,
      instrument: i % 3 === 0 ? 'BTCUSD' : 'EURUSD',
      direction: i % 2 === 0 ? 'long' : 'short',
      entryPrice: 1.1,
      stopLoss: 1.095,
      takeProfit: 1.12,
      lotSize: 1,
      riskPercent: 1,
      status: 'closed',
      entryTime: new Date(now - (i + 2) * 3600_000).toISOString(),
      exitTime: new Date(now - (i + 1) * 3600_000).toISOString(),
      pnl: (i % 2 === 0 ? 1 : -1) * (100 + i * 10),
      duration: 3600,
      rrRatio: 2,
      qualityScore: 80,
      emotionalTag: i % 4 === 0 ? 'greed' : undefined,
      disciplineScore: 90,
    }));
  }
}

export const brokerConnectorService = new BrokerConnectorService();

