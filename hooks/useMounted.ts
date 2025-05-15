"use client"

import { useState, useEffect } from "react"

/**
 * Custom hook to check if component is mounted on client-side
 * Prevents hydration errors with client-side only code
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return mounted
}
