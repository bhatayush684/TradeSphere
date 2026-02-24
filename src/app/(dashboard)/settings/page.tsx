'use client';

import { useTradingStore } from '@/store/tradingStore';

export default function SettingsPage() {
  const { risk, setRiskSettings } = useTradingStore();

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-3 max-w-lg">
      <h1 className="text-sm font-semibold text-slate-100">Risk Settings</h1>
      <p className="text-[11px] text-slate-400">
        Configure your risk guardrails. The trade engine will block orders that exceed
        these thresholds.
      </p>
      <form
        className="space-y-3 text-[11px]"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <Field
          label="Max daily loss (USD)"
          defaultValue={risk.maxDailyLoss}
          onChange={(value) =>
            setRiskSettings({ maxDailyLoss: Number.isNaN(value) ? risk.maxDailyLoss : value })
          }
        />
        <Field
          label="Max trades per day"
          defaultValue={risk.maxTradesPerDay}
          onChange={(value) =>
            setRiskSettings({
              maxTradesPerDay: Number.isNaN(value) ? risk.maxTradesPerDay : value,
            })
          }
        />
        <Field
          label="Max risk per trade (%)"
          defaultValue={risk.maxRiskPerTrade}
          onChange={(value) =>
            setRiskSettings({
              maxRiskPerTrade: Number.isNaN(value) ? risk.maxRiskPerTrade : value,
            })
          }
        />
        <p className="text-[10px] text-slate-500 pt-1">
          Note: when limits are breached, new trades will be blocked with a clear message
          in the Trade Terminal.
        </p>
      </form>
    </div>
  );
}

function Field({
  label,
  defaultValue,
  onChange,
}: {
  label: string;
  defaultValue: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-slate-300">{label}</label>
      <input
        type="number"
        defaultValue={defaultValue}
        onBlur={(e) => onChange(Number(e.target.value))}
        className="w-full rounded bg-slate-950 border border-slate-700 px-3 py-1.5 text-xs text-slate-100"
      />
    </div>
  );
}

