"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";

export function Nav() {
  return (
    <nav className="sticky top-0 z-50 px-6 py-2 flex justify-between items-center bg-white/5 backdrop-blur-xl border-b border-white/10">
      <Link
        href="/"
        className="text-2xl font-bold tracking-tight text-white/70 hover:text-white/90 transition"
      >
        Prediction markets on Web 3
      </Link>
      <ConnectButton />
    </nav>
  );
}
