import type { PriceDataPoint } from "@/types/token"

export async function getTokenPriceHistory(
  tokenAddress: string,
  timeframe: "7d" | "30d" | "90d" | "1y" = "30d",
): Promise<{
  tokenAddress: string
  timeframe: string
  priceChange: number
  data: PriceDataPoint[]
}> {
  try {
    const response = await fetch(`/api/token/price-history?address=${tokenAddress}&timeframe=${timeframe}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch price history: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching token price history:", error)
    throw error
  }
}
