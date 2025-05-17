/**
 * @file badge.tsx
 * @description Badge component for displaying status indicators or labels
 *
 * This file implements a badge component for displaying small status indicators,
 * labels, or counts. It provides different variants for different visual styles
 * and semantic meanings.
 *
 * @dependencies
 * - react: For component structure
 * - class-variance-authority: For variant management
 * - lib/utils.ts: For class name utilities
 *
 * @related
 * - components/landing/tokenomics.tsx: Uses this component
 * - components/landing/conversion-section.tsx: Uses this component
 */

import type * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Badge variants configuration
 *
 * Defines the different visual styles for the badge component:
 * - default: Standard badge style
 * - secondary: Less prominent style
 * - destructive: For error or warning states
 * - outline: Bordered style with transparent background
 */
const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

/**
 * Badge Component Props
 */
export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

/**
 * Badge Component
 *
 * A small visual indicator component for displaying status, labels, or counts.
 * Supports different variants for different visual styles and semantic meanings.
 *
 * @example
 * ```tsx
 * // Default badge
 * <Badge>New</Badge>
 *
 * // Secondary badge
 * <Badge variant="secondary">Feature</Badge>
 *
 * // Destructive badge
 * <Badge variant="destructive">Error</Badge>
 *
 * // Outline badge
 * <Badge variant="outline">Version 2.0</Badge>
 *
 * // With custom class
 * <Badge className="bg-blue-500">Custom</Badge>
 * ```
 */
function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
