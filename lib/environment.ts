/**
 * Environment utilities for the application
 */

// Check if we're in a browser environment
const isBrowser = typeof window !== "undefined"

// Safe way to check NODE_ENV on client and server
export function getNodeEnv(): "development" | "production" | "test" {
  // In the browser, we can't directly access process.env.NODE_ENV
  if (isBrowser) {
    // Next.js replaces process.env.NODE_ENV with the actual value at build time
    // so this is safe, but we need to handle it carefully
    if (process.env.NODE_ENV === "development") return "development"
    if (process.env.NODE_ENV === "test") return "test"
    return "production"
  }

  // On the server, we can access process.env directly
  return (process.env.NODE_ENV as "development" | "production" | "test") || "production"
}

// Check if we're in development mode
export function isDevelopment(): boolean {
  return getNodeEnv() === "development"
}

// Check if we're in production mode
export function isProduction(): boolean {
  return getNodeEnv() === "production"
}

// Check if we're in test mode
export function isTest(): boolean {
  return getNodeEnv() === "test"
}

// Check if we're in a preview environment
export function isPreviewEnvironment(): boolean {
  // Check if we're in the browser
  if (isBrowser) {
    const hostname = window.location.hostname
    // Check if the hostname indicates a preview environment
    return hostname.includes("vercel.app") || hostname.includes("localhost") || hostname.includes("vusercontent.net")
  }

  // On the server, we can check other environment variables
  return process.env.VERCEL_ENV === "preview" || getNodeEnv() !== "production"
}

// Determine if we should use mock data
export function shouldUseMockData(): boolean {
  // First check for explicit environment variable
  if (typeof process.env.NEXT_PUBLIC_USE_MOCK_DATA !== "undefined") {
    return process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true"
  }

  // Check localStorage if we're in the browser
  if (isBrowser) {
    try {
      const localStorageValue = localStorage.getItem("useMockData")
      if (localStorageValue === "true") {
        return true
      }
    } catch (e) {
      // Ignore localStorage errors
    }
  }

  // Otherwise, use mock data in preview environments and development
  return isPreviewEnvironment() || isDevelopment()
}

// Set whether to use mock data (client-side only)
export function setUseMockData(useMock: boolean): void {
  if (isBrowser) {
    try {
      localStorage.setItem("useMockData", useMock.toString())
    } catch (e) {
      // Ignore localStorage errors
    }
  }
}

// Get site URL
export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL
  }

  if (isBrowser) {
    return window.location.origin
  }

  return "https://5pt.finance"
}

// Get site metadata
export function getSiteMetadata() {
  return {
    name: process.env.NEXT_PUBLIC_SITE_NAME || "5PT Investment Platform",
    description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || "Five Pillars Token Investment Platform",
    url: getSiteUrl(),
    logoUrl: `${getSiteUrl()}/images/5pt-logo.png`,
  }
}

// Get debug level
export function getDebugLevel(): number {
  if (process.env.NEXT_PUBLIC_DEBUG_LEVEL) {
    const level = Number.parseInt(process.env.NEXT_PUBLIC_DEBUG_LEVEL)
    if (!isNaN(level)) {
      return level
    }
  }

  // Default to level 1 (ERROR) in production, 3 (INFO) in development
  return isProduction() ? 1 : 3
}

// Get environment name
export function getEnvironmentName(): string {
  if (isDevelopment()) {
    return "development"
  }
  if (isPreviewEnvironment()) {
    return "preview"
  }
  if (isProduction()) {
    return "production"
  }
  return "unknown"
}
