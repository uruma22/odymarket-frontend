"use client";

import Link from "next/link";
import { Nav } from "@/components/Nav";
import { useParams } from "next/navigation";
import { useMarket } from "@/hooks/useMarket";
import { TradePanel } from "@/components/TradePanel";

export default function MarketPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: market, isLoading } = useMarket(id);

  if (isLoading) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <div className="fixed inset-0 bg-white/40 dark:bg-slate-900/80 backdrop-blur-xl -z-10" aria-hidden />
        <div className="text-slate-600 dark:text-slate-400">Loading...</div>
      </div>
    );
  }

  if (!market) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <div className="fixed inset-0 bg-white/40 dark:bg-slate-900/80 backdrop-blur-xl -z-10" aria-hidden />
        <div className="text-slate-600 dark:text-slate-400">Market not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 bg-white/40 dark:bg-slate-900/80 backdrop-blur-xl -z-10" aria-hidden />
      <Nav />

      <main className="max-w-6xl mx-auto px-6 py-12">
        <Link href="/markets" className="text-primary hover:underline mb-6 inline-block">
          ← Back to markets
        </Link>

        <h1 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-200">{market.question}</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="p-6 rounded-xl bg-white/70 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold mb-4 text-slate-900 dark:text-slate-200">Market info</h3>
              <div className="space-y-2 text-slate-600 dark:text-slate-400">
                <p>Status: {market.status}</p>
                <p>Expiration: {new Date(market.expiration).toLocaleString()}</p>
                <p>Contract: {market.contractAddr}</p>
              </div>
            </div>
          </div>

          <div>
            <TradePanel
              marketAddress={market.contractAddr}
              marketId={market.id}
              isResolved={market.status === "resolved"}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
