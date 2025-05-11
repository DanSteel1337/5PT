// IMPORTANT: This file should only be imported in server components or API routes
// It should NOT be imported in client components

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

// Server-side only functions
export async function getTokenMetadata(tokenAddress: string, chain = "bsc"): Promise<TokenMetadata | null> {
  try {
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
    const url = `https://deep-index.moralis.io/api/v2.2/erc20/${tokenAddress}/price?chain=${chain}`
    const response = await fetch(url, {
      headers: {
        // Using environment variable from Vercel dashboard
        "X-API-Key": process.env.MORALIS_API_KEY || "",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch token price: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching token price:", error)
    return null
  }
}

export async function getTokenHolders(tokenAddress: string, chain = "bsc", limit = 10): Promise<TokenHolder[] | null> {
  try {
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
