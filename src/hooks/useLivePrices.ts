'use client';

import { useEffect, useState } from 'react';
import { marketStream } from '@/lib/websocket/marketStream';

export interface LivePrice {
  instrument: string;
  bid: number;
  ask: number;
  time: string;
}

export function useLivePrices() {
  const [prices, setPrices] = useState<LivePrice[]>([]);

  useEffect(() => {
    const unsubscribe = marketStream.subscribe(({ prices }) => {
      setPrices(prices);
    });
    return () => unsubscribe();
  }, []);

  return prices;
}

