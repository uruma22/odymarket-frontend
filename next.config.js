/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@walletconnect/logger', '@walletconnect/universal-provider', '@walletconnect/ethereum-provider', '@rainbow-me/rainbowkit'],
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
};

module.exports = nextConfig;
