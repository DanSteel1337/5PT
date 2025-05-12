import { type NextRequest, NextResponse } from "next/server"
import { rateLimit } from "@/lib/rate-limit"
import { cacheResponse } from "@/lib/api-cache"
import { MoralisApiError, handleMoralisError } from "@/lib/moralis-error-handler"
import { validateTokenAddress, validateChain } from "@/lib/api-validation"

// Using environment variable from Vercel dashboard
const BASE_URL = "https://deep-index.moralis.io/api/v2.2"

// Define cache TTL for different endpoints (in seconds)
const CACHE_TTL = {
  metadata: 86400, // 24 hours
  price: 300, // 5 minutes
  reserves: 300, // 5 minutes
  holders: 1800, // 30 minutes
  transfers: 300, // 5 minutes
}

// Create a limiter with 50 requests per minute
const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 50, // 50 requests per minute
})

export async function GET(request: NextRequest) {
  // Apply rate limiting
  try {
    await limiter.check(request, 10) // Allow 10 requests per minute per IP
  } catch (error) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": "60" } },
    )
  }

  const searchParams = request.nextUrl.searchParams
  const action = searchParams.get("action")
  const tokenAddress = searchParams.get("tokenAddress")
  const chain = searchParams.get("chain") || "bsc"
  const limit = searchParams.get("limit") || "10"
  const pairAddress = searchParams.get("pairAddress")

  // Validate required parameters
  if (!action) {
    return NextResponse.json({ error: "Missing action parameter" }, { status: 400 })
  }

  if (!tokenAddress && !pairAddress) {
    return NextResponse.json({ error: "Missing address parameter" }, { status: 400 })
  }

  // Validate token address format
  if (tokenAddress && !validateTokenAddress(tokenAddress)) {
    return NextResponse.json({ error: "Invalid token address format" }, { status: 400 })
  }

  // Validate chain parameter
  if (!validateChain(chain)) {
    return NextResponse.json({ error: "Unsupported blockchain" }, { status: 400 })
  }

  // Generate cache key based on all parameters
  const cacheKey = `moralis:${action}:${tokenAddress || ""}:${pairAddress || ""}:${chain}:${limit}`

  try {
    // Check cache first
    const cachedResponse = await cacheResponse.get(cacheKey)
    if (cachedResponse) {
      return NextResponse.json(JSON.parse(cachedResponse))
    }

    let url = ""
    let cacheTtl = 300 // Default 5 minutes

    switch (action) {
      case "getTokenMetadata":
        url = `${BASE_URL}/erc20/metadata?chain=${chain}&addresses=${tokenAddress}`
        cacheTtl = CACHE_TTL.metadata
        break
      case "getTokenPrice":
        url = `${BASE_URL}/erc20/${tokenAddress}/price?chain=${chain}`
        cacheTtl = CACHE_TTL.price
        break
      case "getPairReserves":
        if (!pairAddress) {
          return NextResponse.json({ error: "Missing pairAddress parameter" }, { status: 400 })
        }
        url = `${BASE_URL}/erc20/${pairAddress}/reserves?chain=${chain}`
        cacheTtl = CACHE_TTL.reserves
        break
      case "getTokenHolders":
        url = `${BASE_URL}/erc20/${tokenAddress}/holders?chain=${chain}&limit=${limit}`
        cacheTtl = CACHE_TTL.holders
        break
      case "getTokenTransfers":
        url = `${BASE_URL}/erc20/${tokenAddress}/transfers?chain=${chain}&limit=${limit}`
        cacheTtl = CACHE_TTL.transfers
        break
      default:
        return NextResponse.json({ error: "Invalid action parameter" }, { status: 400 })
    }

    const response = await fetch(url, {
      headers: {
        "X-API-Key": process.env.MORALIS_API_KEY || "",
        Accept: "application/json",
      },
      next: { revalidate: cacheTtl }, // Use Next.js built-in cache
    })

    if (!response.ok) {
      throw new MoralisApiError(`Moralis API error: ${response.statusText}`, response.status, await response.text())
    }

    const data = await response.json()

    // Format the response based on the action
    let formattedResponse
    if (action === "getTokenMetadata") {
      formattedResponse = data[0]
    } else if (action === "getTokenHolders" || action === "getTokenTransfers") {
      formattedResponse = data.result
    } else {
      formattedResponse = data
    }

    // Cache the response
    await cacheResponse.set(cacheKey, JSON.stringify(formattedResponse), cacheTtl)

    return NextResponse.json(formattedResponse)
  } catch (error) {
    return handleMoralisError(error)
  }
}
