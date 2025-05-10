"use client"
import type { ReactNode } from "react"
import { HolographicCard } from "@/components/ui/holographic-card"

interface GlassCardProps {
  children: ReactNode
  className?: string
  hoverEffect?: boolean
  goldAccent?: boolean
}

export function GlassCard({ children, className, hoverEffect = true, goldAccent = true }: GlassCardProps) {
  return (
    <HolographicCard
      className={className}
      holographicEffect={hoverEffect}
      glowColor={goldAccent ? "rgba(212, 175, 55, 0.5)" : "rgba(255, 255, 255, 0.3)"}
      borderColor={goldAccent ? "rgba(212, 175, 55, 0.3)" : "rgba(255, 255, 255, 0.1)"}
      intensity={5}
    >
      {children}
    </HolographicCard>
  )
}
