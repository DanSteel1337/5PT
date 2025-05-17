/**
 * @file label.tsx
 * @description Form label component with accessibility features
 *
 * This file implements an accessible form label component based on
 * Radix UI's Label primitive. It provides proper accessibility attributes
 * and styling for form inputs.
 *
 * @dependencies
 * - react: For component structure
 * - @radix-ui/react-label: For accessible label functionality
 * - class-variance-authority: For variant management
 * - lib/utils.ts: For class name utilities
 *
 * @related
 * - components/ui/input.tsx: Often used with this component
 * - components/landing/investment-calculator.tsx: Uses this component
 */

"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Label variants configuration
 *
 * Defines the base styling for the label component with focus states
 * for proper keyboard navigation and accessibility.
 */
const labelVariants = cva("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70")

/**
 * Label Component Props
 */
interface LabelProps
  extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>,
    VariantProps<typeof labelVariants> {}

/**
 * Label Component
 *
 * An accessible form label component that can be associated with form inputs.
 * Provides proper styling and accessibility attributes.
 *
 * @example
 * ```tsx
 * // Basic usage with an input
 * <div className="grid gap-2">
 *   <Label htmlFor="email">Email</Label>
 *   <Input id="email" type="email" />
 * </div>
 *
 * // With required indicator
 * <Label htmlFor="password">
 *   Password <span className="text-red-500">*</span>
 * </Label>
 *
 * // With custom styling
 * <Label htmlFor="name" className="text-blue-500">
 *   Name
 * </Label>
 * ```
 */
const Label = React.forwardRef<React.ElementRef<typeof LabelPrimitive.Root>, LabelProps>(
  ({ className, ...props }, ref) => (
    <LabelPrimitive.Root ref={ref} className={cn(labelVariants(), className)} {...props} />
  ),
)
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
