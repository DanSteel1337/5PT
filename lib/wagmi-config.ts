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
    [bsc.id]: http(),
    [bscTestnet.id]: http(),
  },
  // Remove ssr: false from here as it's not needed in the config
  // The WagmiProvider component will handle client-side rendering
})
