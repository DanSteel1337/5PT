"use client"

import { useState, useEffect } from "react"

/**
 * Hook to safely handle component mounting state
 * Prevents hydration mismatches and ensures components only render on client
 *
 * @returns {boolean} Whether the component is mounted
 */
export function useMounted() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return mounted
}

export default useMounted
