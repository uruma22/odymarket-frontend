"use client";

import Link from "next/link";
import { Nav } from "@/components/Nav";
import { useAccount } from "wagmi";

export default function PortfolioPage() {
  const { address } = useAccount();

  return (
    <div className="min-h-screen">
      <Nav />

      <main className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-8">Portfolio</h1>

        {!address ? (
          <div className="text-slate-400 p-8 rounded-xl bg-slate-800/30 border border-slate-700">
            Connect your wallet to view positions
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700">
              <p className="text-slate-400 mb-2">Address</p>
              <p className="font-mono break-all">{address}</p>
            </div>
            <div className="text-slate-400 p-8 rounded-xl bg-slate-800/30 border border-slate-700">
              Positions and trade history will appear here. Use the API: GET /positions/{address}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
