import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface InfoCardProps {
  icon?: ReactNode
  title: string
  children: ReactNode
  className?: string
  variant?: "default" | "highlight" | "muted"
}

/**
 * InfoCard component for displaying information with an icon and title
 * Used throughout the landing page for consistent card styling
 */
export function InfoCard({ icon, title, children, className = "", variant = "default" }: InfoCardProps): JSX.Element {
  const variantClasses = {
    default: "bg-black/30 border border-purple-500/30",
    highlight: "bg-black/40 border border-purple-500/50",
    muted: "bg-black/20 border border-purple-500/20",
  }

  return (
    <div className={cn("rounded-lg p-4", variantClasses[variant], className)}>
      {(icon || title) && (
        <div className="flex items-center mb-2">
          {icon && <div className="text-purple-400 mr-2">{icon}</div>}
          {title && <h4 className="font-semibold">{title}</h4>}
        </div>
      )}
      <div className="text-sm text-gray-300">{children}</div>
    </div>
  )
}

export default InfoCard
