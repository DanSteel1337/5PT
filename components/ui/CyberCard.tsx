/**
 * @file CyberCard.tsx
 * @description A futuristic card component with cyberpunk styling
 *
 * This component provides a styled card container with various variants,
 * featuring cyberpunk-inspired visual effects like glowing borders,
 * scanlines, and backdrop blur.
 *
 * @dependencies
 * - lib/utils.ts: Provides utility functions for class name merging
 *
 * @related
 * - components/ui/CyberButton.tsx: Uses similar styling approach
 * - components/landing/features.tsx: Uses this component
 */

import type React from "react"
import { cn } from "@/lib/utils"

/**
 * Props for the CyberCard component
 */
interface CyberCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Card style variant */
  variant?: "default" | "panel" | "stat"
  /** Whether to apply a glowing effect */
  glowing?: boolean
  /** Whether to apply a scanline animation effect */
  scanline?: boolean
  /** Card content */
  children: React.ReactNode
}

/**
 * CyberCard Component
 *
 * A futuristic card component with cyberpunk styling.
 * Features different variants, optional glowing effect, and scanline animation.
 *
 * @example
 * ```tsx
 * <CyberCard variant="panel" glowing scanline>
 *   <h2>Dashboard</h2>
 *   <p>Your investment stats</p>
 * </CyberCard>
 * ```
 */
export function CyberCard({
  variant = "default",
  glowing = false,
  scanline = false,
  className,
  children,
  ...props
}: CyberCardProps) {
  const baseStyles =
    "bg-[rgba(13,13,20,0.7)] backdrop-filter backdrop-blur-md border border-purple-500/30 relative overflow-hidden"

  const variantStyles = {
    default: "rounded-lg",
    panel: "clip-path-[polygon(0_0,100%_0,100%_85%,85%_100%,0_100%)]",
    stat: "border-l-2 border-l-purple-500",
  }

  return (
    <div className={cn(baseStyles, variantStyles[variant], glowing && "cyber-glow", className)} {...props}>
      {scanline && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/80 to-transparent absolute top-0 left-0 animate-[scan-line_3s_linear_infinite]"></div>
        </div>
      )}
      {children}
    </div>
  )
}

export default CyberCard
