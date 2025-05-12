/**
 * Environment detection utilities
 */

// Check if we're in a browser environment
export const isBrowser = typeof window !== "undefined"

// Check if we're in a preview environment (Vercel preview, localhost, etc.)
export const isPreviewEnvironment = (): boolean => {
  // Always use mock data during server-side rendering
  if (!isBrowser) return true

  // Check if we're in a preview environment (v0, Vercel preview, etc.)
  return (
    window.location.hostname.includes("vercel.app") ||
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname.includes("vusercontent.net")
  )
}

// Determine if we should use mock data
export const shouldUseMockData = (): boolean => {
  return isPreviewEnvironment()
}

// Check if we're in development mode
export const isDevelopment = (): boolean => {
  return process.env.NODE_ENV === "development"
}

// Check if we're in production mode
export const isProduction = (): boolean => {
  return process.env.NODE_ENV === "production" && !isPreviewEnvironment()
}

// Get the current environment name
export const getEnvironmentName = (): string => {
  if (isPreviewEnvironment()) return "preview"
  if (isDevelopment()) return "development"
  return "production"
}
