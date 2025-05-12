// Client-side utility for Moralis API calls
// This file uses the API route instead of directly accessing Moralis API
import { isPreviewEnvironment } from "./environment"
import { mockTokenMetadata, mockTokenPrice, mockTokenHolders, mockTokenTransfers, mockPairReserves } from "./mock-data"

// Types (duplicated from moralis.ts to avoid importing server-side code)
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

// Client-side functions that use the API route
export async function getTokenMetadata(tokenAddress: string, chain = "bsc"): Promise<TokenMetadata | null> {
  // Use mock data in preview environment
  if (isPreviewEnvironment()) {
    return mockTokenMetadata
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

    const response = await fetch(`/api/moralis?action=getTokenMetadata&tokenAddress=${tokenAddress}&chain=${chain}`, {
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`Failed to fetch token metadata: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching token metadata:", error)
    return null
  }
}

export async function getTokenPrice(tokenAddress: string, chain = "bsc"): Promise<TokenPrice | null> {
  // Use mock data in preview environment
  if (isPreviewEnvironment()) {
    return mockTokenPrice
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

    const response = await fetch(`/api/moralis?action=getTokenPrice&tokenAddress=${tokenAddress}&chain=${chain}`, {
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`Failed to fetch token price: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching token price:", error)
    return null
  }
}

export async function getPairReserves(pairAddress: string, chain = "bsc"): Promise<PairReserves | null> {
  // Use mock data in preview environment
  if (isPreviewEnvironment()) {
    return mockPairReserves
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

    const response = await fetch(`/api/moralis?action=getPairReserves&pairAddress=${pairAddress}&chain=${chain}`, {
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`Failed to fetch pair reserves: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching pair reserves:", error)
    return null
  }
}

export async function getTokenHolders(tokenAddress: string, chain = "bsc", limit = 10): Promise<TokenHolder[] | null> {
  // Use mock data in preview environment
  if (isPreviewEnvironment()) {
    return mockTokenHolders
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

    const response = await fetch(
      `/api/moralis?action=getTokenHolders&tokenAddress=${tokenAddress}&chain=${chain}&limit=${limit}`,
      { signal: controller.signal },
    )

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`Failed to fetch token holders: ${response.statusText}`)
    }

    return await response.json()
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
  // Use mock data in preview environment
  if (isPreviewEnvironment()) {
    return mockTokenTransfers
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

    const response = await fetch(
      `/api/moralis?action=getTokenTransfers&tokenAddress=${tokenAddress}&chain=${chain}&limit=${limit}`,
      { signal: controller.signal },
    )

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`Failed to fetch token transfers: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching token transfers:", error)
    return null
  }
}

// Batch request function for multiple tokens
export async function batchGetTokenMetadata(
  tokenAddresses: string[],
  chain = "bsc",
): Promise<(TokenMetadata | null)[]> {
  // Use mock data in preview environment
  if (isPreviewEnvironment()) {
    return tokenAddresses.map(() => mockTokenMetadata)
  }

  // Split into chunks of 10 to avoid too many parallel requests
  const chunkSize = 10
  const chunks = []
  for (let i = 0; i < tokenAddresses.length; i += chunkSize) {
    chunks.push(tokenAddresses.slice(i, i + chunkSize))
  }

  const results: (TokenMetadata | null)[] = []

  for (const chunk of chunks) {
    const promises = chunk.map((address) => getTokenMetadata(address, chain))
    const chunkResults = await Promise.all(promises)
    results.push(...chunkResults)
  }

  return results
}

// Batch request function for multiple token prices
export async function batchGetTokenPrices(tokenAddresses: string[], chain = "bsc"): Promise<(TokenPrice | null)[]> {
  // Use mock data in preview environment
  if (isPreviewEnvironment()) {
    return tokenAddresses.map(() => mockTokenPrice)
  }

  // Split into chunks of 10 to avoid too many parallel requests
  const chunkSize = 10
  const chunks = []
  for (let i = 0; i < tokenAddresses.length; i += chunkSize) {
    chunks.push(tokenAddresses.slice(i, i + chunkSize))
  }

  const results: (TokenPrice | null)[] = []

  for (const chunk of chunks) {
    const promises = chunk.map((address) => getTokenPrice(address, chain))
    const chunkResults = await Promise.all(promises)
    results.push(...chunkResults)
  }

  return results
}
