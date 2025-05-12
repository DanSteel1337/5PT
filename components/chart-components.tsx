"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

interface ChartComponentsProps {
  data: any[]
  chartType?: "price" | "volume"
}

export function ChartComponents({ data, chartType = "price" }: ChartComponentsProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <defs>
          <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
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
        <YAxis tickFormatter={(value) => `$${value.toFixed(4)}`} domain={["dataMin", "dataMax"]} width={80} />
        <Tooltip
          formatter={(value: number) => [`$${value.toFixed(6)}`, "Price"]}
          labelFormatter={(label) => `Date: ${label}`}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="price"
          stroke="#8b5cf6"
          fillOpacity={1}
          fill="url(#colorPrice)"
          strokeWidth={2}
          activeDot={{ r: 8, fill: "#8b5cf6" }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

// Export as default for dynamic import compatibility
export default ChartComponents
