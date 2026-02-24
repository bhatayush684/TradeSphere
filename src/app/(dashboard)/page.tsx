'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useTradingStore } from '@/store/tradingStore';
import { EquityCurve } from '@/components/charts/EquityCurve';

export default function DashboardPage() {
  const { account, analytics } = useTradingStore();
  const [equityPoints, setEquityPoints] = useState<
    { time: string; equity: number }[]
  >([]);

  useEffect(() => {
    const now = new Date().toLocaleTimeString();
    setEquityPoints((prev) => {
      const next = [...prev, { time: now, equity: account.equity }];
      return next.slice(-30);
    });
  }, [account.equity]);

  const overviewMetrics = useMemo(
    () => [
      { label: 'Balance', value: account.balance, suffix: ' USD', highlight: false },
      { label: 'Equity', value: account.equity, suffix: ' USD', highlight: true },
      { label: 'Margin Used', value: account.marginUsed, suffix: ' USD', highlight: false },
      { label: 'Free Margin', value: account.freeMargin, suffix: ' USD', highlight: false },
      { label: 'Daily PnL', value: account.dailyPnL, suffix: ' USD', highlight: false },
      { label: 'Risk Used', value: account.riskUsedPercent, suffix: ' %', highlight: false },
    ],
    [account]
  );

  return (
    <div className="space-y-5">
      <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {overviewMetrics.map((m) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <MetricCard
              label={m.label}
              value={m.value}
              suffix={m.suffix}
              highlight={m.highlight}
            />
          </motion.div>
        ))}
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-3"
        >
          <h2 className="text-sm font-semibold text-slate-100">
            Equity Curve (demo)
          </h2>
          <EquityCurve data={equityPoints} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-slate-800 bg-slate-900/70 p-4"
        >
          <h2 className="text-xs font-semibold text-slate-200 mb-2">
            Performance Snapshot
          </h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Stat label="Win Rate" value={analytics.winRate} suffix="%" />
            <Stat label="Loss Rate" value={analytics.lossRate} suffix="%" />
            <Stat label="Expectancy" value={analytics.expectancy} suffix="" />
            <Stat label="Profit Factor" value={analytics.profitFactor} suffix="" />
            <Stat label="Sharpe" value={analytics.sharpeRatio} suffix="" />
            <Stat label="Avg RR" value={analytics.avgRR} suffix="" />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-4"
        >
          <h2 className="text-xs font-semibold text-slate-200 mb-2">
            Edge Overview
          </h2>
          <p className="text-[12px] text-slate-300">
            Best instrument:{' '}
            <span className="text-slate-100">
              {analytics.bestInstrument ?? 'TBD'}
            </span>
            <br />
            Worst setup:{' '}
            <span className="text-slate-100">
              {analytics.worstSetup ?? 'TBD'}
            </span>
            <br />
            Overtrading score:{' '}
            <span className="text-slate-100">{analytics.overtradingScore}</span>
          </p>
        </motion.div>
      </section>
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: number;
  suffix?: string;
  highlight?: boolean;
}

function MetricCard({ label, value, suffix, highlight }: MetricCardProps) {
  return (
    <div
      className={`rounded-xl border px-3 py-3 flex flex-col gap-1 bg-slate-900/85 ${
        highlight
          ? 'border-slate-400 shadow-[0_0_24px_rgba(15,23,42,0.9)]'
          : 'border-slate-800'
      }`}
    >
      <span className="text-xs text-slate-400">{label}</span>
      <span className="text-base font-semibold tabular-nums text-slate-50">
        {value.toFixed(0)}
        {suffix}
      </span>
    </div>
  );
}

interface StatProps {
  label: string;
  value: number;
  suffix?: string;
}

function Stat({ label, value, suffix }: StatProps) {
  return (
    <div className="flex flex-col">
      <span className="text-[12px] text-slate-400">{label}</span>
      <span className="text-sm font-semibold text-slate-50">
        {value.toFixed(2)}
        {suffix}
      </span>
    </div>
  );
}

