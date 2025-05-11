/**
 * Utility functions for environment detection
 */

// Check if we're in a preview environment (v0, Vercel preview, etc.)
export function isPreviewEnvironment(): boolean {
  if (typeof window === "undefined") return false

  const hostname = window.location.hostname
  return (
    hostname.includes("preview") ||
    hostname.includes("vusercontent") ||
    hostname.includes("localhost") ||
    hostname.includes("127.0.0.1")
  )
}

// Check if we're in a development environment
export function isDevelopmentEnvironment(): boolean {
  return process.env.NODE_ENV === "development"
}

// Check if we're in a production environment
export function isProductionEnvironment(): boolean {
  return process.env.NODE_ENV === "production" && !isPreviewEnvironment()
}

// Hook to check if we're in a preview environment
export function useIsPreviewEnvironment(): boolean {
  if (typeof window === "undefined") return false

  const hostname = window.location.hostname
  return (
    hostname.includes("preview") ||
    hostname.includes("vusercontent") ||
    hostname.includes("localhost") ||
    hostname.includes("127.0.0.1")
  )
}
