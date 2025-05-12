// IMPORTANT: This file should only be imported in server components or API routes
// It should NOT be imported in client components

import { shouldUseMockData } from "@/lib/environment"
import { log } from "@/lib/debug-utils"

// Types for Moralis API responses
export interface TokenMetadata {
  address: string
  name: string
  symbol: string
  decimals: string
  logo?: string
  logo_hash?: string
  thumbnail?: string
  block_number?: string
  validated?: boolean
}

export interface TokenPrice {
  nativePrice?: {
    value: string
    decimals: number
    name: string
    symbol: string
  }
  usdPrice: number
  exchangeAddress?: string
  exchangeName?: string
}

export interface TokenHolder {
  token_address: string
  address: string
  balance: string
  block_number: string
  block_timestamp: string
}

export interface TokenTransfer {
  transaction_hash: string
  address: string
  block_timestamp: string
  block_number: string
  block_hash: string
  to_address: string
  from_address: string
  value: string
  transaction_index: number
  log_index: number
}

export interface PairReserves {
  reserve0: string
  reserve1: string
  reserve0_formatted: string
  reserve1_formatted: string
  totalSupply: string
}

// Mock data for development and testing
const MOCK_TOKEN_PRICE: TokenPrice = {
  nativePrice: {
    value: "12500000000000000",
    decimals: 18,
    name: "BNB",
    symbol: "BNB",
  },
  usdPrice: 0.025,
  exchangeAddress: "0x10ED43C718714eb63d5aA57B78B54704E256024E",
  exchangeName: "PancakeSwap v2",
}

// Helper function to validate token address
function isValidTokenAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

