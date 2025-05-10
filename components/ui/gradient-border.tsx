"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface GradientBorderProps {
  children: ReactNode
  className?: string
  borderClassName?: string
  gradientFrom?: string
  gradientTo?: string
  borderWidth?: number
  borderRadius?: number
  isAnimated?: boolean
}

export function GradientBorder({
  children,
  className,
  borderClassName,
  gradientFrom = "from-gold-light",
  gradientTo = "to-gold-dark",
  borderWidth = 1,
  borderRadius = 12,
  isAnimated = true,
}: GradientBorderProps) {
  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "absolute inset-0 rounded-[calc(var(--radius)+1px)] bg-gradient-to-r",
          gradientFrom,
          gradientTo,
          isAnimated && "animate-pulse-gold",
          borderClassName,
        )}
        style={{ borderRadius }}
      />
      <div
        className="relative bg-background rounded-[var(--radius)] h-full"
        style={
          {
            "--radius": `${borderRadius}px`,
            padding: `${borderWidth}px`,
          } as React.CSSProperties
        }
      >
        {children}
      </div>
    </div>
  )
}
