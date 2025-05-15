import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export interface CardHeaderProps {
  title: string
  subtitle?: string
  icon?: ReactNode
  action?: ReactNode
  className?: string
}

/**
 * CardHeader component for consistent card headers
 */
export function CardHeader({ title, subtitle, icon, action, className }: CardHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between mb-6", className)}>
      <div className="flex items-center">
        {icon && <div className="mr-2">{icon}</div>}
        <div>
          <h3 className="text-xl font-bold text-gradient">{title}</h3>
          {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}
