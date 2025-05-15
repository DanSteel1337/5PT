import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export interface DataItemProps {
  label: string
  value: ReactNode
  icon?: ReactNode
  className?: string
}

export interface DataGridProps {
  items: DataItemProps[]
  columns?: 1 | 2 | 3 | 4
  className?: string
  itemClassName?: string
}

/**
 * DataItem component for displaying a single label/value pair
 */
export function DataItem({ label, value, icon, className }: DataItemProps) {
  return (
    <div className={cn("flex justify-between items-center", className)}>
      <div className="flex items-center gap-2">
        {icon && icon}
        <span className="text-gray-300">{label}</span>
      </div>
      <span className="font-medium">{value}</span>
    </div>
  )
}

/**
 * DataGrid component for displaying multiple label/value pairs in a grid
 */
export function DataGrid({ items, columns = 2, className, itemClassName }: DataGridProps) {
  return (
    <div className={cn("bg-black/30 rounded-lg p-4", className)}>
      <div
        className={cn(
          "grid gap-4",
          columns === 1 && "grid-cols-1",
          columns === 2 && "grid-cols-1 md:grid-cols-2",
          columns === 3 && "grid-cols-1 md:grid-cols-3",
          columns === 4 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
        )}
      >
        {items.map((item, index) => (
          <DataItem key={index} label={item.label} value={item.value} icon={item.icon} className={itemClassName} />
        ))}
      </div>
    </div>
  )
}
