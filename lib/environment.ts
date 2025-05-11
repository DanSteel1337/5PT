"use client"

import { useState, useEffect } from "react"

/**
 * Checks if the current environment is a preview environment
 * @returns boolean indicating if the current environment is a preview environment
 */
export function isPreviewEnvironment(): boolean {
  if (typeof window === "undefined") {
    return false
  }

  const hostname = window.location.hostname
  return (
    hostname.includes("vercel.app") ||
    hostname.includes("localhost") ||
    hostname.includes("127.0.0.1") ||
    hostname.includes("vusercontent.net") ||
    hostname.endsWith(".vercel.app")
  )
}

/**
 * React hook to check if the current environment is a preview environment
 * @returns boolean indicating if the current environment is a preview environment
 */
export function useIsPreviewEnvironment(): boolean {
  const [isPreview, setIsPreview] = useState(false)

  useEffect(() => {
    setIsPreview(isPreviewEnvironment())
  }, [])

  return isPreview
}
