"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { importRecharts } from "@/lib/dynamic-import-helper"
import { ChartContainer } from "@/components/ui/chart"
import { log } from "@/lib/debug-utils"

// Types for recharts components
type RechartsComponents = {
  LineChart: any
  Line: any
  XAxis: any
  YAxis: any
  CartesianGrid: any
  Tooltip: any
  Legend: any
  ResponsiveContainer: any
}

// Mock data for the chart
const mockData = [
  { date: "Jan 1", price: 0.0012 },
  { date: "Jan 15", price: 0.0014 },
  { date: "Feb 1", price: 0.0018 },
  { date: "Feb 15", price: 0.0016 },
  { date: "Mar 1", price: 0.0022 },
  { date: "Mar 15", price: 0.0025 },
  { date: "Apr 1", price: 0.0028 },
  { date: "Apr 15", price: 0.0032 },
  { date: "May 1", price: 0.0035 },
  { date: "May 15", price: 0.0038 },
  { date: "Jun 1", price: 0.0042 },
  { date: "Jun 15", price: 0.0045 },
]

export function TokenChart() {
  const [chartComponents, setChartComponents] = useState<RechartsComponents | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("1m")
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function loadChartComponents() {
      try {
        const components = await importRecharts()
        setChartComponents(components)
      } catch (error) {
        log.error("Failed to load chart components:", error)
        setError(error instanceof Error ? error : new Error(String(error)))
      } finally {
        setIsLoading(false)
      }
    }

    loadChartComponents()
  }, [])

  // Filter data based on active tab
  const getFilteredData = () => {
    switch (activeTab) {
      case "1d":
        return mockData.slice(-2)
      case "1w":
        return mockData.slice(-4)
      case "1m":
        return mockData.slice(-8)
      case "1y":
        return mockData
      default:
        return mockData
    }
  }

  if (error) {
    return (
      <Card className="dashboard-card hover-card">
        <CardHeader>
          <CardTitle>Token Price</CardTitle>
          <CardDescription>Error loading chart</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 text-red-500 bg-red-50 rounded-md">Failed to load chart: {error.message}</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="dashboard-card hover-card">
      <CardHeader>
        <CardTitle>Token Price</CardTitle>
        <CardDescription>5PT token price history</CardDescription>
        <Tabs defaultValue="1m" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="1d">1D</TabsTrigger>
            <TabsTrigger value="1w">1W</TabsTrigger>
            <TabsTrigger value="1m">1M</TabsTrigger>
            <TabsTrigger value="1y">1Y</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          {isLoading || !chartComponents ? (
            <div className="flex h-full items-center justify-center">
              <Skeleton className="h-[250px] w-full" />
            </div>
          ) : (
            <ChartContainer
              config={{
                price: {
                  color: "rgb(128,90,213)",
                },
              }}
            >
              <chartComponents.LineChart data={getFilteredData()} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <chartComponents.CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <chartComponents.XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
                <chartComponents.YAxis stroke="rgba(255,255,255,0.5)" />
                <chartComponents.Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0,0,0,0.8)",
                    border: "1px solid rgba(128,90,213,0.3)",
                    borderRadius: "8px",
                  }}
                />
                <chartComponents.Line
                  type="monotone"
                  dataKey="price"
                  stroke="rgb(128,90,213)"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "rgb(128,90,213)", stroke: "rgb(128,90,213)" }}
                  activeDot={{ r: 6, fill: "rgb(128,90,213)", stroke: "white", strokeWidth: 2 }}
                />
              </chartComponents.LineChart>
            </ChartContainer>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
