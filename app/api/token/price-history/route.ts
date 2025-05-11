import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Define the response type for historical price data
interface PriceDataPoint {
  date: string
  price: number
  volume: number
}

// Mock data generator function (in a real app, this would fetch from Moralis or another API)
function generateHistoricalPriceData(
  days: number,
  startPrice: number,
  volatility: number,
  trend = 0.001,
): PriceDataPoint[] {
  return Array.from({ length: days }, (_, i) => {
    const date = new Date(Date.now() - (days - 1 - i) * 24 * 60 * 60 * 1000)
    // Add a slight upward trend over time plus random volatility
    const trendFactor = 1 + trend * i
    const randomFactor = 1 + (Math.random() * 2 - 1) * volatility
    const price = startPrice * trendFactor * randomFactor

    // Generate realistic volume data
    const volume = Math.floor(Math.random() * 1000000) + 500000

    return {
      date: date.toISOString().split("T")[0],
      price,
      volume,
    }
  })
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const tokenAddress = searchParams.get("address") || "0x123456789abcdef" // Default address
  const timeframe = searchParams.get("timeframe") || "30d"

  let days: number
  let startPrice: number
  let volatility: number
  let trend: number

  // Configure parameters based on timeframe
  switch (timeframe) {
    case "7d":
      days = 7
      startPrice = 0.01
      volatility = 0.05
      trend = 0.005
      break
    case "30d":
      days = 30
      startPrice = 0.008
      volatility = 0.1
      trend = 0.003
      break
    case "90d":
      days = 90
      startPrice = 0.005
      volatility = 0.2
      trend = 0.002
      break
    case "1y":
      days = 365
      startPrice = 0.001
      volatility = 0.5
      trend = 0.001
      break
    default:
      days = 30
      startPrice = 0.008
      volatility = 0.1
      trend = 0.003
  }

  // In a real implementation, you would fetch data from Moralis or another API
  // For example:
  // const data = await fetchHistoricalPrices(tokenAddress, days)

  // For now, we'll use mock data
  const priceData = generateHistoricalPriceData(days, startPrice, volatility, trend)

  // Calculate price change percentage
  const firstPrice = priceData[0].price
  const lastPrice = priceData[priceData.length - 1].price
  const priceChange = ((lastPrice - firstPrice) / firstPrice) * 100

  return NextResponse.json({
    tokenAddress,
    timeframe,
    priceChange,
    data: priceData,
  })
}
