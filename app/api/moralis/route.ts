import { type NextRequest, NextResponse } from "next/server"

// Using environment variable from Vercel dashboard
// No hardcoded values or fallbacks that could leak information
const BASE_URL = "https://deep-index.moralis.io/api/v2.2"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const action = searchParams.get("action")
  const tokenAddress = searchParams.get("tokenAddress")
  const chain = searchParams.get("chain") || "bsc"
  const limit = searchParams.get("limit") || "10"
  const pairAddress = searchParams.get("pairAddress")

  if (!action) {
    return NextResponse.json({ error: "Missing action parameter" }, { status: 400 })
  }

  if (!tokenAddress && !pairAddress) {
    return NextResponse.json({ error: "Missing address parameter" }, { status: 400 })
  }

  try {
    let url = ""
    switch (action) {
      case "getTokenMetadata":
        url = `${BASE_URL}/erc20/metadata?chain=${chain}&addresses=${tokenAddress}`
        break
      case "getTokenPrice":
        url = `${BASE_URL}/erc20/${tokenAddress}/price?chain=${chain}`
        break
      case "getPairReserves":
        if (!pairAddress) {
          return NextResponse.json({ error: "Missing pairAddress parameter" }, { status: 400 })
        }
        url = `${BASE_URL}/erc20/${pairAddress}/reserves?chain=${chain}`
        break
      case "getTokenHolders":
        url = `${BASE_URL}/erc20/${tokenAddress}/holders?chain=${chain}&limit=${limit}`
        break
      case "getTokenTransfers":
        url = `${BASE_URL}/erc20/${tokenAddress}/transfers?chain=${chain}&limit=${limit}`
        break
      default:
        return NextResponse.json({ error: "Invalid action parameter" }, { status: 400 })
    }

    const response = await fetch(url, {
      headers: {
        // Using environment variable from Vercel dashboard
        "X-API-Key": process.env.MORALIS_API_KEY || "",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`)
    }

    const data = await response.json()

    // Format the response based on the action
    if (action === "getTokenMetadata") {
      return NextResponse.json(data[0])
    } else if (action === "getTokenHolders" || action === "getTokenTransfers") {
      return NextResponse.json(data.result)
    } else {
      return NextResponse.json(data)
    }
  } catch (error) {
    console.error("Moralis API error:", error)
    return NextResponse.json({ error: "Failed to fetch data from Moralis API" }, { status: 500 })
  }
}
