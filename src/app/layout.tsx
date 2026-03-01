"use client";

import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import { config } from "@/config/wagmi";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import "@rainbow-me/rainbowkit/styles.css";
import "./globals.css";

const queryClient = new QueryClient();

const darkOpts = {
  accentColor: "#0ea5e9",
  accentColorForeground: "white",
  borderRadius: "medium" as const,
  overlayBlur: "large" as const,
};

const darkCustom = {
  ...darkTheme(darkOpts),
  colors: {
    ...darkTheme(darkOpts).colors,
    modalBackdrop: "transparent",
    modalBackground: "rgb(30, 41, 59)",
  },
  blurs: { ...darkTheme(darkOpts).blurs, modalOverlay: "24px" },
};

const lightCustom = {
  ...lightTheme({ ...darkOpts, accentColorForeground: "white" }),
  colors: {
    ...lightTheme(darkOpts).colors,
    modalBackdrop: "transparent",
    modalBackground: "rgb(248, 250, 252)",
  },
  blurs: { ...lightTheme(darkOpts).blurs, modalOverlay: "24px" },
};

function RainbowKitThemed({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  return (
    <RainbowKitProvider theme={theme === "dark" ? darkCustom : lightCustom}>
      {children}
    </RainbowKitProvider>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme');document.documentElement.classList.toggle('dark',t!=='light');})();`,
          }}
        />
      </head>
      <body>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider>
              <RainbowKitThemed>{children}</RainbowKitThemed>
            </ThemeProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}
