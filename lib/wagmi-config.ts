/**
 * @file wagmi-config.ts
 * @description Configuration for wagmi library
 *
 * This file sets up the wagmi configuration including:
 * - Chain configuration (BSC Mainnet and Testnet)
 * - Transport configuration
 * - Network detection based on hostname
 *
 * @dependencies
 * - wagmi: Core Web3 library
 * - viem: Ethereum RPC client
 *
 * @related
 * - components/providers/Providers.tsx: Uses this configuration
 */

import { http, createConfig } from "wagmi"
import { bsc, bscTestnet } from "wagmi/chains"

// Chain IDs as constants (ALWAYS use numeric IDs)
export const BSC_MAINNET_ID = 56
export const BSC_TESTNET_ID = 97

/**
 * Detect network based on hostname
 *
 * CRITICAL: Always use hostname-based detection
 * Default to BSC Testnet for all environments
 *
 * @returns The chain ID to use based on hostname
 */
function detectNetwork(): number {
  // Default to testnet in SSR
  if (typeof window === "undefined") {
    return BSC_TESTNET_ID
  }

  const hostname = window.location.hostname

  // Production domains use mainnet
  if (hostname === "app.5pt.finance" || hostname === "www.5pt.finance" || hostname === "5pt.finance") {
    return BSC_MAINNET_ID
  }

  // All other environments use testnet
  return BSC_TESTNET_ID
}

// Get the chain ID based on hostname
const chainId = detectNetwork()

// Create wagmi config
export const config = createConfig({
  chains: [chainId === BSC_MAINNET_ID ? bsc : bscTestnet],
  transports: {
    [BSC_MAINNET_ID]: http("https://bsc-dataseed.binance.org"),
    [BSC_TESTNET_ID]: http("https://data-seed-prebsc-1-s1.binance.org:8545"),
  },
})
