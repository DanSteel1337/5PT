/**
 * @file switch.tsx
 * @description Switch component for toggling between states
 *
 * This file implements a switch (toggle) component based on Radix UI's Switch primitive.
 * It provides an accessible toggle control with proper keyboard navigation,
 * focus management, and animation effects.
 *
 * @dependencies
 * - react: For component structure
 * - @radix-ui/react-switch: For accessible switch functionality
 * - lib/utils.ts: For class name utilities
 *
 * @related
 * - components/ui/checkbox.tsx: Similar component for binary selection
 * - components/landing/investment-calculator.tsx: Uses this component
 */

"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

/**
 * Switch Component
 *
 * An accessible toggle switch component for binary selection.
 * Provides proper styling, animation, and accessibility features.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Switch />
 *
 * // With label
 * <div className="flex items-center space-x-2">
 *   <Switch id="airplane-mode" />
 *   <Label htmlFor="airplane-mode">Airplane Mode</Label>
 * </div>
 *
 * // Controlled component
 * const [enabled, setEnabled] = useState(false)
 * <Switch checked={enabled} onCheckedChange={setEnabled} />
 *
 * // Disabled state
 * <Switch disabled />
 *
 * // With custom styling
 * <Switch className="data-[state=checked]:bg-purple-600" />
 * ```
 */
const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className,
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
