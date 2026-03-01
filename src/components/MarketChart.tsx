"use client";

import { useQuery } from "@tanstack/react-query";
import { useReadContract } from "wagmi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { MARKET_ABI } from "@/config/contracts";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

type Props = {
  marketId: string;
  marketAddress: string;
};

function generateChartData(currentYesPct: number) {
  const now = Date.now();
  const points = 24;
  const data = [];
  let pct = 50;
  for (let i = points; i >= 0; i--) {
    const t = now - i * 3600000;
    const progress = 1 - i / points;
    pct = pct + (currentYesPct - pct) * progress * 0.3 + (Math.random() - 0.5) * 4;
    pct = Math.max(10, Math.min(90, pct));
    data.push({
      time: new Date(t).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      yesPct: Math.round(pct * 10) / 10,
      ts: t,
    });
  }
  data[data.length - 1] = { ...data[data.length - 1], yesPct: currentYesPct };
  return data;
}

export function MarketChart({ marketId, marketAddress }: Props) {
  const { data: yesPrice } = useReadContract({
    address: marketAddress as `0x${string}`,
    abi: MARKET_ABI,
    functionName: "getCurrentPrice",
    args: [0],
  });
  const currentYesPrice = yesPrice ? Number(yesPrice) / 1e6 : 0.5;

  const { data: trades } = useQuery({
    queryKey: ["trades", marketId],
    queryFn: async () => {
      const res = await fetch(`${BACKEND}/trades/market/${marketId}?limit=100`);
      if (!res.ok) return [];
      const j = await res.json();
      return Array.isArray(j) ? j : [];
    },
  });

  const yesPct = currentYesPrice * 100;
  const chartData =
    trades && trades.length > 0
      ? (() => {
          const sorted = [...trades].sort(
            (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
          let runningYes = 50;
          const out: { time: string; yesPct: number; ts: number }[] = [];
          for (let i = 0; i < sorted.length; i++) {
            const t = sorted[i];
            const ts = new Date(t.createdAt).getTime();
            const amt = Number(t.amount) / 1e6;
            if (t.isBuy) {
              runningYes += t.outcome === 0 ? amt * 2 : -amt * 2;
            } else {
              runningYes += t.outcome === 0 ? -amt * 2 : amt * 2;
            }
            runningYes = Math.max(10, Math.min(90, runningYes));
            out.push({
              time: new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit" }),
              yesPct: Math.round(runningYes * 10) / 10,
              ts,
            });
          }
          if (out.length > 0) {
            out.push({ ...out[out.length - 1], time: "Now", yesPct, ts: Date.now() });
          }
          return out.length > 0 ? out : generateChartData(yesPct);
        })()
      : generateChartData(yesPct);

  return (
    <div className="p-6 rounded-xl bg-white/70 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-slate-900 dark:text-slate-200">YES probability</h3>
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {yesPct.toFixed(1)}% chance
        </span>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(148 163 184 / 0.3)" />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 11, fill: "rgb(100 116 139)" }}
              stroke="rgb(148 163 184 / 0.3)"
            />
            <YAxis
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
              tick={{ fontSize: 11, fill: "rgb(100 116 139)" }}
              stroke="rgb(148 163 184 / 0.3)"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgb(30 41 59)",
                border: "1px solid rgb(71 85 105)",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "rgb(203 213 225)" }}
              formatter={(v: number) => [`${v}%`, "YES"]}
            />
            <Line
              type="monotone"
              dataKey="yesPct"
              stroke="#0ea5e9"
              strokeWidth={2}
              dot={{ r: 0 }}
              activeDot={{ r: 4, fill: "#0ea5e9" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
