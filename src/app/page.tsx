"use client";

import Link from "next/link";
import { Nav } from "@/components/Nav";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />

      <main className="flex-1 flex flex-col justify-end max-w-6xl mx-auto px-6 py-12 w-full">
        <div className="flex flex-wrap gap-6 justify-between">
          <Link
            href="/markets"
            className="block w-80 p-6 rounded-xl backdrop-blur-xl border transition bg-white/70 border-slate-200 hover:border-slate-300 dark:bg-white/5 dark:border-white/10 dark:hover:border-white/20"
          >
            <h2 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">Markets</h2>
            <p className="text-slate-600 dark:text-white">
              Browse and trade on prediction markets
            </p>
          </Link>
          <Link
            href="/portfolio"
            className="block w-80 p-6 rounded-xl backdrop-blur-xl border transition bg-white/70 border-slate-200 hover:border-slate-300 dark:bg-white/5 dark:border-white/10 dark:hover:border-white/20"
          >
            <h2 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">Portfolio</h2>
            <p className="text-slate-600 dark:text-white">
              View your positions and trade history
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}
