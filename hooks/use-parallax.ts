"use client"

import { useState, useEffect } from "react"
import { useScroll } from "framer-motion"

export function useParallax() {
  const [mounted, setMounted] = useState(false)
  const { scrollY } = useScroll()

  useEffect(() => {
    setMounted(true)
  }, [])

  return { scrollY, mounted }
}
