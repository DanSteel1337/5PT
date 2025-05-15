"use client"

import { useEffect, useRef } from "react"

interface LineChartProps {
  data: any
  xKey?: string
  yKey?: string
  color?: string
}

export function LineChart({ data, xKey = "x", yKey = "y", color = "#8b5cf6" }: LineChartProps) {
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
      drawLineChartFormat1(ctx, data, width, height, color)
    } else if (Array.isArray(data) && data.length > 0 && data[0][xKey] !== undefined) {
      // Format 2: [{ xKey: any, yKey: any }]
      drawLineChartFormat2(ctx, data, xKey, yKey, width, height, color)
    } else {
      console.error("Unsupported data format for LineChart")
    }
  }, [data, xKey, yKey, color])

  const drawLineChartFormat1 = (
    ctx: CanvasRenderingContext2D,
    data: any,
    width: number,
    height: number,
    defaultColor: string,
  ) => {
    const { labels, datasets } = data
    if (!datasets || datasets.length === 0) return

    const dataset = datasets[0]
    const values = dataset.data

    // Calculate scale
    const maxValue = Math.max(...values) * 1.1
    const xStep = width / (labels.length - 1)

    // Draw grid lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"
    ctx.lineWidth = 0.5

    for (let i = 0; i < 5; i++) {
      const y = height - height * (i / 4)
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }

    // Draw line
    ctx.strokeStyle = dataset.color || defaultColor
    ctx.lineWidth = 2
    ctx.beginPath()

    values.forEach((value: number, index: number) => {
      const x = index * xStep
      const y = height - (value / maxValue) * height

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.stroke()

    // Draw area
    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, `${dataset.color || defaultColor}40`) // 25% opacity
    gradient.addColorStop(1, `${dataset.color || defaultColor}00`) // 0% opacity

    ctx.fillStyle = gradient
    ctx.beginPath()

    values.forEach((value: number, index: number) => {
      const x = index * xStep
      const y = height - (value / maxValue) * height

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.lineTo(width, height)
    ctx.lineTo(0, height)
    ctx.closePath()
    ctx.fill()

    // Draw points
    ctx.fillStyle = dataset.color || defaultColor
    values.forEach((value: number, index: number) => {
      const x = index * xStep
      const y = height - (value / maxValue) * height

      ctx.beginPath()
      ctx.arc(x, y, 3, 0, Math.PI * 2)
      ctx.fill()
    })

    // Draw labels
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)"
    ctx.font = "10px sans-serif"
    ctx.textAlign = "center"

    labels.forEach((label: string, index: number) => {
      const x = index * xStep
      ctx.fillText(label, x, height - 10)
    })
  }

  const drawLineChartFormat2 = (
    ctx: CanvasRenderingContext2D,
    data: any[],
    xKey: string,
    yKey: string,
    width: number,
    height: number,
    color: string,
  ) => {
    // Find min and max values
    const xValues = data.map((d) => d[xKey])
    const yValues = data.map((d) => d[yKey])
    const minX = Math.min(...xValues)
    const maxX = Math.max(...xValues)
    const minY = Math.min(...yValues)
    const maxY = Math.max(...yValues)

    // Calculate scale factors
    const xScale = width / (maxX - minX || 1)
    const yScale = height / (maxY - minY || 1)

    // Draw grid lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"
    ctx.lineWidth = 0.5

    for (let i = 0; i < 5; i++) {
      const y = height - height * (i / 4)
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }

    // Draw line
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.beginPath()

    data.forEach((point, index) => {
      const x = ((point[xKey] - minX) / (maxX - minX || 1)) * width
      const y = height - ((point[yKey] - minY) / (maxY - minY || 1)) * height

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.stroke()

    // Draw area
    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, `${color}40`) // 25% opacity
    gradient.addColorStop(1, `${color}00`) // 0% opacity

    ctx.fillStyle = gradient
    ctx.beginPath()

    data.forEach((point, index) => {
      const x = ((point[xKey] - minX) / (maxX - minX || 1)) * width
      const y = height - ((point[yKey] - minY) / (maxY - minY || 1)) * height

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.lineTo(width, height)
    ctx.lineTo(0, height)
    ctx.closePath()
    ctx.fill()

    // Draw points
    ctx.fillStyle = color
    data.forEach((point) => {
      const x = ((point[xKey] - minX) / (maxX - minX || 1)) * width
      const y = height - ((point[yKey] - minY) / (maxY - minY || 1)) * height

      ctx.beginPath()
      ctx.arc(x, y, 3, 0, Math.PI * 2)
      ctx.fill()
    })
  }

  return (
    <div className="w-full h-full relative">
      <canvas ref={canvasRef} width={500} height={300} className="w-full h-full" />
    </div>
  )
}
