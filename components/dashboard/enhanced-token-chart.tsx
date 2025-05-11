"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend, Area, AreaChart } from "recharts"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { getTokenPriceHistory } from "@/lib/token-price-client"
import type { PriceDataPoint } from "@/types/token"
import { CONTRACT_ADDRESSES } from "@/lib/contracts"

export function EnhancedTokenChart() {
  const [timeframe, setTimeframe] = useState<"7d" | "30d" | "90d" | "1y">("30d")
  const [chartType, setChartType] = useState<"price" | "volume">("price")
  const [isLoading, setIsLoading] = useState(true)
  const [priceData, setPriceData] = useState<PriceDataPoint[]>([])
  const [priceChange, setPriceChange] = useState(0)

  useEffect(() => {
    async function fetchPriceData() {
      setIsLoading(true)
      try {
        const result = await getTokenPriceHistory(CONTRACT_ADDRESSES.token, timeframe)
        setPriceData(result.data)
        setPriceChange(result.priceChange)
      } catch (error) {
        console.error("Failed to fetch price data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPriceData()
  }, [timeframe])

  // Format price change with + or - sign
  const formattedPriceChange = `${priceChange >= 0 ? "+" : ""}${priceChange.toFixed(2)}%`

  // Determine color based on price change
  const priceChangeColor = priceChange >= 0 ? "text-green-500" : "text-red-500"

  return (
    <Card className="col-span-1 lg:col-span-3 border-purple-500/20 bg-black/40 backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/20 pointer-events-none" />

      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Token Price History</CardTitle>
            <CardDescription className="flex items-center mt-1">
              Historical data for 5PT token
              {isLoading ? (
                <Skeleton className="ml-2 h-5 w-16" />
              ) : (
                <span className={`ml-2 font-medium ${priceChangeColor}`}>{formattedPriceChange}</span>
              )}
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button
              variant={timeframe === "7d" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeframe("7d")}
              className={
                timeframe === "7d"
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : "border-purple-500/30 hover:bg-purple-900/20"
              }
            >
              7D
            </Button>
            <Button
              variant={timeframe === "30d" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeframe("30d")}
              className={
                timeframe === "30d"
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : "border-purple-500/30 hover:bg-purple-900/20"
              }
            >
              30D
            </Button>
            <Button
              variant={timeframe === "90d" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeframe("90d")}
              className={
                timeframe === "90d"
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : "border-purple-500/30 hover:bg-purple-900/20"
              }
            >
              90D
            </Button>
            <Button
              variant={timeframe === "1y" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeframe("1y")}
              className={
                timeframe === "1y"
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : "border-purple-500/30 hover:bg-purple-900/20"
              }
            >
              1Y
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="price" className="space-y-4">
          <TabsList>
            <TabsTrigger
              value="price"
              onClick={() => setChartType("price")}
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              Price
            </TabsTrigger>
            <TabsTrigger
              value="volume"
              onClick={() => setChartType("volume")}
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              Volume
            </TabsTrigger>
          </TabsList>

          {isLoading ? (
            <div className="h-[400px] flex items-center justify-center">
              <div className="text-center">
                <Skeleton className="h-[300px] w-full" />
                <div className="mt-4 text-muted-foreground">Loading price data...</div>
              </div>
            </div>
          ) : (
            <>
              <TabsContent value="price" className="h-[400px]">
                <ChartContainer
                  config={{
                    price: {
                      label: "Price",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={priceData}>
                      <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(value) => {
                          const date = new Date(value)
                          return `${date.getMonth() + 1}/${date.getDate()}`
                        }}
                      />
                      <YAxis
                        tickFormatter={(value) => `$${value.toFixed(4)}`}
                        domain={["dataMin", "dataMax"]}
                        width={80}
                      />
                      <Tooltip
                        content={<ChartTooltipContent formatter={(value) => `$${Number(value).toFixed(6)}`} />}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="price"
                        stroke="hsl(var(--chart-1))"
                        fillOpacity={1}
                        fill="url(#colorPrice)"
                        strokeWidth={2}
                        activeDot={{ r: 8, fill: "hsl(var(--primary))" }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </TabsContent>

              <TabsContent value="volume" className="h-[400px]">
                <ChartContainer
                  config={{
                    volume: {
                      label: "Volume",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={priceData}>
                      <defs>
                        <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(value) => {
                          const date = new Date(value)
                          return `${date.getMonth() + 1}/${date.getDate()}`
                        }}
                      />
                      <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(2)}M`} width={80} />
                      <Tooltip
                        content={<ChartTooltipContent formatter={(value) => `${Number(value).toLocaleString()}`} />}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="volume"
                        stroke="hsl(var(--chart-2))"
                        fillOpacity={1}
                        fill="url(#colorVolume)"
                        strokeWidth={2}
                        activeDot={{ r: 8, fill: "hsl(var(--chart-2))" }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </TabsContent>
            </>
          )}
        </Tabs>
      </CardContent>
    </Card>
  )
}
