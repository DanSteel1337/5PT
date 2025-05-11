"\"use client"

import { useState, useEffect } from "react"

export function useIsPreviewEnvironment(): boolean {
  const [isPreview, setIsPreview] = useState(false)

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window !== "undefined") {
      // Check for v0 preview domains
      const isV0Preview = window.location.hostname.includes("lite.vusercontent.net")
      // Check for other preview domains
      const isVercelPreview = window.location.hostname.includes("vercel.app")

      setIsPreview(isV0Preview || isVercelPreview)
    }
  }, [])

  return isPreview
}

export function isPreviewEnvironment(): boolean {
  if (typeof window === "undefined") {
    return false
  }

  const isV0Preview = window.location.hostname.includes("lite.vusercontent.net")
  const isVercelPreview = window.location.hostname.includes("vercel.app")

  return isV0Preview || isVercelPreview
}
