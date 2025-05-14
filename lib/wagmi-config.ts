"use client"

import { http } from "wagmi"
import { bsc, bscTestnet } from "wagmi/chains"
import { getDefaultConfig } from "@rainbow-me/rainbowkit"

// Update the project ID handling to be more robust
// Get WalletConnect projectId from environment variable
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID

// Ensure we have a valid project ID
if (!projectId) {
  console.warn(
    "WalletConnect Project ID is missing. Please set NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID in your environment variables.",
  )
}

// Configure supported chains
export const chains = [bsc, bscTestnet]

// Create wagmi config with RainbowKit
export const config = getDefaultConfig({
  appName: "5PT Investment Manager",
  projectId: projectId || "", // Provide empty string as fallback to prevent undefined errors
  chains,
  transports: {
    [bsc.id]: http("https://bsc-dataseed1.binance.org/"),
    [bscTestnet.id]: http("https://data-seed-prebsc-1-s1.binance.org:8545/"),
  },
  // Add explicit SSR configuration to prevent localStorage errors
  ssr: true, // Enable SSR mode for wagmi
  // Fix metadata URL to use relative URL instead of hardcoded domain
  // This prevents the URL mismatch warning
  metadata: {
    name: "5PT Investment Manager",
    description: "BSC Investment DApp",
    url: "", // Use empty string to default to current URL
    icons: ["/images/5pt-logo.png"],
  },
})
