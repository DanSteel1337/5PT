/**
 * Environment detection utilities
 */

/**
 * Detects if the current environment is a preview environment
 * This is used to determine if we should use the injected connector only
 */
export function isPreviewEnvironment(): boolean {
  if (typeof window === "undefined") return false
  return (
    window.location.hostname.includes("vercel.app") ||
    window.location.hostname.includes("localhost") ||
    window.location.hostname.includes("127.0.0.1")
  )
}

/**
 * Detects if the current environment is a production environment
 */
export function isProductionEnvironment(): boolean {
  return !isPreviewEnvironment()
}

/**
 * Detects if the code is running in the browser
 */
export function isBrowser(): boolean {
  return typeof window !== "undefined"
}
