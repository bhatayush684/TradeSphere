export type BrokerType =
  | 'MetaTrader'
  | 'Binance'
  | 'Zerodha'
  | 'Interactive Brokers'
  | 'Coinbase';

export interface BrokerConnection {
  id: string;
  broker: BrokerType;
  apiKeyMasked: string;
  connectedAt: string;
  isSyncing: boolean;
  lastSyncAt?: string;
  error?: string;
}

