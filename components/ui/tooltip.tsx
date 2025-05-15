"use client"

import { type ReactNode, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface TooltipProps {
  children: ReactNode
  content: ReactNode
  position?: "top" | "bottom" | "left" | "right"
  delay?: number
}

export function Tooltip({ children, content, position = "top", delay = 300 }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

  const showTooltip = () => {
    const id = setTimeout(() => {
      setIsVisible(true)
    }, delay)
    setTimeoutId(id)
  }

  const hideTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      setTimeoutId(null)
    }
    setIsVisible(false)
  }

  // Position styles
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

// Add a dummy TooltipProvider for compatibility with shadcn/ui usage patterns
export function TooltipProvider({ children }: { children: ReactNode }) {
  return <>{children}</>
}

// Add other tooltip-related exports for compatibility
export const TooltipTrigger = ({ children }: { children: ReactNode }) => <>{children}</>
export const TooltipContent = ({ children }: { children: ReactNode }) => <>{children}</>
