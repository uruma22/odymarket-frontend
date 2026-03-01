"use client";

import Link from "next/link";
import { Nav } from "@/components/Nav";
import { useAccount } from "wagmi";
import { useMarkets } from "@/hooks/useMarkets";
import { usePositions } from "@/hooks/usePositions";

function formatShares(val: bigint) {
  return (Number(val) / 1e6).toFixed(2);
}

export default function PortfolioPage() {
  const { address } = useAccount();
  const { data: markets = [] } = useMarkets();
  const { positions, isLoading } = usePositions(markets, address);

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 bg-white/40 dark:bg-background/30 backdrop-blur-xl -z-10" aria-hidden />
      <Nav />

      <main className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-8 text-slate-900 dark:text-white">Portfolio</h1>

        {!address ? (
          <div className="text-slate-600 dark:text-slate-400 p-8 rounded-xl bg-slate-100 dark:bg-slate-800/30 border border-slate-300 dark:border-slate-700">
            Connect your wallet to view positions
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-6 rounded-xl bg-white/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <p className="text-slate-600 dark:text-slate-400 mb-2">Address</p>
              <p className="font-mono break-all text-slate-900 dark:text-white">{address}</p>
            </div>

            <h2 className="text-xl font-semibold mt-8 mb-4 text-slate-900 dark:text-white">Positions</h2>
            {isLoading ? (
              <div className="text-slate-600 dark:text-slate-400 p-8 rounded-xl bg-slate-100 dark:bg-slate-800/30 border border-slate-300 dark:border-slate-700">
                Loading positions...
              </div>
            ) : positions.length === 0 ? (
              <div className="text-slate-600 dark:text-slate-400 p-8 rounded-xl bg-slate-100 dark:bg-slate-800/30 border border-slate-300 dark:border-slate-700">
                No positions yet. Buy shares on a market to see them here.
              </div>
            ) : (
              <div className="space-y-4">
                {positions.map(({ market, yesShares, noShares }) => (
                  <Link
                    key={market.id}
                    href={`/markets/${market.id}`}
                    className="block p-6 rounded-xl bg-white/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-primary/50 transition"
                  >
                    <h3 className="font-semibold mb-3 text-slate-900 dark:text-white">{market.question}</h3>
                    <div className="flex gap-6 text-sm">
                      <span className="text-emerald-600 dark:text-emerald-400">YES: {formatShares(yesShares)} USDC</span>
                      <span className="text-rose-600 dark:text-rose-400">NO: {formatShares(noShares)} USDC</span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-500 text-xs mt-2">Status: {market.status}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
