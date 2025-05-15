"use client"

import { useEffect, useRef } from "react"

interface PieChartProps {
  data: any
  colors?: string[]
}

export function PieChart({ data, colors = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"] }: PieChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || !data) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Get canvas dimensions
    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(centerX, centerY) * 0.8

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Handle different data formats
    if (data.datasets && data.labels) {
      // Format 1: { labels: string[], datasets: [{ data: number[], backgroundColor?: string[] }] }
      drawPieChartFormat1(ctx, data, centerX, centerY, radius, colors)
    } else if (Array.isArray(data) && data.every((item) => item.name !== undefined && item.value !== undefined)) {
      // Format 2: [{ name: string, value: number }]
      drawPieChartFormat2(ctx, data, centerX, centerY, radius, colors)
    } else {
      console.error("Unsupported data format for PieChart")
    }
  }, [data, colors])

  const drawPieChartFormat1 = (
    ctx: CanvasRenderingContext2D,
    data: any,
    centerX: number,
    centerY: number,
    radius: number,
    defaultColors: string[],
  ) => {
    const { labels, datasets } = data
    if (!labels || !datasets || datasets.length === 0) return

    const values = datasets[0].data
    const backgroundColors = datasets[0].backgroundColor || defaultColors

    // Calculate total
    const total = values.reduce((sum: number, value: number) => sum + value, 0)

    // Draw pie segments
    let startAngle = -Math.PI / 2 // Start from top

    values.forEach((value: number, index: number) => {
      const sliceAngle = (value / total) * 2 * Math.PI
      const endAngle = startAngle + sliceAngle

      // Draw slice
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, endAngle)
      ctx.closePath()

      // Fill with gradient
      const color = backgroundColors[index % backgroundColors.length]
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius)
      gradient.addColorStop(0, `${color}80`) // 50% opacity
      gradient.addColorStop(1, color)

      ctx.fillStyle = gradient
      ctx.fill()

      // Add glow effect
      ctx.shadowColor = color
      ctx.shadowBlur = 10
      ctx.strokeStyle = "#000"
      ctx.lineWidth = 1
      ctx.stroke()
      ctx.shadowBlur = 0

      // Calculate label position
      const labelAngle = startAngle + sliceAngle / 2
      const labelRadius = radius * 0.7
      const labelX = centerX + Math.cos(labelAngle) * labelRadius
      const labelY = centerY + Math.sin(labelAngle) * labelRadius

      // Draw label
      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 12px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      // Only draw label if slice is big enough
      if (sliceAngle > 0.2) {
        ctx.fillText(labels[index], labelX, labelY)

        const percentText = `${Math.round((value / total) * 100)}%`
        ctx.font = "10px sans-serif"
        ctx.fillText(percentText, labelX, labelY + 15)
      }

      startAngle = endAngle
    })

    // Draw center circle (donut hole)
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius * 0.5, 0, 2 * Math.PI)
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
    ctx.fill()

    // Add total in center
    ctx.fillStyle = "#ffffff"
    ctx.font = "bold 14px sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText("Total", centerX, centerY - 10)
    ctx.font = "12px sans-serif"
    ctx.fillText(total.toString(), centerX, centerY + 10)
  }

  const drawPieChartFormat2 = (
    ctx: CanvasRenderingContext2D,
    data: any[],
    centerX: number,
    centerY: number,
    radius: number,
    colors: string[],
  ) => {
    // Calculate total
    const total = data.reduce((sum, item) => sum + item.value, 0)

    // Draw pie segments
    let startAngle = -Math.PI / 2 // Start from top

    data.forEach((item, index) => {
      const sliceAngle = (item.value / total) * 2 * Math.PI
      const endAngle = startAngle + sliceAngle

      // Draw slice
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, endAngle)
      ctx.closePath()

      // Fill with gradient
      const color = colors[index % colors.length]
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius)
      gradient.addColorStop(0, `${color}80`) // 50% opacity
      gradient.addColorStop(1, color)

      ctx.fillStyle = gradient
      ctx.fill()

      // Add glow effect
      ctx.shadowColor = color
      ctx.shadowBlur = 10
      ctx.strokeStyle = "#000"
      ctx.lineWidth = 1
      ctx.stroke()
      ctx.shadowBlur = 0

      // Calculate label position
      const labelAngle = startAngle + sliceAngle / 2
      const labelRadius = radius * 0.7
      const labelX = centerX + Math.cos(labelAngle) * labelRadius
      const labelY = centerY + Math.sin(labelAngle) * labelRadius

      // Draw label
      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 12px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      // Only draw label if slice is big enough
      if (sliceAngle > 0.2) {
        ctx.fillText(item.name, labelX, labelY)

        const percentText = `${Math.round((item.value / total) * 100)}%`
        ctx.font = "10px sans-serif"
        ctx.fillText(percentText, labelX, labelY + 15)
      }

      startAngle = endAngle
    })

    // Draw center circle (donut hole)
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius * 0.5, 0, 2 * Math.PI)
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
    ctx.fill()

    // Add total in center
    ctx.fillStyle = "#ffffff"
    ctx.font = "bold 14px sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText("Total", centerX, centerY - 10)
    ctx.font = "12px sans-serif"
    ctx.fillText(total.toString(), centerX, centerY + 10)
  }

  return (
    <div className="w-full h-full relative">
      <canvas ref={canvasRef} width={500} height={300} className="w-full h-full" />
    </div>
  )
}
