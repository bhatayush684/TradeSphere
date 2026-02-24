'use client';

import { useState } from 'react';
import { useTradingStore } from '@/store/tradingStore';
import { aiCoachService } from '@/lib/services/aiCoach.service';

export default function AICoachPage() {
  const { closedTrades } = useTradingStore();
  const [input, setInput] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!input.trim()) return;
    setLoading(true);
    const insight = await aiCoachService.chat(input, closedTrades);
    setResponse(insight.message);
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <section className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-3">
        <h1 className="text-sm font-semibold text-slate-100">AI Trade Coach</h1>
        <p className="text-[11px] text-slate-400">
          Ask questions about your simulated performance, risk, and behavior. Responses
          are generated from dummy logic but wired to your trade history.
        </p>
        <div className="space-y-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={4}
            className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-[11px] text-slate-100"
            placeholder="e.g. What should I improve in my risk management?"
          />
          <button
            onClick={handleAsk}
            disabled={loading}
            className="px-4 py-1.5 rounded bg-sky-500 text-slate-950 text-xs font-semibold hover:bg-sky-400 disabled:opacity-60"
          >
            {loading ? 'Thinking…' : 'Ask Coach'}
          </button>
        </div>
        {response && (
          <div className="mt-3 rounded border border-slate-700 bg-slate-950/80 px-3 py-2 text-[11px] text-slate-100">
            {response}
          </div>
        )}
      </section>
      <section className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-[11px] text-slate-300">
        <h2 className="text-xs font-semibold text-slate-100 mb-2">
          How this works (prototype)
        </h2>
        <ul className="list-disc list-inside space-y-1 text-slate-400">
          <li>Pre-trade, live, and post-trade signals are computed from dummy rules.</li>
          <li>
            As you close trades, the coach sees more history and references your win
            rate and RR.
          </li>
          <li>
            In a real integration, this layer would call out to an LLM with your
            anonymised stats and journal.
          </li>
        </ul>
      </section>
    </div>
  );
}

