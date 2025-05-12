"use client"

import { useEffect, useState } from "react"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"
import { useChart } from "@/components/ui/chart"
import { log } from "@/lib/debug-utils"

// Define the props for the chart components
interface ChartComponentsProps {
  data: any[]
  chartType: "price" | "volume"
}

// Main chart component
export default function ChartComponents({ data, chartType }: ChartComponentsProps) {
  const [mounted, setMounted] = useState(false)
  const { config } = useChart()

  useEffect(() => {
    setMounted(true)
    return () => {
      setMounted(false)
    }
  }, [])

  if (!mounted) {
    return <Skeleton className="h-full w-full" />
  }

  try {
    return (
      <ResponsiveContainer width="100%" height="100%">
        {chartType === "price" ? (
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="rgb(128,90,213)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="rgb(128,90,213)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-600/10" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(0,0,0,0.8)",
                border: "1px solid rgba(128,90,213,0.3)",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              formatter={(value: number) => [`$${value.toFixed(6)}`, "Price"]}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="rgb(128,90,213)"
              fillOpacity={1}
              fill="url(#colorPrice)"
              strokeWidth={2}
            />
          </AreaChart>
        ) : (
          <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-600/10" />
            <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(0,0,0,0.8)",
                border: "1px solid rgba(90,128,213,0.3)",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Bar dataKey="volume" fill="rgb(90,128,213)" radius={[4, 4, 0, 0]} />
          </BarChart>
        )}
      </ResponsiveContainer>
    )
  } catch (error) {
    log.error("Error rendering chart:", error)
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-center text-red-500">
          <p>Failed to render chart</p>
          <p className="text-sm text-gray-400 mt-2">{error instanceof Error ? error.message : String(error)}</p>
        </div>
      </div>
    )
  }
}
