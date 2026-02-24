type PriceTick = {
  instrument: string;
  bid: number;
  ask: number;
  time: string;
};

type EquityUpdate = {
  equity: number;
  marginUsed: number;
};

type Subscriber = (payload: {
  prices: PriceTick[];
  equity: EquityUpdate;
  exposure: { long: number; short: number };
  now: string;
}) => void;

class MarketStream {
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private subscribers = new Set<Subscriber>();
  private equity = 100_000;
  private marginUsed = 10_000;

  start() {
    if (this.intervalId) return;
    this.intervalId = setInterval(() => this.tick(), 2000);
  }

  stop() {
    if (this.intervalId) clearInterval(this.intervalId);
    this.intervalId = null;
  }

  subscribe(subscriber: Subscriber) {
    this.subscribers.add(subscriber);
    this.start();
    return () => {
      this.subscribers.delete(subscriber);
      if (this.subscribers.size === 0) {
        this.stop();
      }
    };
  }

  private tick() {
    const now = new Date().toISOString();
    const instruments = [
      'EURUSD',
      'GBPUSD',
      'USDJPY',
      'XAUUSD',
      'BTCUSD',
      'ETHUSD',
      'SPX500',
      'NAS100',
      'NIFTY',
      'AAPL',
      'TSLA',
    ];
    const prices = instruments.map((inst) => {
      const base = 1 + Math.random();
      const spread = 0.0002 + Math.random() * 0.0005;
      const bid = base + (Math.random() - 0.5) * 0.01;
      return {
        instrument: inst,
        bid,
        ask: bid + spread,
        time: now,
      };
    });

    this.equity += (Math.random() - 0.5) * 200;
    this.marginUsed = 10_000 + (Math.random() - 0.5) * 2_000;

    const exposure = {
      long: 50 + Math.random() * 30,
      short: 50 - Math.random() * 30,
    };

    const payload = {
      prices,
      equity: { equity: this.equity, marginUsed: this.marginUsed },
      exposure,
      now,
    };

    this.subscribers.forEach((s) => s(payload));
  }
}

export const marketStream = new MarketStream();

