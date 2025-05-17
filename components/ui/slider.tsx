/**
 * @file slider.tsx
 * @description Slider component for selecting values from a range
 *
 * This file implements a slider component based on Radix UI's Slider primitive.
 * It provides a way to select values from a range with customizable styling
 * and accessibility features.
 *
 * @dependencies
 * - react: For component structure
 * - @radix-ui/react-slider: For slider functionality
 * - lib/utils.ts: For class name utilities
 *
 * @related
 * - components/landing/investment-calculator.tsx: Uses this component
 * - components/landing/onboarding-guide.tsx: Uses this component
 */

"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

/**
 * Slider Component
 *
 * A customizable slider component for selecting values from a range.
 * Built on top of Radix UI's Slider primitive with custom styling.
 *
 * Features:
 * - Customizable track and thumb appearance
 * - Support for multiple thumbs
 * - Accessible keyboard navigation
 * - Touch support
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Slider
 *   defaultValue={[50]}
 *   max={100}
 *   step={1}
 *   className="w-full"
 * />
 *
 * // With onChange handler
 * <Slider
 *   value={[value]}
 *   onValueChange={(values) => setValue(values[0])}
 *   min={0}
 *   max={100}
 *   step={1}
 * />
 *
 * // Multiple thumbs
 * <Slider
 *   defaultValue={[25, 75]}
 *   max={100}
 *   step={1}
 * />
 * ```
 */
const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn("relative flex w-full touch-none select-none items-center", className)}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-black/50 dark:bg-slate-800">
      <SliderPrimitive.Range className="absolute h-full bg-gradient-to-r from-purple-500 to-blue-500" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border border-purple-500/50 bg-background shadow-[0_0_10px_rgba(139,92,246,0.5)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
