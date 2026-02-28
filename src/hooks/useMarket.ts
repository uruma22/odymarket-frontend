"use client";

import { useQuery } from "@tanstack/react-query";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

export function useMarket(id: string) {
  return useQuery({
    queryKey: ["market", id],
    queryFn: async () => {
      const res = await fetch(`${BACKEND}/markets/${id}`);
      if (!res.ok) throw new Error("Market not found");
      return res.json();
    },
    enabled: !!id,
  });
}

export async function fetchMarket(id: string) {
  const res = await fetch(`${BACKEND}/markets/${id}`);
  return res.json();
}
