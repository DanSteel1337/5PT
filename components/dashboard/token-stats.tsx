"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useReadContract } from "wagmi"
import { formatUnits } from "viem"
import { CONTRACT_ADDRESSES, TOKEN_ABI } from "@/lib/contracts"
import { useQuery } from "@tanstack/react-query"
import { getTokenPrice, getPairReserves } from "@/lib/moralis"
import { Skeleton } from "@/components/ui/skeleton"
import { useMemo } from "react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Pie, PieChart, ResponsiveContainer, Cell, Legend } from "recharts"

export function TokenStats() {
  // Get token data from contract
  const { data: totalSupply, isPending: isLoadingSupply } = useReadContract({
    address: CONTRACT_ADDRESSES.token,
    abi: TOKEN_ABI,
    functionName: "totalSupply",
  })

  const { data: name, isPending: isLoadingName } = useReadContract({
    address: CONTRACT_ADDRESSES.token,
    abi: TOKEN_ABI,
    functionName: "name",
  })

  const { data: symbol, isPending: isLoadingSymbol } = useReadContract({
    address: CONTRACT_ADDRESSES.token,
    abi: TOKEN_ABI,
    functionName: "symbol",
  })

  const { data: decimals, isPending: isLoadingDecimals } = useReadContract({
    address: CONTRACT_ADDRESSES.token,
    abi: TOKEN_ABI,
    functionName: "decimals",
  })

  // Get token price from Moralis using the specified token
  const { data: priceData, isLoading: isLoadingPrice } = useQuery({
    queryKey: ["tokenPrice", CONTRACT_ADDRESSES.priceToken],
    queryFn: () => getTokenPrice(CONTRACT_ADDRESSES.priceToken),
    refetchInterval: 60000, // Refetch every minute
  })

  // Get pair reserves for additional data
  const { data: pairReserves, isLoading: isLoadingReserves } = useQuery({
    queryKey: ["pairReserves", CONTRACT_ADDRESSES.pricePool],
    queryFn: () => getPairReserves(CONTRACT_ADDRESSES.pricePool),
    refetchInterval: 60000, // Refetch every minute
  })

  const isLoading = useMemo(
    () =>
      isLoadingSupply || isLoadingName || isLoadingSymbol || isLoadingDecimals || isLoadingPrice || isLoadingReserves,
    [isLoadingSupply, isLoadingName, isLoadingSymbol, isLoadingDecimals, isLoadingPrice, isLoadingReserves],
  )

  // Calculate market cap using useMemo to avoid recalculations during render
  const marketCap = useMemo(() => {
    if (!totalSupply || !decimals || !priceData) return 0
    return Number(formatUnits(totalSupply, decimals)) * priceData.usdPrice
  }, [totalSupply, decimals, priceData])

  // Calculate liquidity using useMemo
  const liquidity = useMemo(() => {
    if (!pairReserves || !priceData) return 0
    return Number(pairReserves.reserve1_formatted) * priceData.usdPrice * 2
  }, [pairReserves, priceData])

  // Format total supply using useMemo
  const formattedTotalSupply = useMemo(() => {
    if (!totalSupply || !decimals) return "0"
    return Number(formatUnits(totalSupply, decimals)).toLocaleString(undefined, { maximumFractionDigits: 0 })
  }, [totalSupply, decimals])

  // Token distribution data
  const distributionData = [
    { name: "Liquidity", value: 30 },
    { name: "Treasury", value: 25 },
    { name: "Team", value: 15 },
    { name: "Marketing", value: 10 },
    { name: "Development", value: 10 },
    { name: "Community", value: 10 },
  ]

  const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
    "hsl(var(--chart-6))",
  ]

  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader>
        <CardTitle>Token Statistics</CardTitle>
        <CardDescription>Key metrics and distribution of 5PT token</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Token Name</h3>
                {isLoadingName ? (
                  <Skeleton className="h-6 w-[120px]" />
                ) : (
                  <p className="text-xl font-bold">{name || "Five Pillars Token"}</p>
                )}
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Symbol</h3>
                {isLoadingSymbol ? (
                  <Skeleton className="h-6 w-[60px]" />
                ) : (
                  <p className="text-xl font-bold">{symbol || "5PT"}</p>
                )}
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Total Supply</h3>
                {isLoading ? (
                  <Skeleton className="h-6 w-[120px]" />
                ) : (
                  <p className="text-xl font-bold">{formattedTotalSupply}</p>
                )}
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Current Price</h3>
                {isLoadingPrice ? (
                  <Skeleton className="h-6 w-[80px]" />
                ) : (
                  <p className="text-xl font-bold">${priceData?.usdPrice.toFixed(6) || "0.00"}</p>
                )}
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Market Cap</h3>
                {isLoading ? (
                  <Skeleton className="h-6 w-[120px]" />
                ) : (
                  <p className="text-xl font-bold">
                    ${marketCap.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Liquidity</h3>
                {isLoadingReserves ? (
                  <Skeleton className="h-6 w-[120px]" />
                ) : (
                  <p className="text-xl font-bold">
                    ${liquidity.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Blockchain</h3>
                <p className="text-xl font-bold">BSC</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Token Type</h3>
                <p className="text-xl font-bold">BEP-20</p>
              </div>
            </div>
          </div>
          <div className="h-[300px]">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">Token Distribution</h3>
            <ChartContainer
              config={{
                tokenomics: {
                  label: "Tokenomics",
                },
                ...distributionData.reduce(
                  (acc, item, index) => {
                    acc[item.name.toLowerCase().replace(" ", "_")] = {
                      label: item.name,
                      color: COLORS[index % COLORS.length],
                    }
                    return acc
                  },
                  {} as Record<string, { label: string; color: string }>,
                ),
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
