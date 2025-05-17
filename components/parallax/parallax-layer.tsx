/**
 * @file ParallaxLayer Component
 * @description A component that creates a parallax scrolling effect for its children.
 * @module components/parallax/parallax-layer
 *
 * This component creates a parallax scrolling effect where elements move at different
 * speeds as the user scrolls, creating depth and visual interest. The movement
 * direction and speed are customizable through props.
 *
 * @requires react
 * @requires framer-motion
 */

"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

/**
 * ParallaxLayer Component Props
 * @interface ParallaxLayerProps
 * @property {React.ReactNode} children - Content to be displayed with the parallax effect
 * @property {number} [speed=0.5] - The speed of the parallax effect (higher = more movement)
 * @property {"up" | "down"} [direction="up"] - The direction of movement when scrolling down
 * @property {number} [offset=0] - Initial vertical offset in pixels
 * @property {string} [className] - Additional CSS classes to apply
 */
interface ParallaxLayerProps {
  children: React.ReactNode
  speed?: number
  direction?: "up" | "down"
  offset?: number
  className?: string
}

/**
 * ParallaxLayer Component
 *
 * Creates a layer that moves at a different speed than the scroll rate,
 * creating a parallax scrolling effect.
 *
 * @example
 * ```tsx
 * // Basic usage - moves up faster than scroll
 * <ParallaxLayer speed={0.7} className="w-full">
 *   <div className="bg-blue-500/20 p-8 rounded-lg">
 *     I move faster than the scroll!
 *   </div>
 * </ParallaxLayer>
 *
 * // Moving down instead of up
 * <ParallaxLayer
 *   direction="down"
 *   speed={0.3}
 *   className="absolute right-0 top-1/4 w-1/3"
 * >
 *   <Image
 *     src="/decorations/circles.svg"
 *     alt=""
 *     width={200}
 *     height={200}
 *   />
 * </ParallaxLayer>
 *
 * // With initial offset
 * <ParallaxLayer
 *   offset={-50}
 *   speed={0.5}
 *   className="w-full"
 * >
 *   <h2 className="text-4xl font-bold">Parallax Title</h2>
 * </ParallaxLayer>
 * ```
 */
export function ParallaxLayer({
  children,
  speed = 0.5,
  direction = "up",
  offset = 0,
  className = "",
}: ParallaxLayerProps) {
  // Client-side mounting check for SSR compatibility
  const [mounted, setMounted] = useState(false)
  const [ref, setRef] = useState<HTMLDivElement | null>(null)

  // Track scroll progress for this element
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  // Calculate the y transform based on direction and speed
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    direction === "up" ? [offset + 100 * speed, offset + -100 * speed] : [offset + -100 * speed, offset + 100 * speed],
  )

  // Set mounted state after component mounts
  useEffect(() => {
    setMounted(true)
  }, [])

  // SSR-safe rendering
  if (!mounted) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div ref={setRef} className={className} style={{ y }}>
      {children}
    </motion.div>
  )
}

export default ParallaxLayer
