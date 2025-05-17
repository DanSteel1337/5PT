/**
 * @file tooltip.tsx
 * @description Custom tooltip component with animation effects
 *
 * This file implements a custom tooltip component with animation effects
 * using Framer Motion. It provides a simple way to add tooltips to any element
 * with customizable positioning and delay.
 *
 * @dependencies
 * - react: For component structure and hooks
 * - framer-motion: For animation effects
 *
 * @related
 * - components/ui/button.tsx: Can be used with this component
 * - components/landing/features.tsx: Uses this component
 */

"use client"

import { type ReactNode, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

/**
 * Props for the Tooltip component
 */
interface TooltipProps {
  /** The element that triggers the tooltip */
  children: ReactNode
  /** The content to display in the tooltip */
  content: ReactNode
  /** The position of the tooltip relative to the trigger element */
  position?: "top" | "bottom" | "left" | "right"
  /** Delay in milliseconds before showing the tooltip */
  delay?: number
}

/**
 * Tooltip Component
 *
 * A customizable tooltip component with animation effects.
 * Supports different positions and configurable delay.
 *
 * @example
 * ```tsx
 * <Tooltip content="This is a tooltip" position="top">
 *   <Button>Hover me</Button>
 * </Tooltip>
 * ```
 */
export function Tooltip({ children, content, position = "top", delay = 300 }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

  /**
   * Shows the tooltip after the specified delay
   */
  const showTooltip = () => {
    const id = setTimeout(() => {
      setIsVisible(true)
    }, delay)
    setTimeoutId(id)
  }

  /**
   * Hides the tooltip and clears any pending timeout
   */
  const hideTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      setTimeoutId(null)
    }
    setIsVisible(false)
  }

  /**
   * Gets the position styles based on the specified position
   */
  const getPositionStyles = () => {
    switch (position) {
      case "top":
        return { bottom: "100%", left: "50%", transform: "translateX(-50%)", marginBottom: "8px" }
      case "bottom":
        return { top: "100%", left: "50%", transform: "translateX(-50%)", marginTop: "8px" }
      case "left":
        return { right: "100%", top: "50%", transform: "translateY(-50%)", marginRight: "8px" }
      case "right":
        return { left: "100%", top: "50%", transform: "translateY(-50%)", marginLeft: "8px" }
      default:
        return { bottom: "100%", left: "50%", transform: "translateX(-50%)", marginBottom: "8px" }
    }
  }

  return (
    <div className="relative inline-flex" onMouseEnter={showTooltip} onMouseLeave={hideTooltip}>
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 max-w-xs bg-black/90 text-white text-xs rounded-md px-3 py-2 pointer-events-none"
            style={getPositionStyles()}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/**
 * TooltipProvider Component
 *
 * A dummy provider for compatibility with shadcn/ui usage patterns.
 * This allows the component to be used interchangeably with shadcn/ui tooltips.
 */
export function TooltipProvider({ children }: { children: ReactNode }) {
  return <>{children}</>
}

/**
 * TooltipTrigger Component
 *
 * A dummy trigger component for compatibility with shadcn/ui usage patterns.
 */
export const TooltipTrigger = ({ children }: { children: ReactNode }) => <>{children}</>

/**
 * TooltipContent Component
 *
 * A dummy content component for compatibility with shadcn/ui usage patterns.
 */
export const TooltipContent = ({ children }: { children: ReactNode }) => <>{children}</>

export default Tooltip
