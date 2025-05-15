"use client"

import { useEffect, useRef } from "react"

interface BarChartProps {
  data: any
  keys?: string[]
  indexBy?: string
  colors?: string[]
}

export function BarChart({
  data,
  keys = ["value"],
  indexBy = "label",
  colors = ["#8b5cf6", "#10b981"],
}: BarChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || !data) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Get canvas dimensions
    const width = canvas.width
    const height = canvas.height

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Handle different data formats
    if (data.datasets && data.labels) {
      // Format 1: { labels: string[], datasets: [{ label: string, data: number[], color: string }] }
      drawBarChartFormat1(ctx, data, width, height, colors)
    } else if (Array.isArray(data)) {
      // Format 2: [{ indexBy: string, key1: number, key2: number, ... }]
      drawBarChartFormat2(ctx, data, keys, indexBy, width, height, colors)
    } else {
      console.error("Unsupported data format for BarChart")
    }
  }, [data, keys, indexBy, colors])

  const drawBarChartFormat1 = (
    ctx: CanvasRenderingContext2D,
    data: any,
    width: number,
    height: number,
    colors: string[],
  ) => {
    const { labels, datasets } = data
    if (!labels || !datasets || datasets.length === 0) return

    // Calculate dimensions
    const padding = 40
    const chartWidth = width - padding * 2
    const chartHeight = height - padding * 2
    const barWidth = chartWidth / labels.length / datasets.length - 4

    // Find max value
    const maxValue = Math.max(...datasets.flatMap((ds: any) => ds.data))

    // Draw bars
    datasets.forEach((dataset: any, datasetIndex: number) => {
      dataset.data.forEach((value: number, index: number) => {
        const x = padding + index * (datasets.length * (barWidth + 4)) + datasetIndex * (barWidth + 4)
        const barHeight = (value / maxValue) * chartHeight
        const y = height - padding - barHeight

        // Draw bar with gradient
        const gradient = ctx.createLinearGradient(x, y, x, y + barHeight)
        gradient.addColorStop(0, dataset.color || colors[datasetIndex % colors.length])
        gradient.addColorStop(1, `${dataset.color || colors[datasetIndex % colors.length]}80`) // 50% opacity

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.roundRect(x, y, barWidth, barHeight, 4)
        ctx.fill()

        // Add glow effect
        ctx.shadowColor = dataset.color || colors[datasetIndex % colors.length]
        ctx.shadowBlur = 8
        ctx.strokeStyle = dataset.color || colors[datasetIndex % colors.length]
        ctx.stroke()
        ctx.shadowBlur = 0
      })
    })

    // Draw x-axis labels
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)"
    ctx.font = "10px sans-serif"
    ctx.textAlign = "center"

    labels.forEach((label: string, index: number) => {
      const x = padding + index * (datasets.length * (barWidth + 4)) + (datasets.length * barWidth) / 2
      ctx.fillText(label, x, height - 10)
    })

    // Draw legend
    if (datasets.length > 1) {
      const legendY = 15
      let legendX = padding

      datasets.forEach((dataset: any, index: number) => {
        const color = dataset.color || colors[index % colors.length]

        // Draw color box
        ctx.fillStyle = color
        ctx.fillRect(legendX, legendY - 8, 10, 10)

        // Draw label
        ctx.fillStyle = "rgba(255, 255, 255, 0.7)"
        ctx.font = "10px sans-serif"
        ctx.textAlign = "left"
        ctx.fillText(dataset.label || `Series ${index + 1}`, legendX + 15, legendY)

        legendX += ctx.measureText(dataset.label || `Series ${index + 1}`).width + 30
      })
    }
  }

  const drawBarChartFormat2 = (
    ctx: CanvasRenderingContext2D,
    data: any[],
    keys: string[],
    indexBy: string,
    width: number,
    height: number,
    colors: string[],
  ) => {
    if (data.length === 0) return

    // Calculate dimensions
    const padding = 40
    const chartWidth = width - padding * 2
    const chartHeight = height - padding * 2
    const barWidth = chartWidth / data.length / keys.length - 4

    // Find max value
    const maxValue = Math.max(...data.flatMap((item) => keys.map((key) => item[key] || 0)))

    // Draw bars
    keys.forEach((key, keyIndex) => {
      data.forEach((item, itemIndex) => {
        const value = item[key] || 0
        const x = padding + itemIndex * (keys.length * (barWidth + 4)) + keyIndex * (barWidth + 4)
        const barHeight = (value / maxValue) * chartHeight
        const y = height - padding - barHeight

        // Draw bar with gradient
        const gradient = ctx.createLinearGradient(x, y, x, y + barHeight)
        gradient.addColorStop(0, colors[keyIndex % colors.length])
        gradient.addColorStop(1, `${colors[keyIndex % colors.length]}80`) // 50% opacity

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.roundRect(x, y, barWidth, barHeight, 4)
        ctx.fill()

        // Add glow effect
        ctx.shadowColor = colors[keyIndex % colors.length]
        ctx.shadowBlur = 8
        ctx.strokeStyle = colors[keyIndex % colors.length]
        ctx.stroke()
        ctx.shadowBlur = 0
      })
    })

    // Draw x-axis labels
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)"
    ctx.font = "10px sans-serif"
    ctx.textAlign = "center"

    data.forEach((item, index) => {
      const x = padding + index * (keys.length * (barWidth + 4)) + (keys.length * barWidth) / 2
      ctx.fillText(String(item[indexBy] || index), x, height - 10)
    })

    // Draw legend
    if (keys.length > 1) {
      const legendY = 15
      let legendX = padding

      keys.forEach((key, index) => {
        const color = colors[index % colors.length]

        // Draw color box
        ctx.fillStyle = color
        ctx.fillRect(legendX, legendY - 8, 10, 10)

        // Draw label
        ctx.fillStyle = "rgba(255, 255, 255, 0.7)"
        ctx.font = "10px sans-serif"
        ctx.textAlign = "left"
        ctx.fillText(key, legendX + 15, legendY)

        legendX += ctx.measureText(key).width + 30
      })
    }
  }

  return (
    <div className="w-full h-full relative">
      <canvas ref={canvasRef} width={500} height={300} className="w-full h-full" />
    </div>
  )
}
