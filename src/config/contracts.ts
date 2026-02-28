export const CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID || 137);
export const USDC_ADDRESS =
  (CHAIN_ID === 137
    ? "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
    : "0xaf88d065e77c8cC2239327C5EDb3A432268e5831") as `0x${string}`;
export const MARKET_FACTORY_ADDRESS = (process.env.NEXT_PUBLIC_MARKET_FACTORY_ADDRESS ||
  "0x0000000000000000000000000000000000000000") as `0x${string}`;

export const MARKET_ABI = [
  {
    inputs: [
      { name: "outcome", type: "uint8" },
      { name: "amount", type: "uint256" },
      { name: "maxCost", type: "uint256" },
    ],
    name: "buyShares",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "outcome", type: "uint8" },
      { name: "amount", type: "uint256" },
      { name: "minReturn", type: "uint256" },
    ],
    name: "sellShares",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "outcome", type: "uint8" },
      { name: "amount", type: "uint256" },
    ],
    name: "getBuyPrice",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "outcome", type: "uint8" },
      { name: "amount", type: "uint256" },
    ],
    name: "getSellPrice",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "outcome", type: "uint8" }],
    name: "getCurrentPrice",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "claimWinnings",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "user", type: "address" }, { name: "outcome", type: "uint8" }],
    name: "getShares",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "isResolved",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "winningOutcome",
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export const ERC20_ABI = [
  {
    inputs: [{ name: "spender", type: "address" }, { name: "amount", type: "uint256" }],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "owner", type: "address" }, { name: "spender", type: "address" }],
    name: "allowance",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;
