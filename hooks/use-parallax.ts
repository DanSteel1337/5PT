"use client"

import { useState, useEffect } from "react"
import { useMotionValue, useSpring } from "framer-motion"

export function useParallax() {
  const [mounted, setMounted] = useState(false)
  const scrollY = useMotionValue(0)
  const smoothScrollY = useSpring(scrollY, { damping: 50, stiffness: 400 })
  const rawScrollY = useMotionValue(0)

  useEffect(() => {
    setMounted(true)

    const updateScrollY = () => {
      scrollY.set(window.scrollY)
      rawScrollY.set(window.scrollY)
    }

    window.addEventListener("scroll", updateScrollY, { passive: true })
    updateScrollY()

    return () => {
      window.removeEventListener("scroll", updateScrollY)
    }
  }, [scrollY, rawScrollY])

  return {
    scrollY: smoothScrollY,
    rawScrollY: rawScrollY,
  }
}

export default useParallax
