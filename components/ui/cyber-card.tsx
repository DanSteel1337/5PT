import type React from "react"
import { cn } from "@/lib/utils"

interface CyberCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "panel" | "stat"
  glowing?: boolean
  scanline?: boolean
  children: React.ReactNode
}

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
