"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { ArrowDown, ArrowUp, Users, Coins, DollarSign, BarChart } from "lucide-react"
import { useReadContract } from "wagmi"
import { CONTRACT_ADDRESSES, TOKEN_ABI } from "@/lib/contracts"
import { formatUnits } from "viem"
import { useQuery } from "@tanstack/react-query"
import { getTokenPrice, getTokenHolders } from "@/lib/moralis"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from "recharts"

// Mock price history data - in a real app, this would come from an API
const generatePriceHistory = () => {
  const today = new Date()
  const data = []
  for (let i = 30; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    // Base price with some randomness
    const basePrice = 0.01 * (1 + (30 - i) * 0.01) // Slight uptrend
    const randomFactor = 0.9 + Math.random() * 0.2 // Random factor between 0.9 and 1.1
    const price = basePrice * randomFactor

    data.push({
      date: date.toISOString().split("T")[0],
      price: price,
    })
  }
  return data
}

interface TokenMetricsCardProps {
  expanded?: boolean
}

export function TokenMetricsCard({ expanded = false }: TokenMetricsCardProps) {
  const [priceHistory, setPriceHistory] = useState(generatePriceHistory())

  // Get token data from contract
  const { data: totalSupply, isPending: isLoadingSupply } = useReadContract({
    address: CONTRACT_ADDRESSES.token,
    abi: TOKEN_ABI,
    functionName: "totalSupply",
  })

  const { data: decimals, isPending: isLoadingDecimals } = useReadContract({
    address: CONTRACT_ADDRESSES.token,
    abi: TOKEN_ABI,
    functionName: "decimals",
  })

  // Get token price from Moralis
  const { data: priceData, isLoading: isLoadingPrice } = useQuery({
    queryKey: ["tokenPrice", CONTRACT_ADDRESSES.token],
    queryFn: () => getTokenPrice(CONTRACT_ADDRESSES.token),
    refetchInterval: 60000, // Refetch every minute
  })

  // Get token holders from Moralis
  const { data: holdersData, isLoading: isLoadingHolders } = useQuery({
    queryKey: ["tokenHolders", CONTRACT_ADDRESSES.token],
    queryFn: () => getTokenHolders(CONTRACT_ADDRESSES.token, 100),
    refetchInterval: 300000, // Refetch every 5 minutes
  })

  const isLoading = isLoadingSupply || isLoadingDecimals || isLoadingPrice || isLoadingHolders

  // Calculate market cap
  const marketCap = useMemo(() => {
    if (!totalSupply || !decimals || !priceData) return 0
    return Number(formatUnits(totalSupply, decimals)) * priceData.usdPrice
  }, [totalSupply, decimals, priceData])

  // Calculate circulating supply (mock - in a real app, this would come from an API)
  const circulatingSupply = useMemo(() => {
    if (!totalSupply || !decimals) return 0
    // Assume 70% of total supply is circulating
    return Number(formatUnits(totalSupply, decimals)) * 0.7
  }, [totalSupply, decimals])

  // Calculate 24h price change
  const priceChange24h = useMemo(() => {
    if (priceHistory.length < 2) return 0
    const currentPrice = priceHistory[priceHistory.length - 1].price
    const yesterdayPrice = priceHistory[priceHistory.length - 2].price
    return ((currentPrice - yesterdayPrice) / yesterdayPrice) * 100
  }, [priceHistory])

  // Format total supply
  const formattedTotalSupply = useMemo(() => {
    if (!totalSupply || !decimals) return "0"
    return Number(formatUnits(totalSupply, decimals)).toLocaleString(undefined, { maximumFractionDigits: 0 })
  }, [totalSupply, decimals])

  // Format circulating supply
  const formattedCirculatingSupply = useMemo(() => {
    return circulatingSupply.toLocaleString(undefined, { maximumFractionDigits: 0 })
  }, [circulatingSupply])

  // Format holders count
  const holdersCount = useMemo(() => {
    if (!holdersData) return 0
    return holdersData.length
  }, [holdersData])

  return (
    <Card className={expanded ? "col-span-full" : ""}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Token Metrics</CardTitle>
            <CardDescription>Real-time 5PT token performance data</CardDescription>
          </div>
          <Badge
            variant="outline"
            className={`${
              priceChange24h >= 0 ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
            } border-none`}
          >
            {priceChange24h >= 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
            {Math.abs(priceChange24h).toFixed(2)}% (24h)
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center text-muted-foreground text-sm">
                  <DollarSign className="h-4 w-4 mr-1 text-purple-400" />
                  Current Price
                </div>
                {isLoadingPrice ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <div className="text-2xl font-bold text-purple-300">${priceData?.usdPrice.toFixed(6) || "0.00"}</div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-muted-foreground text-sm">
                  <BarChart className="h-4 w-4 mr-1 text-purple-400" />
                  Market Cap
                </div>
                {isLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <div className="text-2xl font-bold text-purple-300">
                    ${marketCap.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-muted-foreground text-sm">
                  <Coins className="h-4 w-4 mr-1 text-purple-400" />
                  Total Supply
                </div>
                {isLoadingSupply ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <div className="text-2xl font-bold text-purple-300">{formattedTotalSupply}</div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-muted-foreground text-sm">
                  <Coins className="h-4 w-4 mr-1 text-purple-400" />
                  Circulating Supply
                </div>
                {isLoadingSupply ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <div className="text-2xl font-bold text-purple-300">{formattedCirculatingSupply}</div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-muted-foreground text-sm">
                  <Users className="h-4 w-4 mr-1 text-purple-400" />
                  Token Holders
                </div>
                {isLoadingHolders ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <div className="text-2xl font-bold text-purple-300">{holdersCount.toLocaleString()}</div>
                )}
              </div>
            </div>
          </div>

          <div className={`h-[200px] ${expanded ? "h-[300px]" : ""}`}>
            <ChartContainer
              config={{
                price: {
                  label: "Price",
                  color: "hsl(var(--chart-1))",
                },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={priceHistory}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => {
                      const date = new Date(value)
                      return `${date.getMonth() + 1}/${date.getDate()}`
                    }}
                  />
                  <YAxis tickFormatter={(value) => `$${value.toFixed(4)}`} domain={["dataMin", "dataMax"]} width={80} />
                  <Tooltip content={<ChartTooltipContent formatter={(value) => `$${Number(value).toFixed(6)}`} />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="var(--color-price)"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 8, fill: "hsl(var(--primary))" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
