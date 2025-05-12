"use client"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Pie, PieChart, ResponsiveContainer, Cell } from "recharts"

interface TokenomicsChartProps {
  data: Array<{ name: string; value: number }>
  colors: string[]
}

export function TokenomicsChart({ data, colors }: TokenomicsChartProps) {
  return (
    <ChartContainer
      config={{
        tokenomics: {
          label: "Tokenomics",
        },
        ...data.reduce(
          (acc, item, index) => {
            acc[item.name.toLowerCase().replace(" ", "_")] = {
              label: item.name,
              color: colors[index % colors.length],
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
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <ChartTooltip content={<ChartTooltipContent />} />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
