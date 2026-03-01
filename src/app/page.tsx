"use client";

import Link from "next/link";
import { Nav } from "@/components/Nav";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />

      <main className="flex-1 flex flex-col justify-end w-full px-4 sm:px-6 md:px-8 py-12">
        <div className="flex gap-4 sm:gap-6 w-full">
          <Link
            href="/markets"
            className="flex-1 min-w-0 p-6 sm:p-8 rounded-xl backdrop-blur-xl border transition bg-white/70 border-slate-200 hover:border-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:hover:border-slate-600"
          >
            <h2 className="text-xl sm:text-2xl font-semibold mb-2 text-slate-900 dark:text-slate-200">Markets</h2>
            <p className="text-slate-600 dark:text-slate-400">
              Browse and trade on prediction markets
            </p>
          </Link>
          <Link
            href="/portfolio"
            className="flex-1 min-w-0 p-6 sm:p-8 rounded-xl backdrop-blur-xl border transition bg-white/70 border-slate-200 hover:border-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:hover:border-slate-600"
          >
            <h2 className="text-xl sm:text-2xl font-semibold mb-2 text-slate-900 dark:text-slate-200">Portfolio</h2>
            <p className="text-slate-600 dark:text-slate-400">
              View your positions and trade history
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}
