/**
 * Checks if the code is running in a browser environment
 */
export const isBrowser = () => {
  return typeof window !== "undefined"
}

/**
 * Checks if the current environment is a preview environment
 * (vercel.app, localhost, etc.)
 */
export const isPreviewEnvironment = () => {
  if (!isBrowser()) return false

  return (
    window.location.hostname.includes("vercel.app") ||
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  )
}

/**
 * Determines if mock data should be used instead of real data
 */
export const shouldUseMockData = () => {
  return isPreviewEnvironment()
}