// Server-side only functions
export async function getTokenMetadata(tokenAddress: string, chain = "bsc"): Promise<TokenMetadata | null> {
  try {
    // Use shouldUseMockData() for consistency with other files
    if (shouldUseMockData()) {
      return {
        address: tokenAddress,
        name: "Five Pillars Token",
        symbol: "5PT",
        decimals: "18",
        logo: "https://example.com/logo.png",
        validated: true,
      }
    }

    const url = `https://deep-index.moralis.io/api/v2.2/erc20/metadata?chain=${chain}&addresses=${tokenAddress}`
    const response = await fetch(url, {
      headers: {
        // Using environment variable from Vercel dashboard
        "X-API-Key": process.env.MORALIS_API_KEY || "",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch token metadata: ${response.statusText}`)
    }

    const data = await response.json()
    return data[0] || null
  } catch (error) {
    console.error("Error fetching token metadata:", error)
    return null
  }
}

export async function getTokenPrice(tokenAddress: string, chain = "bsc"): Promise<TokenPrice | null> {
  try {
    log.debug(`Getting token price for ${tokenAddress} on ${chain}`)

    // Validate token address
    if (!isValidTokenAddress(tokenAddress)) {
      log.warn(`Invalid token address format: ${tokenAddress}`)
      return MOCK_TOKEN_PRICE // Return mock data for invalid addresses
    }

    // Check if we should use mock data
    if (shouldUseMockData()) {
      log.info(`Using mock data for token price (${tokenAddress})`)
      return MOCK_TOKEN_PRICE
    }

    // Check if Moralis API key is available
    if (!process.env.MORALIS_API_KEY) {
      log.warn("Moralis API key is missing. Using mock data instead.")
      return MOCK_TOKEN_PRICE
    }

    const url = `https://deep-index.moralis.io/api/v2.2/erc20/${tokenAddress}/price?chain=${chain}`
    log.debug(`Fetching from: ${url}`)

    const response = await fetch(url, {
      headers: {
        "X-API-Key": process.env.MORALIS_API_KEY,
      },
      // Add a timeout to prevent hanging requests
      signal: AbortSignal.timeout(10000), // 10 second timeout
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error")
      throw new Error(`API returned ${response.status} ${response.statusText}: ${errorText}`)
    }

    const data = await response.json()
    log.debug(`Successfully fetched token price for ${tokenAddress}`)
    return data
  } catch (error) {
    // More detailed error logging
    if (error instanceof Error) {
      console.error(`Error fetching token price for ${tokenAddress} on ${chain}: ${error.message}`)
    } else {
      console.error(`Unknown error fetching token price for ${tokenAddress}:`, error)
    }

    // Return mock data as fallback
    log.warn(`Returning mock data due to error fetching token price for ${tokenAddress}`)
    return MOCK_TOKEN_PRICE
  }
}

export async function getTokenHolders(tokenAddress: string, chain = "bsc", limit = 10): Promise<TokenHolder[] | null> {
  try {
    // Use shouldUseMockData() for consistency with other files
    if (shouldUseMockData()) {
      return Array.from({ length: limit }, (_, i) => ({
        token_address: tokenAddress,
        address: `0x${Math.random().toString(16).substring(2, 42)}`,
        balance: (Math.random() * 10000000 + 1000000).toString(),
        block_number: (12345678 + i).toString(),
        block_timestamp: new Date(Date.now() - i * 3600000).toISOString(),
      }))
    }

    const url = `https://deep-index.moralis.io/api/v2.2/erc20/${tokenAddress}/holders?chain=${chain}&limit=${limit}`
    const response = await fetch(url, {
      headers: {
        // Using environment variable from Vercel dashboard
        "X-API-Key": process.env.MORALIS_API_KEY || "",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch token holders: ${response.statusText}`)
    }

    const data = await response.json()
    return data.result || []
  } catch (error) {
    console.error("Error fetching token holders:", error)
    return null
  }
}

export async function getTokenTransfers(
  tokenAddress: string,
  chain = "bsc",
  limit = 10,
): Promise<TokenTransfer[] | null> {
  try {
    // Use shouldUseMockData() for consistency with other files
    if (shouldUseMockData()) {
      return Array.from({ length: limit }, (_, i) => ({
        transaction_hash: `0x${Math.random().toString(16).substring(2, 66)}`,
        address: tokenAddress,
        block_timestamp: new Date(Date.now() - i * 3600000).toISOString(),
        block_number: (12345678 + i).toString(),
        block_hash: `0x${Math.random().toString(16).substring(2, 66)}`,
        to_address:
          i % 5 === 0
            ? "0x0000000000000000000000000000000000000000"
            : `0x${Math.random().toString(16).substring(2, 42)}`,
        from_address:
          i % 3 === 0
            ? "0x0000000000000000000000000000000000000000"
            : `0x${Math.random().toString(16).substring(2, 42)}`,
        value: (Math.random() * 1000000 + 100000).toString(),
        transaction_index: i,
        log_index: i * 2,
      }))
    }

    const url = `https://deep-index.moralis.io/api/v2.2/erc20/${tokenAddress}/transfers?chain=${chain}&limit=${limit}`
    const response = await fetch(url, {
      headers: {
        // Using environment variable from Vercel dashboard
        "X-API-Key": process.env.MORALIS_API_KEY || "",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch token transfers: ${response.statusText}`)
    }

    const data = await response.json()
    return data.result || []
  } catch (error) {
    console.error("Error fetching token transfers:", error)
    return null
  }
}

export async function getPairReserves(pairAddress: string, chain = "bsc"): Promise<PairReserves | null> {
  try {
    // Use shouldUseMockData() for consistency with other files
    if (shouldUseMockData()) {
      return {
        reserve0: "12500000000000000000000",
        reserve1: "500000000000000000000",
        reserve0_formatted: "12500",
        reserve1_formatted: "500",
        totalSupply: "2500000000000000000000",
      }
    }

    const url = `https://deep-index.moralis.io/api/v2.2/erc20/${pairAddress}/reserves?chain=${chain}`
    const response = await fetch(url, {
      headers: {
        "X-API-Key": process.env.MORALIS_API_KEY || "",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch pair reserves: ${response.statusText}`)
    }

    const data = await response.json()
    return data || null
  } catch (error) {
    console.error("Error fetching pair reserves:", error)
    return null
  }
}
