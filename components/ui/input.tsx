/**
 * @file input.tsx
 * @description Input component for form controls
 *
 * This file implements a reusable input component with proper styling and
 * accessibility features. It extends the native HTML input element with
 * consistent styling and additional functionality.
 *
 * @dependencies
 * - react: For component structure
 * - lib/utils.ts: For class name utilities
 *
 * @related
 * - components/ui/label.tsx: Often used with this component
 * - components/ui/form.tsx: Often used within form components
 */

import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Input Component Props
 *
 * Extends the native HTML input element props.
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

/**
 * Input Component
 *
 * A styled input component that extends the native HTML input element.
 * Provides consistent styling and accessibility features.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Input type="text" placeholder="Enter your name" />
 *
 * // With label
 * <div className="grid gap-2">
 *   <Label htmlFor="email">Email</Label>
 *   <Input id="email" type="email" placeholder="Enter your email" />
 * </div>
 *
 * // Disabled state
 * <Input disabled type="text" placeholder="Disabled input" />
 *
 * // With custom styling
 * <Input className="border-purple-500" type="text" placeholder="Custom styled input" />
 * ```
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }
