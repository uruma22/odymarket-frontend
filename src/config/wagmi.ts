import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {
  baseAccount,
  metaMaskWallet,
  rainbowWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { polygon, arbitrum, polygonMumbai } from "wagmi/chains";

const baseAccountWithIcon = (params: { appName: string; appIcon?: string }) => {
  const wallet = baseAccount(params);
  return {
    ...wallet,
    iconUrl: "/base-logo.svg",
    iconBackground: "#0052FF",
  };
};

export const config = getDefaultConfig({
  appName: "Odymarket",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_ID || "predict-market",
  chains: [polygon, arbitrum, polygonMumbai],
  ssr: true,
  wallets: [
    {
      groupName: "Popular",
      wallets: [
        rainbowWallet,
        baseAccountWithIcon,
        metaMaskWallet,
        walletConnectWallet,
      ],
    },
  ],
});
