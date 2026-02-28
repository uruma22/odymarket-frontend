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
  const [outcome, setOutcome] = useState<0 | 1>(0); // 0=YES, 1=NO
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

  const { writeContractAsync: buyShares } = useWriteContract();
  const { writeContractAsync: sellShares } = useWriteContract();
  const { writeContractAsync: approve } = useWriteContract();
  const { writeContractAsync: claimWinnings } = useWriteContract();

  const formatPrice = (val: bigint | undefined) =>
    val ? (Number(val) / 1e6).toFixed(2) : "0.00";

  const handleBuy = async () => {
    if (!address || !amount) return;
    const amt = BigInt(Math.floor(parseFloat(amount) * 1e6));
    const maxCost = (amt * BigInt(105)) / BigInt(100); // 5% slippage (max 1.05 per share)
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
    const amt = BigInt(parseFloat(amount) * 1e6);
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
      <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700">
        <p className="text-slate-400">Connect wallet to trade</p>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700 space-y-6">
      <h3 className="font-semibold text-lg">Trade</h3>

      <div className="flex gap-2 text-sm">
        <button
          onClick={() => setMode("buy")}
          className={`px-4 py-2 rounded-lg ${mode === "buy" ? "bg-primary text-white" : "bg-slate-700"}`}
        >
          Buy
        </button>
        <button
          onClick={() => setMode("sell")}
          className={`px-4 py-2 rounded-lg ${mode === "sell" ? "bg-primary text-white" : "bg-slate-700"}`}
        >
          Sell
        </button>
      </div>

      <div>
        <p className="text-slate-400 text-sm mb-2">Outcome</p>
        <div className="flex gap-2">
          <button
            onClick={() => setOutcome(0)}
            className={`flex-1 py-2 rounded-lg ${outcome === 0 ? "bg-emerald-600" : "bg-slate-700"}`}
          >
            YES {formatPrice(yesPrice)}¢
          </button>
          <button
            onClick={() => setOutcome(1)}
            className={`flex-1 py-2 rounded-lg ${outcome === 1 ? "bg-rose-600" : "bg-slate-700"}`}
          >
            NO {formatPrice(noPrice)}¢
          </button>
        </div>
      </div>

      <div>
        <p className="text-slate-400 text-sm mb-2">Your shares</p>
        <p>YES: {formatPrice(userYesShares)} | NO: {formatPrice(userNoShares)}</p>
      </div>

      {!isResolved && (
        <>
          <div>
            <p className="text-slate-400 text-sm mb-2">Amount (USDC)</p>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-600"
              placeholder="0"
            />
          </div>

          <button
            onClick={mode === "buy" ? handleBuy : handleSell}
            disabled={!amount}
            className="w-full py-3 rounded-lg bg-primary font-semibold hover:opacity-90 disabled:opacity-50"
          >
            {mode === "buy" ? "Buy" : "Sell"} {outcome === 0 ? "YES" : "NO"}
          </button>
        </>
      )}

      {isResolved && (
        <button
          onClick={handleClaim}
          className="w-full py-3 rounded-lg bg-primary font-semibold hover:opacity-90"
        >
          Claim winnings
        </button>
      )}
    </div>
  );
}
