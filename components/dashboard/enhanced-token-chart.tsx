"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import dynamic from "next/dynamic"
import { mockPriceHistory, mockTimeframeData } from "@/lib/mock-data"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { QueryClientProvider } from "../providers/query-client-provider"

// Dynamically import recharts components to reduce initial bundle size
const ChartComponents = dynamic(() => import("../chart-components"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] flex items-center justify-center">
      <Skeleton className="h-[300px] w-full" />
    </div>
  ),
})

// Component implementation
function EnhancedTokenChartContent() {
  const [mounted, setMounted] = useState(false)
  const [timeframe, setTimeframe] = useState<"7d" | "30d" | "90d" | "1y">("30d")
  const [chartType, setChartType] = useState<"price" | "volume">("price")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Use mock data based on timeframe with memoization
  const data = useMemo(() => {
    try {
      return mockTimeframeData[timeframe] || mockPriceHistory
    } catch (err) {
      setError("Failed to load chart data")
      return []
    }
  }, [timeframe])

  // Calculate price change with memoization
  const priceChange = useMemo(() => {
    if (data.length < 2) return 0
    return ((data[data.length - 1].price - data[0].price) / data[0].price) * 100
  }, [data])

  // Format price change with + or - sign
  const formattedPriceChange = useMemo(() => {
    return `${priceChange >= 0 ? "+" : ""}${priceChange.toFixed(2)}%`
  }, [priceChange])

  // Determine color based on price change
  const priceChangeColor = useMemo(() => {
    return priceChange >= 0 ? "text-green-500" : "text-red-500"
  }, [priceChange])

  if (error) {
    return (
      <Card className="col-span-1 lg:col-span-3 border-purple-500/20 bg-black/40 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Token Price History</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

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
                {mounted ? (
                  <ChartComponents data={data} chartType={chartType} />
                ) : (
                  <div className="h-[400px] flex items-center justify-center">
                    <Skeleton className="h-[300px] w-full" />
                  </div>
                )}
              </TabsContent>

              <TabsContent value="volume" className="h-[400px]">
                <div className="h-full flex items-center justify-center">
                  <p className="text-muted-foreground">Volume data is not available in preview mode.</p>
                </div>
              </TabsContent>
            </>
          )}
        </Tabs>
      </CardContent>
    </Card>
  )
}

// Export the wrapped component
export function EnhancedTokenChart() {
  return (
    <QueryClientProvider>
      <EnhancedTokenChartContent />
    </QueryClientProvider>
  )
}
