"use client";

import { useQuery } from "@tanstack/react-query";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

export function useMarkets() {
  return useQuery({
    queryKey: ["markets"],
    queryFn: async () => {
      const res = await fetch(`${BACKEND}/markets`);
      if (!res.ok) throw new Error("Failed to fetch markets");
      return res.json();
    },
  });
}

export async function fetchMarkets() {
  const res = await fetch(`${BACKEND}/markets`);
  return res.json();
}
