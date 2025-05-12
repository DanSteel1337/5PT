/**
 * Environment detection utilities
 */

// Check if we're in a browser environment
export const isBrowser = typeof window !== "undefined"

// Check if we're in a preview environment (Vercel preview, localhost, etc.)
export const isPreviewEnvironment = (): boolean => {
  // Always consider server-side rendering as preview environment
  if (!isBrowser) return true

  // Check if we're in a preview environment (v0, Vercel preview, etc.)
  return (
    window.location.hostname.includes("vercel.app") ||
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname.includes("vusercontent.net")
  )
}

// Get the current site URL (safely works in both browser and server)
export const getSiteUrl = (): string => {
  // First check environment variable
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL
  }

  // Then try to get from browser if available
  if (isBrowser) {
    return window.location.origin
  }

  // Fallback for server-side rendering
  return "https://www.solidchainsolutions.com"
}

// Get site name from environment variable or fallback
export const getSiteName = (): string => {
  return process.env.NEXT_PUBLIC_SITE_NAME || "5PT Investment Platform"
}

// Get site description from environment variable or fallback
export const getSiteDescription = (): string => {
  return process.env.NEXT_PUBLIC_SITE_DESCRIPTION || "Five Pillars Token Investment Platform"
}

// Get site metadata for WalletConnect
export const getSiteMetadata = () => {
  return {
    name: getSiteName(),
    description: getSiteDescription(),
    url: getSiteUrl(),
    icons: [`${getSiteUrl()}/images/5pt-logo.png`],
  }
}

// Determine if we should use mock data
export const shouldUseMockData = (): boolean => {
  // First check the environment variable
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true") {
    return true
  }

  // If explicitly set to false, respect that
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === "false") {
    return false
  }

  // Fall back to checking if we're in a preview environment
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
