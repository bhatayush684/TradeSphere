'use client';

import { useTradingStore } from '@/store/tradingStore';

export default function EdgeDiscoveryPage() {
  const { analytics } = useTradingStore();

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-3">
      <h1 className="text-sm font-semibold text-slate-100">
        Edge Discovery Engine
      </h1>
      <p className="text-[11px] text-slate-400">
        This module analyzes your simulated history for pockets of edge:
        instruments, time windows, and durations where your expectancy is highest.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px]">
        <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
          <p className="text-[10px] text-slate-400 mb-1">Best Instrument</p>
          <p className="text-xs font-semibold text-slate-100">
            {analytics.bestInstrument ?? 'Awaiting data'}
          </p>
          <p className="mt-1 text-[10px] text-slate-500">
            Based on per-trade expectancy across your history.
          </p>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
          <p className="text-[10px] text-slate-400 mb-1">Worst Setup</p>
          <p className="text-xs font-semibold text-slate-100">
            {analytics.worstSetup ?? 'Awaiting data'}
          </p>
          <p className="mt-1 text-[10px] text-slate-500">
            Candidates for de-prioritisation or rule tightening.
          </p>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
          <p className="text-[10px] text-slate-400 mb-1">Edge Confidence</p>
          <p className="text-xs font-semibold text-slate-100">
            {Math.max(0, 100 - analytics.overtradingScore).toFixed(0)} / 100
          </p>
          <p className="mt-1 text-[10px] text-slate-500">
            Higher when results are consistent and sample size is healthier.
          </p>
        </div>
      </div>
    </div>
  );
}

