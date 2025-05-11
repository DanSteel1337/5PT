/**
 * Checks if the code is running in a browser environment
 */
export function isBrowser(): boolean {
  return typeof window !== "undefined"
}

/**
 * Checks if the current environment is a preview environment (Vercel preview or localhost)
 */
export function isPreviewEnvironment(): boolean {
  if (!isBrowser()) return false

  const hostname = window.location.hostname
  return hostname.includes("vercel.app") || hostname === "localhost" || hostname === "127.0.0.1"
}

/**
 * Determines if mock data should be used instead of real API calls
 */
export function shouldUseMockData(): boolean {
  return isPreviewEnvironment()
}

/**
 * Safely executes browser-only code
 */
export function safelyExecuteInBrowser(callback: () => void): void {
  if (isBrowser()) {
    try {
      callback()
    } catch (error) {
      console.error("Error executing browser-only code:", error)
    }
  }
}
