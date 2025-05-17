/**
 * @file useParallax Hook
 * @description A custom hook for tracking and smoothing scroll position.
 * @module hooks/use-parallax
 *
 * This hook provides access to the current scroll position with both raw and
 * smoothed values. The smoothed scroll value uses spring physics for a more
 * natural, fluid motion that can be used in animations.
 *
 * @requires react
 * @requires framer-motion
 */

"use client"

import { useState, useEffect, type RefObject } from "react"
import { useMotionValue, useSpring } from "framer-motion"

/**
 * useParallax Hook
 *
 * Provides access to the current scroll position with both raw and smoothed values.
 * The smoothed scroll uses spring physics for more natural, fluid motion.
 *
 * @returns {Object} An object containing scroll position values
 * @returns {MotionValue} scrollY - Smoothed scroll Y position with spring physics
 * @returns {MotionValue} rawScrollY - Raw scroll Y position without smoothing
 *
 * @example
 * \`\`\`tsx
 * // Basic usage
 * const { scrollY, rawScrollY } = useParallax();
 *
 * // Using with useTransform to create scroll-based animations
 * const { scrollY } = useParallax();
 * const opacity = useTransform(scrollY, [0, 200], [0, 1]);
 * const scale = useTransform(scrollY, [0, 500], [0.8, 1]);
 *
 * return (
 *   <motion.div style={{ opacity, scale }}>
 *     This element fades in and scales up as you scroll
 *   </motion.div>
 * );
 *
 * // Creating a parallax background
 * const { scrollY } = useParallax();
 * const backgroundY = useTransform(scrollY, [0, 1000], [0, -300]);
 *
 * return (
 *   <motion.div
 *     className="fixed inset-0 z-[-1]"
 *     style={{
 *       backgroundImage: "url(/images/stars.jpg)",
 *       backgroundSize: "cover",
 *       y: backgroundY
 *     }}
 *   />
 * );
 *
 * // Parallax effect on a specific element
 * const parallaxRef = useRef(null);
 * const { x, y } = useParallax(parallaxRef);
 *
 * return (
 *   <motion.div ref={parallaxRef} style={{ x, y }}>
 *     This element moves based on mouse position
 *   </motion.div>
 * );
 * \`\`\`
 */
export function useParallax(ref: RefObject<HTMLElement>) {
  // Client-side mounting check for SSR compatibility
  const [mounted, setMounted] = useState(false)

  // Create motion values for tracking scroll position
  const scrollY = useMotionValue(0)
  const smoothScrollY = useSpring(scrollY, { damping: 50, stiffness: 400 })
  const rawScrollY = useMotionValue(0)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  // Set up scroll event listener
  useEffect(() => {
    setMounted(true)

    // Update motion values when scroll position changes
    const updateScrollY = () => {
      scrollY.set(window.scrollY)
      rawScrollY.set(window.scrollY)
    }

    // Add scroll event listener with passive option for performance
    window.addEventListener("scroll", updateScrollY, { passive: true })

    // Initialize values
    updateScrollY()

    // Clean up event listener on unmount
    return () => {
      window.removeEventListener("scroll", updateScrollY)
    }
  }, [scrollY, rawScrollY])

  useEffect(() => {
    if (!ref.current) return

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const { width, height } = ref.current?.getBoundingClientRect() || { width: 0, height: 0 }

      // Calculate position relative to the center of the element
      const x = (clientX - width / 2) / 25
      const y = (clientY - height / 2) / 25

      setPosition({ x, y })
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [ref])

  return {
    scrollY: smoothScrollY,
    rawScrollY: rawScrollY,
    x: position.x,
    y: position.y,
  }
}

export default useParallax
