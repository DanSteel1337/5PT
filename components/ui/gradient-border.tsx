"use client"

import type React from "react"

import { cn } from "@/lib/utils"

interface GradientBorderProps {
  children: React.ReactNode
  className?: string
  containerClassName?: string
  borderClassName?: string
  borderWidth?: number
  animate?: boolean
}

export function GradientBorder({
  children,
  className,
  containerClassName,
  borderClassName,
  borderWidth = 1,
  animate = false,
}: GradientBorderProps) {
  return (
    <div className={cn("relative rounded-xl", containerClassName)}>
      <div
        className={cn(
          "absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500/50 via-blue-500/50 to-indigo-500/50",
          animate && "animate-rotate-slow",
          borderClassName,
        )}
      />
      <div
        className={cn("relative rounded-xl bg-black/80 backdrop-blur-sm", className)}
        style={{ margin: borderWidth }}
      >
        {children}
      </div>
    </div>
  )
}
