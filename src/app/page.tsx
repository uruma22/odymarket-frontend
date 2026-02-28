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
            className="block w-80 p-6 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition"
          >
            <h2 className="text-xl font-semibold mb-2">Markets</h2>
            <p className="text-white">
              Browse and trade on prediction markets
            </p>
          </Link>
          <Link
            href="/portfolio"
            className="block w-80 p-6 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition"
          >
            <h2 className="text-xl font-semibold mb-2">Portfolio</h2>
            <p className="text-white">
              View your positions and trade history
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}
