"use client";

import { useReadContracts } from "wagmi";
import { MARKET_ABI } from "@/config/contracts";

type Market = { id: string; question: string; contractAddr: string; status: string };

export function usePositions(markets: Market[] | undefined, address: string | undefined) {
  const contracts = markets && address
    ? markets.flatMap((m) => [
        {
          address: m.contractAddr as `0x${string}`,
          abi: MARKET_ABI,
          functionName: "getShares" as const,
          args: [address as `0x${string}`, 0],
        },
        {
          address: m.contractAddr as `0x${string}`,
          abi: MARKET_ABI,
          functionName: "getShares" as const,
          args: [address as `0x${string}`, 1],
        },
      ])
    : [];

  const { data, isLoading } = useReadContracts({
    contracts,
  });

  if (!markets || !address || contracts.length === 0) {
    return { positions: [], isLoading: markets ? isLoading : false };
  }
  if (!data) {
    return { positions: [], isLoading };
  }

  const positions: { market: Market; yesShares: bigint; noShares: bigint }[] = [];
  for (let i = 0; i < markets.length; i++) {
    const yesResult = data[i * 2];
    const noResult = data[i * 2 + 1];
    const yesShares = (yesResult?.result as bigint | undefined) ?? BigInt(0);
    const noShares = (noResult?.result as bigint | undefined) ?? BigInt(0);
    if (yesShares > 0n || noShares > 0n) {
      positions.push({ market: markets[i], yesShares, noShares });
    }
  }
  return { positions, isLoading };
}
