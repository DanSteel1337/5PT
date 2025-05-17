"use client"

import type React from "react"

import { cn } from "@/lib/utils"

interface GradientTextProps {
  children: React.ReactNode
  className?: string
}

export default function GradientText({ children, className }: GradientTextProps) {
  return (
    <span
      className={cn(
        "bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent",
        "relative inline-block",
        className,
      )}
    >
      {children}
      <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full"></span>
    </span>
  )
}
