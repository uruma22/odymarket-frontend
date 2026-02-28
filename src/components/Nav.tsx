"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useAccount, useBalance, useDisconnect } from "wagmi";
import { AddressAvatar } from "./AddressAvatar";

const BTN_CLASS =
  "flex items-center gap-2 px-4 py-2 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 text-white/90 hover:bg-black/50 hover:border-white/20 transition-all";

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function DisconnectIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

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
          openChainModal,
          openConnectModal,
          mounted,
        }) => {
          const ready = mounted;
          const connected = ready && account && chain;

          return (
            <div className="flex items-center gap-2">
              {!connected ? (
                <button onClick={openConnectModal} className={BTN_CLASS}>
                  Connect Wallet
                </button>
              ) : (
                <>
                  <button onClick={openChainModal} className={BTN_CLASS}>
                    {chain?.name ?? "Wrong network"}
                  </button>
                  <AccountButton account={account} chainId={chain?.id} />
                </>
              )}
            </div>
          );
        }}
      </ConnectButton.Custom>
    </nav>
  );
}

function AccountButton({
  account,
  chainId,
}: {
  account: { address: string; displayName: string };
  chainId?: number;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { data: balance } = useBalance({
    address: account.address as `0x${string}`,
  });
  const { disconnect } = useDisconnect();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const shortAddr = `${account.address.slice(0, 6)}...${account.address.slice(-4)}`;
  const balanceStr = balance?.formatted
    ? `${parseFloat(balance.formatted).toFixed(1)} ${balance.symbol}`
    : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(account.address);
    setOpen(false);
  };

  const handleDisconnect = () => {
    disconnect();
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={BTN_CLASS}
      >
        <span className="hidden sm:inline">{balanceStr}</span>
        <AddressAvatar address={account.address} size="sm" />
        <span>{shortAddr}</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 min-w-[260px] rounded-2xl bg-[rgb(15,23,42)] border border-white/10 shadow-2xl overflow-hidden">
          <div className="p-5 text-center">
            <p className="text-xs font-medium text-white/60 uppercase tracking-wider mb-3">
              Account
            </p>
            <div className="flex justify-center mb-3">
              <AddressAvatar address={account.address} size="lg" />
            </div>
            <p className="font-mono font-semibold text-white text-sm">
              {shortAddr}
            </p>
            <p className="text-white/60 text-sm mt-1">{balanceStr}</p>
          </div>
          <div className="flex border-t border-white/10">
            <button
              onClick={handleCopy}
              className="flex-1 py-3 px-4 text-sm text-white/80 hover:bg-white/5 transition flex items-center justify-center gap-2"
            >
              <CopyIcon />
              Copy address
            </button>
            <button
              onClick={handleDisconnect}
              className="flex-1 py-3 px-4 text-sm text-white/80 hover:bg-white/5 transition flex items-center justify-center gap-2 border-l border-white/10"
            >
              <DisconnectIcon />
              Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
