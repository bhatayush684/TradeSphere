'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface EquityPoint {
  time: string;
  equity: number;
}

interface EquityCurveProps {
  data: EquityPoint[];
}

export function EquityCurve({ data }: EquityCurveProps) {
  if (!data.length) {
    return (
      <div className="h-40 rounded-xl border border-slate-800 bg-slate-950/70 flex items-center justify-center text-xs text-slate-500">
        Equity curve will appear here as your simulated history grows.
      </div>
    );
  }

  return (
    <div className="h-40 rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="time" hide />
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
          <Line
            type="monotone"
            dataKey="equity"
            stroke="#38bdf8"
            strokeWidth={2}
            dot={false}
            isAnimationActive
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

