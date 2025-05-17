/**
 * @file FloatingObject Component
 * @description A component that creates a smooth floating animation effect.
 * @module components/parallax/floating-object
 *
 * This component applies a continuous up-and-down floating animation to its children,
 * creating a weightless, hovering effect that adds visual interest to UI elements.
 * The animation parameters are customizable through props.
 *
 * @requires react
 * @requires framer-motion
 */

"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"

/**
 * FloatingObject Component Props
 * @interface FloatingObjectProps
 * @property {React.ReactNode} children - Content to be displayed with the floating effect
 * @property {number} [amplitude=10] - The vertical distance of the floating movement in pixels
 * @property {number} [duration=4] - The duration of one complete float cycle in seconds
 * @property {number} [delay=0] - Delay before the animation starts in seconds
 * @property {string} [className] - Additional CSS classes to apply
 */
interface FloatingObjectProps {
  children: React.ReactNode
  amplitude?: number
  duration?: number
  delay?: number
  className?: string
}

/**
 * FloatingObject Component
 *
 * Creates a smooth floating animation effect for any content.
 * The object will continuously move up and down with customizable parameters.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <FloatingObject>
 *   <div className="bg-blue-500 p-4 rounded-lg text-white">
 *     I'm floating!
 *   </div>
 * </FloatingObject>
 *
 * // Custom animation parameters
 * <FloatingObject
 *   amplitude={20}
 *   duration={6}
 *   delay={0.5}
 *   className="z-10"
 * >
 *   <Image
 *     src="/icons/ethereum.svg"
 *     alt="Ethereum"
 *     width={64}
 *     height={64}
 *   />
 * </FloatingObject>
 *
 * // Creating staggered floating elements
 * <div className="flex gap-4">
 *   <FloatingObject delay={0}>
 *     <div className="bg-purple-500 p-4">Item 1</div>
 *   </FloatingObject>
 *   <FloatingObject delay={1}>
 *     <div className="bg-pink-500 p-4">Item 2</div>
 *   </FloatingObject>
 *   <FloatingObject delay={2}>
 *     <div className="bg-blue-500 p-4">Item 3</div>
 *   </FloatingObject>
 * </div>
 * ```
 */
export function FloatingObject({
  children,
  amplitude = 10,
  duration = 4,
  delay = 0,
  className = "",
}: FloatingObjectProps) {
  // Client-side mounting check for SSR compatibility
  const [mounted, setMounted] = useState(false)

  // Set mounted state after component mounts
  useEffect(() => {
    setMounted(true)
  }, [])

  // SSR-safe rendering
  if (!mounted) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -amplitude, 0],
      }}
      transition={{
        duration,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
        ease: "easeInOut",
        delay,
      }}
    >
      {children}
    </motion.div>
  )
}

export default FloatingObject
