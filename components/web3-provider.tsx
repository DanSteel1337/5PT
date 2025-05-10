"use client"

import { WagmiProvider, createConfig, http } from "wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ConnectKitProvider, getDefaultConfig } from "connectkit"
import { mainnet, bsc, bscTestnet } from "wagmi/chains"
import type { ReactNode } from "react"

// Create a client
const queryClient = new QueryClient()

// Project ID from WalletConnect Cloud
const projectId = "61fededa0f2f506206922fa41e9cea43"

const chains = [mainnet, bsc, bscTestnet]

const config = createConfig(
  getDefaultConfig({
    appName: "Five Pillars Token DeFi Platform",
    projectId,
    chains,
    transports: {
      [mainnet.id]: http(),
      [bsc.id]: http(),
      [bscTestnet.id]: http(),
    },
  }),
)

export function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider
          customTheme={{
            "--ck-accent-color": "#7c3aed",
            "--ck-accent-text-color": "#ffffff",
            "--ck-border-radius": "12px",
          }}
          mode="dark"
        >
          {children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
