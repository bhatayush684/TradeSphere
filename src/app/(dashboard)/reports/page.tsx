'use client';

import { useTradingStore } from '@/store/tradingStore';

export default function ReportsPage() {
  const { analytics } = useTradingStore();

  return (
    <div className="rounded-xl border border-slate-900 bg-slate-950/80 p-4 space-y-3">
      <h1 className="text-sm font-semibold text-slate-100">Performance Reports</h1>
      <p className="text-sm text-slate-400">
        Investor-grade overview of your simulated track record, including expectancy,
        risk-adjusted returns, and drawdown profile.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
        <Metric label="Expectancy" value={analytics.expectancy} />
        <Metric label="Profit Factor" value={analytics.profitFactor} />
        <Metric label="Sharpe" value={analytics.sharpeRatio} />
        <Metric label="Max Drawdown" value={analytics.maxDrawdown} />
        <Metric label="Win Rate" value={analytics.winRate} suffix="%" />
        <Metric label="Loss Rate" value={analytics.lossRate} suffix="%" />
      </div>
      <div className="flex items-center gap-2 text-sm pt-2">
        <button className="px-3 py-1.5 rounded bg-slate-50 text-slate-950 font-semibold hover:bg-white">
          Download PDF (UI only)
        </button>
        <label className="flex items-center gap-1 text-slate-300">
          <input type="checkbox" className="rounded border-slate-600 bg-slate-900" />
          Share verified performance (simulated)
        </label>
      </div>
    </div>
  );
}

function Metric({ label, value, suffix }: { label: string; value: number; suffix?: string }) {
  return (
    <div className="rounded-lg border border-slate-900 bg-slate-950/80 px-3 py-2">
      <p className="text-[12px] text-slate-400 mb-1">{label}</p>
      <p className="text-sm font-semibold text-slate-100">
        {value.toFixed(2)}
        {suffix}
      </p>
    </div>
  );
}

