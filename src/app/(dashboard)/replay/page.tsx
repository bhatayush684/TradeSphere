'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

type Candle = { idx: number; close: number };

function createReplaySeries(): Candle[] {
  const candles: Candle[] = [];
  let price = 100;
  for (let i = 0; i < 120; i++) {
    const drift = (Math.random() - 0.5) * 2;
    price = Math.max(80, price + drift);
    candles.push({ idx: i, close: Number(price.toFixed(2)) });
  }
  return candles;
}

export default function ReplayPage() {
  const [series] = useState<Candle[]>(() => createReplaySeries());
  const [index, setIndex] = useState(40);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setIndex((prev) => {
        if (prev >= series.length - 1) return prev;
        return prev + 1;
      });
    }, 400);
    return () => clearInterval(id);
  }, [playing, series.length]);

  const visible = useMemo(() => series.slice(0, index), [series, index]);

  const startPrice = visible[0]?.close ?? 100;
  const endPrice = visible[visible.length - 1]?.close ?? startPrice;
  const pnl = endPrice - startPrice;

  return (
    <div className="rounded-xl border border-slate-900 bg-slate-950/80 p-4 space-y-3">
      <h1 className="text-sm font-semibold text-slate-100">
        Market Replay Simulator (Prototype)
      </h1>
      <p className="text-sm text-slate-400">
        Play back a dummy intraday session. In a full build, trades placed here would
        track separately from your live account metrics.
      </p>
      <div className="flex items-center gap-2 text-sm">
        <button
          className="px-3 py-1.5 rounded bg-slate-50 text-slate-950 font-semibold hover:bg-white"
          onClick={() => setPlaying(true)}
        >
          Play
        </button>
        <button
          className="px-3 py-1.5 rounded border border-slate-700 text-slate-300 hover:bg-slate-900/70"
          onClick={() => setPlaying(false)}
        >
          Pause
        </button>
        <button
          className="px-3 py-1.5 rounded border border-slate-700 text-slate-300 hover:bg-slate-900/70"
          onClick={() => {
            setPlaying(false);
            setIndex(40);
          }}
        >
          Reset
        </button>
      </div>
      <div className="mt-3 h-48 rounded-lg border border-slate-900 bg-slate-950/90 px-2 py-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={visible}>
            <XAxis dataKey="idx" hide />
            <YAxis
              stroke="#64748b"
              tickLine={false}
              axisLine={false}
              fontSize={10}
              width={40}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#020617',
                borderColor: '#1f2937',
                fontSize: 11,
              }}
            />
            <Area
              type="monotone"
              dataKey="close"
              stroke="#e5e7eb"
              fill="#020617"
              strokeWidth={2}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <p className="text-sm text-slate-300">
        Replay PnL:{' '}
        <span className="text-slate-100">
          {pnl.toFixed(2)} pts
        </span>
      </p>
    </div>
  );
}


