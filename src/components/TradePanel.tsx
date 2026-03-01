"use client";

import { useState } from "react";
import { useAccount, useWriteContract, useReadContract } from "wagmi";
import {
  MARKET_ABI,
  ERC20_ABI,
  USDC_ADDRESS,
} from "@/config/contracts";

type Props = {
  marketAddress: string;
  marketId: string;
  isResolved: boolean;
};

export function TradePanel({ marketAddress, marketId, isResolved }: Props) {
  const { address } = useAccount();
  const [outcome, setOutcome] = useState<0 | 1>(0);
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState<"buy" | "sell">("buy");

  const { data: yesPrice } = useReadContract({
    address: marketAddress as `0x${string}`,
    abi: MARKET_ABI,
    functionName: "getCurrentPrice",
    args: [0],
  });

  const { data: noPrice } = useReadContract({
    address: marketAddress as `0x${string}`,
    abi: MARKET_ABI,
    functionName: "getCurrentPrice",
    args: [1],
  });

  const { data: userYesShares } = useReadContract({
    address: marketAddress as `0x${string}`,
    abi: MARKET_ABI,
    functionName: "getShares",
    args: address ? [address, 0] : undefined,
  });

  const { data: userNoShares } = useReadContract({
    address: marketAddress as `0x${string}`,
    abi: MARKET_ABI,
    functionName: "getShares",
    args: address ? [address, 1] : undefined,
  });

  const price = outcome === 0 ? yesPrice : noPrice;
  const priceNum = price ? Number(price) / 1e6 : 0;
  const amountNum = parseFloat(amount) || 0;
  const shares = mode === "buy" && priceNum > 0 ? amountNum / priceNum : amountNum;
  const winnings = mode === "buy" ? shares : amountNum * priceNum * 0.985;

  const { writeContractAsync: buyShares } = useWriteContract();
  const { writeContractAsync: sellShares } = useWriteContract();
  const { writeContractAsync: approve } = useWriteContract();
  const { writeContractAsync: claimWinnings } = useWriteContract();

  const formatPrice = (val: bigint | undefined) =>
    val ? (Number(val) / 1e6).toFixed(2) : "0.00";

  const addAmount = (n: number) => setAmount((p) => String((parseFloat(p) || 0) + n));
  const setMax = () => {
    if (mode === "sell" && outcome === 0 && userYesShares) setAmount((Number(userYesShares) / 1e6).toFixed(2));
    else if (mode === "sell" && outcome === 1 && userNoShares) setAmount((Number(userNoShares) / 1e6).toFixed(2));
    else setAmount("");
  };

  const handleBuy = async () => {
    if (!address || !amount || priceNum <= 0) return;
    const amt = BigInt(Math.floor(shares * 1e6));
    if (amt <= 0n) return;
    const maxCost = BigInt(Math.ceil(amountNum * 1.05 * 1e6));
    await approve({
      address: USDC_ADDRESS,
      abi: ERC20_ABI,
      functionName: "approve",
      args: [marketAddress as `0x${string}`, maxCost],
    });
    await buyShares({
      address: marketAddress as `0x${string}`,
      abi: MARKET_ABI,
      functionName: "buyShares",
      args: [outcome, amt, maxCost],
    });
  };

  const handleSell = async () => {
    if (!address || !amount) return;
    const amt = BigInt(Math.floor(amountNum * 1e6));
    const minReturn = BigInt(0);
    await sellShares({
      address: marketAddress as `0x${string}`,
      abi: MARKET_ABI,
      functionName: "sellShares",
      args: [outcome, amt, minReturn],
    });
  };

  const handleClaim = async () => {
    await claimWinnings({
      address: marketAddress as `0x${string}`,
      abi: MARKET_ABI,
      functionName: "claimWinnings",
    });
  };

  if (!address) {
    return (
      <div className="p-6 rounded-xl bg-white/70 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        <p className="text-slate-600 dark:text-slate-400">Connect wallet to trade</p>
      </div>
    );
  }

  const btnBase = "px-3 py-2 rounded-lg text-sm bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 transition";

  return (
    <div className="p-6 rounded-xl bg-white/70 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-5">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
        <div className="flex gap-4">
          <button
            onClick={() => setMode("buy")}
            className={`font-medium ${mode === "buy" ? "text-primary border-b-2 border-primary" : "text-slate-500 dark:text-slate-400"}`}
          >
            Buy
          </button>
          <button
            onClick={() => setMode("sell")}
            className={`font-medium ${mode === "sell" ? "text-primary border-b-2 border-primary" : "text-slate-500 dark:text-slate-400"}`}
          >
            Sell
          </button>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setOutcome(0)}
          className={`flex-1 py-3 rounded-lg font-medium ${outcome === 0 ? "bg-emerald-600 text-white" : btnBase}`}
        >
          Yes {formatPrice(yesPrice)}¢
        </button>
        <button
          onClick={() => setOutcome(1)}
          className={`flex-1 py-3 rounded-lg font-medium ${outcome === 1 ? "bg-rose-600 text-white" : btnBase}`}
        >
          No {formatPrice(noPrice)}¢
        </button>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-slate-600 dark:text-slate-400">Amount</span>
          <span className="text-xl font-bold text-slate-900 dark:text-slate-100">${amount || "0"}</span>
        </div>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0"
          className="w-full px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white mb-2"
        />
        <div className="flex gap-2 flex-wrap">
          {[1, 5, 10, 100].map((n) => (
            <button key={n} onClick={() => addAmount(n)} className={btnBase}>
              +${n}
            </button>
          ))}
          <button onClick={setMax} className={btnBase}>
            Max
          </button>
        </div>
      </div>

      {!isResolved && (
        <>
          <div>
            <div className="flex justify-between items-start mb-1">
              <div className="flex items-center gap-1">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {mode === "buy" ? "Winnings" : "You receive"}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-500">
                  Avg. Price {formatPrice(price)}¢
                </span>
              </div>
              <span className="text-lg font-bold text-emerald-500">
                ${winnings > 0 ? winnings.toFixed(2) : "0.00"}
              </span>
            </div>
          </div>

          <button
            onClick={mode === "buy" ? handleBuy : handleSell}
            disabled={!amount || amountNum <= 0}
            className="w-full py-3 rounded-lg bg-primary font-semibold text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Trade
          </button>
        </>
      )}

      {isResolved && (
        <button
          onClick={handleClaim}
          className="w-full py-3 rounded-lg bg-primary font-semibold text-white hover:opacity-90"
        >
          Claim winnings
        </button>
      )}

      <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
        <p className="text-xs text-slate-500 dark:text-slate-500">
          YES: {formatPrice(userYesShares)} | NO: {formatPrice(userNoShares)}
        </p>
      </div>
    </div>
  );
}
