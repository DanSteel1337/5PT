"use client"

import { useState, useEffect } from "react"

/**
 * Custom hook to handle client-side mounting
 * Prevents hydration errors by ensuring components only render on client
 *
 * @returns {boolean} Whether the component is mounted on the client
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState<boolean>(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return mounted
}

export default useMounted
