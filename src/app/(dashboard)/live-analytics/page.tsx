'use client';

import { useMemo } from 'react';
import { useTradingStore } from '@/store/tradingStore';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

const WIN_COLOR = '#e5e7eb';
const LOSS_COLOR = '#4b5563';

export default function LiveAnalyticsPage() {
  const { analytics, account, closedTrades } = useTradingStore();

  const winLossData = useMemo(() => {
    const wins = closedTrades.filter((t) => t.pnl > 0).length || 0;
    const losses = closedTrades.filter((t) => t.pnl < 0).length || 0;
    if (!wins && !losses) {
      return [
        { name: 'No trades', value: 1 },
      ];
    }
    return [
      { name: 'Wins', value: wins },
      { name: 'Losses', value: losses },
    ];
  }, [closedTrades]);

  const equitySeries = useMemo(() => {
    let equity = account.balance;
    const points = closedTrades
      .slice()
      .sort(
        (a, b) =>
          new Date(a.exitTime ?? a.entryTime).getTime() -
          new Date(b.exitTime ?? b.entryTime).getTime()
      )
      .map((t, idx) => {
        equity += t.pnl;
        return {
          idx,
          equity,
        };
      });
    return points;
  }, [account.balance, closedTrades]);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <section className="xl:col-span-2 rounded-xl border border-slate-900 bg-slate-950/80 p-4 space-y-3">
        <h1 className="text-sm font-semibold text-slate-100">
          Live Risk & Performance
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <Metric label="Win Rate" value={analytics.winRate} suffix="%" />
          <Metric label="Loss Rate" value={analytics.lossRate} suffix="%" />
          <Metric label="Expectancy / trade" value={analytics.expectancy} />
          <Metric label="Profit Factor" value={analytics.profitFactor} />
          <Metric label="Sharpe" value={analytics.sharpeRatio} />
          <Metric label="Avg R:R" value={analytics.avgRR} />
          <Metric label="Max Drawdown" value={analytics.maxDrawdown} />
          <Metric label="Overtrading Score" value={analytics.overtradingScore} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3">
          <div className="h-40 rounded-lg border border-slate-900 bg-slate-950/80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={winLossData}
                  dataKey="value"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={3}
                >
                  {winLossData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={
                        entry.name === 'Wins'
                          ? WIN_COLOR
                          : entry.name === 'Losses'
                          ? LOSS_COLOR
                          : '#64748b'
                      }
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#020617',
                    borderColor: '#1f2937',
                    fontSize: 11,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="h-40 rounded-lg border border-slate-900 bg-slate-950/80 px-2 py-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={equitySeries}>
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
                  dataKey="equity"
                  stroke="#e5e7eb"
                  fill="#020617"
                  strokeWidth={2}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
      <section className="rounded-xl border border-slate-900 bg-slate-950/80 p-4">
        <h2 className="text-sm font-semibold text-slate-100 mb-2">Account State</h2>
        <p className="text-sm text-slate-300">
          Balance:{' '}
          <span className="text-slate-100">{account.balance.toFixed(0)} USD</span>
          <br />
          Equity:{' '}
          <span className="text-slate-100">{account.equity.toFixed(0)} USD</span>
          <br />
          Daily PnL:{' '}
          <span className="text-slate-200">
            {account.dailyPnL.toFixed(0)} USD
          </span>
        </p>
      </section>
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
