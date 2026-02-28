"use client";

import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { config } from "@/config/wagmi";
import { CustomAvatar } from "@/components/CustomAvatar";
import "@rainbow-me/rainbowkit/styles.css";
import "./globals.css";

const queryClient = new QueryClient();

const rainbowTheme = darkTheme({
  accentColor: "#0ea5e9",
  accentColorForeground: "white",
  borderRadius: "medium",
});

const customTheme = {
  ...rainbowTheme,
  colors: {
    ...rainbowTheme.colors,
    modalBackdrop: "rgba(0, 0, 0, 0.7)",
    modalBackground: "rgba(30, 41, 59, 0.95)",
    profileAction: "rgba(71, 85, 105, 0.5)",
    profileActionHover: "rgba(51, 65, 85, 0.9)",
  },
  blurs: {
    ...rainbowTheme.blurs,
    modalOverlay: "20px",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider theme={customTheme} avatar={CustomAvatar}>
              {children}
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}
