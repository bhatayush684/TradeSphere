'use client';

import { useTradingStore } from '@/store/tradingStore';

export default function JournalPage() {
  const { journal } = useTradingStore();

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
      <h1 className="text-sm font-semibold text-slate-100 mb-3">
        Trading Journal
      </h1>
      <p className="text-[11px] text-slate-400 mb-3">
        Every closed trade is logged with discipline score and basic mistake
        detection. Use this to review behavior, not just PnL.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-[11px] text-slate-300">
          <thead className="text-[10px] uppercase tracking-wide text-slate-500 border-b border-slate-800">
            <tr>
              <th className="py-1.5 text-left">Trade</th>
              <th className="py-1.5 text-left">Instrument</th>
              <th className="py-1.5 text-right">PnL</th>
              <th className="py-1.5 text-right">R:R</th>
              <th className="py-1.5 text-right">Discipline</th>
              <th className="py-1.5 text-left">Mistakes</th>
            </tr>
          </thead>
          <tbody>
            {journal.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-4 text-center text-slate-500 text-[11px]"
                >
                  No journal entries yet. Close some simulated trades to populate this
                  view.
                </td>
              </tr>
            ) : (
              journal.map((entry) => (
                <tr key={entry.id} className="border-b border-slate-900/60">
                  <td className="py-1.5 pr-2">{entry.tradeId.slice(-6)}</td>
                  <td className="py-1.5 pr-2">{entry.snapshot.instrument}</td>
                  <td className="py-1.5 pr-2 text-right text-slate-100">
                    {entry.snapshot.pnl.toFixed(0)}
                  </td>
                  <td className="py-1.5 pr-2 text-right">
                    {entry.snapshot.rrRatio.toFixed(2)}
                  </td>
                  <td className="py-1.5 pr-2 text-right">
                    {entry.disciplineScore}
                  </td>
                  <td className="py-1.5 pr-2">
                    {entry.mistakes.join(', ')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

