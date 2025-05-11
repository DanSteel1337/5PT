"use client"

import { WagmiProvider, createConfig, http } from "wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ConnectKitProvider, getDefaultConfig } from "connectkit"
import { mainnet, bsc, bscTestnet } from "wagmi/chains"
import type { ReactNode } from "react"
import { toast } from "@/components/ui/use-toast"

// Create a client
const queryClient = new QueryClient()

// Project ID from WalletConnect Cloud
const projectId = "61fededa0f2f506206922fa41e9cea43"

// Define which chains we want to support
const chains = [bscTestnet, bsc, mainnet]

// Create wagmi config with ConnectKit
const config = createConfig(
  getDefaultConfig({
    appName: "Five Pillars Token DeFi Platform",
    projectId,
    chains,
    transports: {
      [bscTestnet.id]: http("https://data-seed-prebsc-1-s1.binance.org:8545"),
      [bsc.id]: http("https://bsc-dataseed.binance.org"),
      [mainnet.id]: http(),
    },
    walletConnectOptions: {
      projectId,
    },
  }),
)

export function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider
          customTheme={{
            "--ck-accent-color": "#d4af37",
            "--ck-accent-text-color": "#ffffff",
            "--ck-border-radius": "12px",
          }}
          mode="dark"
          options={{
            hideNoWalletCTA: false,
            hideBalance: false,
            hideTooltips: false,
            hideQuestionMarkCTA: false,
            embedGoogleFonts: true,
            walletConnectCTA: "both",
            language: "en-US",
            initialChainId: bscTestnet.id,
            enforceSupportedChains: false,
            disableSiweRedirect: true,
            overlayBlur: 4,
            onConnect: () => {
              toast({
                title: "Wallet connected",
                description: "Your wallet has been successfully connected.",
              })
            },
            onDisconnect: () => {
              toast({
                title: "Wallet disconnected",
                description: "Your wallet has been disconnected.",
              })
            },
          }}
        >
          {children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
