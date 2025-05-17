/**
 * @file network-utils.ts
 * @description Network utility functions for BSC chain detection and interaction
 *
 * This file provides utility functions for detecting the current network,
 * formatting addresses, and getting network-specific information like
 * explorer URLs. It implements hostname-based network detection.
 *
 * @dependencies
 * - wagmi/chains: Provides chain definitions
 *
 * @related
 * - lib/wagmi-config.ts: Uses similar network detection logic
 * - components/web3/NetworkSwitcher.tsx: Uses these utilities
 */

"use client"

import { bsc, bscTestnet } from "wagmi/chains"

/**
 * Determines if the application is running in a production environment
 * based on the hostname.
 *
 * @returns {boolean} True if in production, false otherwise
 */
export function isProduction(): boolean {
  if (typeof window === "undefined") return false // Default to testnet in SSR

  const hostname = window.location.hostname
  return hostname === "app.5pt.finance" || hostname === "5pt.finance" || hostname === "www.5pt.finance"
}

/**
 * Gets the current network chain based on the environment
 *
 * @returns The chain object (bsc or bscTestnet)
 */
export function getCurrentChain() {
  return isProduction() ? bsc : bscTestnet
}

/**
 * Gets the network name based on the current environment
 *
 * @returns {string} "Mainnet" or "Testnet"
 */
export function getNetworkName(): string {
  return isProduction() ? "Mainnet" : "Testnet"
}

/**
 * Gets the explorer URL for the current network
 *
 * @returns {string} The block explorer URL
 */
export function getExplorerUrl(): string {
  return isProduction() ? "https://bscscan.com" : "https://testnet.bscscan.com"
}

/**
 * Formats an address for display (shortens it)
 *
 * @param {string} address The full address
 * @returns {string} The shortened address
 */
export function formatAddress(address: string): string {
  if (!address) return ""
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
}

/**
 * Creates a block explorer link for an address
 *
 * @param {string} address The address to link to
 * @returns {string} The full explorer URL for the address
 */
export function getAddressExplorerLink(address: string): string {
  return `${getExplorerUrl()}/address/${address}`
}

/**
 * Creates a block explorer link for a transaction
 *
 * @param {string} txHash The transaction hash to link to
 * @returns {string} The full explorer URL for the transaction
 */
export function getTransactionExplorerLink(txHash: string): string {
  return `${getExplorerUrl()}/tx/${txHash}`
}
