import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import type { JSX } from "react/jsx-runtime"

interface GradientTextProps {
  children: ReactNode
  className?: string
  from?: string
  to?: string
  animate?: boolean
}

/**
 * GradientText component for consistent gradient text styling
 */
export function GradientText({
  children,
  className = "",
  from = "from-purple-400",
  to = "to-blue-400",
  animate = false,
}: GradientTextProps): JSX.Element {
  return (
    <span
      className={cn(
        "bg-gradient-to-r bg-clip-text text-transparent",
        from,
        to,
        animate && "animate-gradient",
        className,
      )}
    >
      {children}
    </span>
  )
}

export default GradientText
