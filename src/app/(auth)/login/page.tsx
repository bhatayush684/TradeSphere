'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, error, login, hydrate } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (isAuthenticated && user) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, user, router]);

  const onSubmit = async (values: FormValues) => {
    await login(values.email, values.password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.35),_transparent_55%)] pointer-events-none" />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="relative w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-950/90 shadow-[0_24px_80px_rgba(15,23,42,0.9)] p-10 backdrop-blur"
      >
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-50 tracking-tight">
              TradeSphere X
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Institutional trading workspace · simulated but production-ready.
            </p>
          </div>
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-slate-100 via-slate-300 to-slate-500 shadow-[0_0_32px_rgba(148,163,184,0.75)]" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm text-slate-200 mb-1.5">Email</label>
            <input
              type="email"
              className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3.5 py-2.5 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-300/80 focus:border-slate-200 transition-colors"
              placeholder="trader@example.com"
              {...register('email')}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-400">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm text-slate-200 mb-1.5">Password</label>
            <input
              type="password"
              className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3.5 py-2.5 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-300/80 focus:border-slate-200 transition-colors"
              placeholder="At least 8 characters"
              {...register('password')}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-400">
                {errors.password.message}
              </p>
            )}
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-red-400 bg-red-950/40 border border-red-900/60 rounded px-2 py-1"
            >
              {error}
            </motion.p>
          )}

          <motion.button
            type="submit"
            disabled={isLoading}
            whileTap={{ scale: 0.98 }}
            className="w-full rounded-xl bg-slate-50 text-slate-950 text-sm font-semibold py-2.5 tracking-wide shadow-[0_18px_40px_rgba(148,163,184,0.55)] hover:bg-white transition-colors disabled:opacity-60"
          >
            {isLoading ? 'Signing in…' : 'Enter Terminal'}
          </motion.button>
        </form>

        <p className="mt-5 text-xs text-slate-500">
          Use any email ending with <span className="font-mono">@example.com</span> and a
          password of at least 8 characters to sign in (simulated auth).
        </p>
      </motion.div>
    </div>
  );
}

