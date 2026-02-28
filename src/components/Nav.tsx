"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";

const btnClass =
  "flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-white/90 backdrop-blur-sm border border-white/10 hover:bg-white/20 hover:border-white/20 transition-all duration-200 text-sm font-medium";

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
              <div className="h-10 w-32 bg-white/5 rounded-xl animate-pulse" />
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
              <button onClick={openAccountModal} className={btnClass}>
                {account.displayBalance && (
                  <span className="text-white/90">
                    {account.displayBalance}
                  </span>
                )}
              </button>
              <button onClick={openAccountModal} className={btnClass}>
                <CustomAvatarImg address={account.address} size={24} />
                <span className="max-w-[80px] truncate">
                  {account.displayName}
                </span>
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
            </div>
          );
        }}
      </ConnectButton.Custom>
    </nav>
  );
}

function CustomAvatarImg({
  address,
  size,
}: {
  address: string;
  size: number;
}) {
  const AVATAR_STYLES = ["bottts", "avataaars", "lorelei"];
  const hash = address
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const style = AVATAR_STYLES[hash % AVATAR_STYLES.length];
  const src = `https://api.dicebear.com/7.x/${style}/svg?seed=${address}&backgroundColor=b6e3f4,c0aede,d1d4f9`;

  return (
    <img
      src={src}
      width={size}
      height={size}
      alt=""
      className="rounded-full ring-2 ring-white/20"
    />
  );
}
