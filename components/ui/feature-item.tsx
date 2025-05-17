import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import type { JSX } from "react/jsx-runtime"

interface FeatureItemProps {
  icon: ReactNode
  children: ReactNode
  className?: string
  iconClassName?: string
}

/**
 * FeatureItem component for consistent feature list styling
 */
export function FeatureItem({ icon, children, className = "", iconClassName = "" }: FeatureItemProps): JSX.Element {
  return (
    <li className={cn("flex items-center gap-4 group", className)}>
      <div
        className={cn(
          "w-10 h-10 rounded-full bg-purple-900/50 border border-purple-500/30 flex items-center justify-center group-hover:bg-purple-800/60 transition-colors duration-300",
          iconClassName,
        )}
      >
        <div className="w-5 h-5 text-purple-300">{icon}</div>
      </div>
      <span className="text-lg">{children}</span>
    </li>
  )
}

export default FeatureItem
