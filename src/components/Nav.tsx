"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";

const btnClass =
  "flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/80 text-white/90 backdrop-blur-sm border border-white/10 hover:bg-slate-700/90 hover:border-white/15 transition-all duration-200 text-sm font-medium";

export function Nav() {
  return (
    <nav className="sticky top-0 z-50 px-6 py-2 flex justify-between items-center bg-white/5 backdrop-blur-xl border-b border-white/10">
      <Link
        href="/"
        className="text-2xl font-bold tracking-tight text-white/70 hover:text-white/90 transition"
      >
        Prediction markets on Web 3
      </Link>
      <ConnectButton.Custom>
        {({
          account,
          chain,
          openAccountModal,
          openChainModal,
          openConnectModal,
          mounted,
        }) => {
          const ready = mounted;
          const connected = ready && account && chain;

          if (!ready) {
            return (
              <div className="h-10 w-32 bg-slate-800/50 rounded-xl animate-pulse" />
            );
          }

          if (!connected) {
            return (
              <button onClick={openConnectModal} className={btnClass}>
                Connect Wallet
              </button>
            );
          }

          if (chain?.unsupported) {
            return (
              <button onClick={openChainModal} className={btnClass}>
                Wrong network
              </button>
            );
          }

          return (
            <div className="flex items-center gap-2">
              <button onClick={openChainModal} className={btnClass}>
                {chain?.hasIcon && chain.iconUrl && (
                  <img
                    alt={chain.name ?? "Chain"}
                    src={chain.iconUrl}
                    className="w-5 h-5 rounded-full"
                  />
                )}
                <span>{chain?.name ?? "Unknown"}</span>
                <svg
                  className="w-4 h-4 opacity-70"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {/* Кнопка баланса + акаунта объединены */}
              <button onClick={openAccountModal} className={btnClass}>
                <PastelAvatar address={account.address} size={24} />
                <span className="flex flex-col items-start">
                  {account.displayBalance && (
                    <span className="text-white/90 text-xs leading-tight">
                      {account.displayBalance}
                    </span>
                  )}
                  <span className="text-white/80 text-xs leading-tight max-w-[90px] truncate">
                    {account.displayName}
                  </span>
                </span>
                <svg
                  className="w-4 h-4 opacity-70 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>
          );
        }}
      </ConnectButton.Custom>
    </nav>
  );
}

const PASTEL_COLORS = [
  "#b8d4e8",
  "#e8d4b8",
  "#d4e8d4",
  "#e8d4e8",
  "#d4d4e8",
  "#e8e8d4",
  "#d8e8f0",
  "#f0e8d8",
];

function PastelAvatar({ address, size }: { address: string; size: number }) {
  const hash = address
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const color = PASTEL_COLORS[hash % PASTEL_COLORS.length];

  return (
    <div
      className="rounded-full ring-2 ring-white/20 shrink-0 flex items-center justify-center text-slate-600 text-[10px] font-medium"
      style={{ width: size, height: size, backgroundColor: color }}
    >
      {address.slice(2, 4).toUpperCase()}
    </div>
  );
}
