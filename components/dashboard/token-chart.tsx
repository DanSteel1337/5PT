"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data - in a real app, this would come from an API
const generateMockData = (days: number, startPrice: number, volatility: number) => {
  return Array.from({ length: days }, (_, i) => {
    const date = new Date(Date.now() - (days - 1 - i) * 24 * 60 * 60 * 1000)
    const randomFactor = 1 + (Math.random() * 2 - 1) * volatility
    const price = startPrice * randomFactor

    // Add volume data
    const volume = Math.floor(Math.random() * 1000000) + 500000

    return {
      date: date.toISOString().split("T")[0],
      price,
      volume,
    }
  })
}

const mockPriceData = {
  "7d": generateMockData(7, 0.01, 0.05),
  "30d": generateMockData(30, 0.008, 0.1),
  "90d": generateMockData(90, 0.005, 0.2),
  "1y": generateMockData(365, 0.001, 0.5),
}

export function TokenChart() {
  const [timeframe, setTimeframe] = useState<"7d" | "30d" | "90d" | "1y">("7d")
  const [chartType, setChartType] = useState<"price" | "volume">("price")

  const chartData = useMemo(() => mockPriceData[timeframe], [timeframe])

  // Calculate price change percentage
  const priceChange = useMemo(() => {
    if (chartData.length < 2) return 0
    const firstPrice = chartData[0].price
    const lastPrice = chartData[chartData.length - 1].price
    return ((lastPrice - firstPrice) / firstPrice) * 100
  }, [chartData])

  // Format price change with + or - sign
  const formattedPriceChange = useMemo(() => {
    return `${priceChange >= 0 ? "+" : ""}${priceChange.toFixed(2)}%`
  }, [priceChange])

  // Determine color based on price change
  const priceChangeColor = useMemo(() => {
    return priceChange >= 0 ? "text-green-500" : "text-red-500"
  }, [priceChange])

  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Token Price History</CardTitle>
            <CardDescription className="flex items-center mt-1">
              Historical data for 5PT token
              <span className={`ml-2 font-medium ${priceChangeColor}`}>{formattedPriceChange}</span>
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button
              variant={timeframe === "7d" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeframe("7d")}
              className={timeframe === "7d" ? "bg-gold-500 hover:bg-gold-600 text-black" : ""}
            >
              7D
            </Button>
            <Button
              variant={timeframe === "30d" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeframe("30d")}
              className={timeframe === "30d" ? "bg-gold-500 hover:bg-gold-600 text-black" : ""}
            >
              30D
            </Button>
            <Button
              variant={timeframe === "90d" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeframe("90d")}
              className={timeframe === "90d" ? "bg-gold-500 hover:bg-gold-600 text-black" : ""}
            >
              90D
            </Button>
            <Button
              variant={timeframe === "1y" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeframe("1y")}
              className={timeframe === "1y" ? "bg-gold-500 hover:bg-gold-600 text-black" : ""}
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
              className="data-[state=active]:bg-gold-500 data-[state=active]:text-black"
            >
              Price
            </TabsTrigger>
            <TabsTrigger
              value="volume"
              onClick={() => setChartType("volume")}
              className="data-[state=active]:bg-gold-500 data-[state=active]:text-black"
            >
              Volume
            </TabsTrigger>
          </TabsList>
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
                <LineChart data={chartData}>
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
                <LineChart data={chartData}>
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
                  <Line
                    type="monotone"
                    dataKey="volume"
                    stroke="var(--color-volume)"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 8, fill: "hsl(var(--chart-2))" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
