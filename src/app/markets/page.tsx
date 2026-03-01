"use client";

import Link from "next/link";
import { Nav } from "@/components/Nav";
import { useMarkets } from "@/hooks/useMarkets";

export default function MarketsPage() {
  const { data: markets = [], isLoading, isError, error } = useMarkets();

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 bg-white/40 dark:bg-slate-900/80 backdrop-blur-xl -z-10" aria-hidden />
      <Nav />

      <main className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-8 text-slate-900 dark:text-slate-200">Markets</h1>

        {isLoading ? (
          <div className="text-slate-600 dark:text-slate-400">Loading markets...</div>
        ) : isError ? (
          <div className="text-amber-600 dark:text-amber-400 p-8 rounded-xl bg-slate-100 dark:bg-slate-800 border border-amber-400 dark:border-amber-500/50">
            Failed to load markets. Check NEXT_PUBLIC_BACKEND_URL in Vercel env.
            <pre className="mt-2 text-sm text-slate-600 dark:text-slate-400 overflow-auto">{String(error?.message)}</pre>
          </div>
        ) : markets.length === 0 ? (
          <div className="text-slate-600 dark:text-slate-400 p-8 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700">
            No markets yet. Deploy the contracts and create a market via MarketFactory.
          </div>
        ) : (
          <div className="space-y-4">
            {markets.map((m: { id: string; question: string; status: string; expiration: string }) => (
              <Link
                key={m.id}
                href={`/markets/${m.id}`}
                className="block p-6 rounded-xl bg-white/70 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-primary/50 dark:hover:border-slate-600 transition"
              >
                <h2 className="text-lg font-semibold mb-2 text-slate-900 dark:text-slate-200">{m.question}</h2>
                <div className="flex gap-4 text-sm text-slate-600 dark:text-slate-400">
                  <span>Status: {m.status}</span>
                  <span>Expires: {new Date(m.expiration).toLocaleDateString()}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
