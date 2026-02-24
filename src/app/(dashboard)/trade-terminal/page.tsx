'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTradingStore } from '@/store/tradingStore';
import { useLivePrices } from '@/hooks/useLivePrices';
import { motion } from 'framer-motion';

const ticketSchema = z.object({
  instrument: z.string().min(1),
  direction: z.enum(['long', 'short']),
  orderType: z.enum(['market', 'limit', 'stop', 'trailing-stop']),
  entryPrice: z.coerce.number().positive(),
  stopLoss: z.coerce.number().positive(),
  takeProfit: z.coerce.number().positive(),
  riskPercent: z.coerce.number().min(0.1).max(5),
});

type TicketValues = z.infer<typeof ticketSchema>;

export default function TradeTerminalPage() {
  const { account, openTrades, placingOrder, error, placeTrade, connectBroker, brokers } =
    useTradingStore();
  const [showBrokerModal, setShowBrokerModal] = useState(false);
  const [brokerType, setBrokerType] = useState('MetaTrader');
  const prices = useLivePrices();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TicketValues>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      instrument: 'EURUSD',
      direction: 'long',
      orderType: 'market',
      entryPrice: 1.1,
      stopLoss: 1.095,
      takeProfit: 1.12,
      riskPercent: 1,
    },
  });

  const onSubmit = async (values: TicketValues) => {
    await placeTrade(values);
  };

  const handleConnectBroker = async (formData: FormData) => {
    const apiKey = String(formData.get('apiKey') ?? '');
    const apiSecret = String(formData.get('apiSecret') ?? '');
    // @ts-expect-error broker type narrowing
    await connectBroker(brokerType, apiKey, apiSecret);
    setShowBrokerModal(false);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <motion.section
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-3"
      >
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold text-slate-100">Order Ticket</h1>
            <p className="text-[11px] text-slate-400">
              Place fully simulated orders with live mock prices and risk checks.
            </p>
          </div>
          <button
            onClick={() => setShowBrokerModal(true)}
            className="text-[11px] px-2 py-1 rounded border border-slate-500/70 text-slate-100 hover:bg-slate-900/80"
          >
            Connect Broker
          </button>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 text-[11px]">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block mb-1 text-slate-300">Instrument</label>
              <input
                className="w-full rounded bg-slate-950 border border-slate-700 px-2 py-1 text-xs"
                {...register('instrument')}
              />
              {errors.instrument && (
                <p className="text-[10px] text-red-400 mt-1">
                  {errors.instrument.message}
                </p>
              )}
            </div>
            <div>
              <label className="block mb-1 text-slate-300">Direction</label>
              <select
                className="w-full rounded bg-slate-950 border border-slate-700 px-2 py-1 text-xs"
                {...register('direction')}
              >
                <option value="long">Long</option>
                <option value="short">Short</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block mb-1 text-slate-300">Type</label>
              <select
                className="w-full rounded bg-slate-950 border border-slate-700 px-2 py-1 text-xs"
                {...register('orderType')}
              >
                <option value="market">Market</option>
                <option value="limit">Limit</option>
                <option value="stop">Stop</option>
                <option value="trailing-stop">Trailing</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-slate-300">Entry</label>
              <input
                type="number"
                step="0.0001"
                className="w-full rounded bg-slate-950 border border-slate-700 px-2 py-1 text-xs"
                {...register('entryPrice')}
              />
            </div>
            <div>
              <label className="block mb-1 text-slate-300">Risk %</label>
              <input
                type="number"
                step="0.1"
                className="w-full rounded bg-slate-950 border border-slate-700 px-2 py-1 text-xs"
                {...register('riskPercent')}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block mb-1 text-slate-300">Stop Loss</label>
              <input
                type="number"
                step="0.0001"
                className="w-full rounded bg-slate-950 border border-slate-700 px-2 py-1 text-xs"
                {...register('stopLoss')}
              />
            </div>
            <div>
              <label className="block mb-1 text-slate-300">Take Profit</label>
              <input
                type="number"
                step="0.0001"
                className="w-full rounded bg-slate-950 border border-slate-700 px-2 py-1 text-xs"
                {...register('takeProfit')}
              />
            </div>
          </div>

          {error && (
            <p className="text-[10px] text-red-400 bg-red-950/40 border border-red-900/60 rounded px-2 py-1">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={placingOrder}
            className="mt-3 w-full rounded bg-slate-50 text-slate-900 py-2.5 text-xs font-semibold hover:bg-white transition-colors disabled:opacity-60"
          >
            {placingOrder ? 'Placing…' : 'Place Trade'}
          </button>

          <p className="text-[11px] text-slate-300 mt-2">
            Balance {account.balance.toFixed(0)} USD · Equity {account.equity.toFixed(0)} USD
          </p>
        </form>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="xl:col-span-2 rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-3"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <header>
            <h2 className="text-sm font-semibold text-slate-100">
              Live Price Board
            </h2>
            <p className="text-[11px] text-slate-400">
              Prices update every 2s from the mock WebSocket stream.
            </p>
          </header>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px]">
          {prices.map((p) => (
            <div
              key={p.instrument}
              className="rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-100">
                  {p.instrument}
                </span>
              </div>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-[11px] text-slate-100">
                  {p.bid.toFixed(4)}
                </span>
                <span className="text-[11px] text-slate-400">
                  {p.ask.toFixed(4)}
                </span>
              </div>
            </div>
          ))}
        </div>

        <header className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-100">
            Open Trades (simulated PnL)
          </h2>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px] text-slate-300">
            <thead className="text-[10px] uppercase tracking-wide text-slate-500 border-b border-slate-800">
              <tr>
                <th className="py-1.5 text-left">ID</th>
                <th className="py-1.5 text-left">Instrument</th>
                <th className="py-1.5 text-left">Dir</th>
                <th className="py-1.5 text-right">Entry</th>
                <th className="py-1.5 text-right">SL</th>
                <th className="py-1.5 text-right">TP</th>
                <th className="py-1.5 text-right">PnL</th>
              </tr>
            </thead>
            <tbody>
              {openTrades.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-4 text-center text-slate-500 text-[11px]"
                  >
                    No open trades. Place a simulated trade to start the stream.
                  </td>
                </tr>
              ) : (
                openTrades.map((t) => (
                  <tr key={t.id} className="border-b border-slate-900/60">
                    <td className="py-1.5 pr-2">{t.id.slice(-6)}</td>
                    <td className="py-1.5 pr-2">{t.instrument}</td>
                    <td className="py-1.5 pr-2">
                      <span className="text-slate-100">
                        {t.direction.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-1.5 pr-2 text-right">
                      {t.entryPrice.toFixed(4)}
                    </td>
                    <td className="py-1.5 pr-2 text-right">
                      {t.stopLoss.toFixed(4)}
                    </td>
                    <td className="py-1.5 pr-2 text-right">
                      {t.takeProfit.toFixed(4)}
                    </td>
                    <td className="py-1.5 pl-2 text-right text-slate-100">
                      {t.pnl.toFixed(0)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {brokers.length > 0 && (
          <p className="mt-3 text-[11px] text-slate-400">
            Connected brokers:{' '}
            {brokers.map((b) => `${b.broker} (${b.apiKeyMasked})`).join(', ')}
          </p>
        )}
      </motion.section>

      {showBrokerModal && (
        <div className="fixed inset-0 z-40 bg-black/60 flex items-center justify-center px-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleConnectBroker(new FormData(e.currentTarget));
            }}
            className="w-full max-w-sm rounded-xl border border-slate-700 bg-slate-950 p-4 space-y-3"
          >
            <h2 className="text-sm font-semibold text-slate-100">
              Connect Mock Broker
            </h2>
            <p className="text-[11px] text-slate-400">
              Simulate connecting to a live broker and importing recent history.
            </p>
            <div className="space-y-2 text-[11px]">
              <div>
                <label className="block mb-1 text-slate-300">Broker</label>
                <select
                  className="w-full rounded bg-slate-900 border border-slate-700 px-2 py-1 text-xs"
                  value={brokerType}
                  onChange={(e) => setBrokerType(e.target.value)}
                >
                  <option>MetaTrader</option>
                  <option>Binance</option>
                  <option>Zerodha</option>
                  <option>Interactive Brokers</option>
                  <option>Coinbase</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 text-slate-300">API Key</label>
                <input
                  name="apiKey"
                  className="w-full rounded bg-slate-900 border border-slate-700 px-2 py-1 text-xs"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-slate-300">API Secret</label>
                <input
                  name="apiSecret"
                  type="password"
                  className="w-full rounded bg-slate-900 border border-slate-700 px-2 py-1 text-xs"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 text-[11px]">
              <button
                type="button"
                onClick={() => setShowBrokerModal(false)}
                className="px-3 py-1 rounded border border-slate-700 text-slate-300 hover:bg-slate-900/70"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 rounded bg-slate-50 text-slate-900 font-semibold hover:bg-white"
              >
                Connect
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

