import { getDefaultConfig } from "@rainbow-me/rainbowkit"
import { http } from "viem"
import { bsc, bscTestnet } from "viem/chains"
import { injected } from "wagmi/connectors"

// Contract addresses - Updated with deployed contracts
export const CONTRACT_ADDRESSES = {
  token: "0x8FafdFB035C9426a50D842873D5d401C933bE09F" as `0x${string}`, // 5PT Token
  investmentManager: "0x7CcFFB3Dc39b50f4EEB8aA2D9aCF667d6ef8D0bc" as `0x${string}`, // Investment Manager
  treasury: "0x17D3846cC570ced5882E41a6a99CB87a8647C0Bb" as `0x${string}`,
  dexRouter: "0xD99D1c33F9fC3444f8101754aBC46c52416550D1" as `0x${string}`,
  // For price data
  priceToken: "0xfb5b838b6cfeedc2873ab27866079ac55363d37e" as `0x${string}`,
  pricePool: "0x231d9e7181e8479a8b40930961e93e7ed798542c" as `0x${string}`,
  wbnb: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c" as `0x${string}`,
}

// Create a single configuration with polyfills and injected connector as fallback
export const wagmiConfig = getDefaultConfig({
  appName: "5PT Investment Platform",
  projectId: "61fededa0f2f506206922fa41e9cea43", // WalletConnect Project ID
  chains: [bsc, bscTestnet],
  transports: {
    [bsc.id]: http("https://bsc-dataseed.binance.org"),
    [bscTestnet.id]: http("https://data-seed-prebsc-1-s1.binance.org:8545"),
  },
  connectors: [
    injected(), // Add injected connector explicitly as a fallback
    // WalletConnect connectors are added automatically by getDefaultConfig
  ],
  walletConnectOptions: {
    projectId: "61fededa0f2f506206922fa41e9cea43",
    metadata: {
      name: "5PT Investment Platform",
      description: "Investment platform for the Five Pillars Token (5PT)",
      url: "https://5pt.finance",
      icons: ["https://5pt.finance/images/5pt-logo.png"],
    },
  },
})

// Remove the previewWagmiConfig as we're now using a single configuration approach
