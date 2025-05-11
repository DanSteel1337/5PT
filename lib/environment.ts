// Safe environment detection utilities

// Check if code is running in a browser environment
export const isBrowser = typeof window !== "undefined"

// Check if we're in a preview environment (Vercel preview, localhost)
export const isPreview =
  isBrowser &&
  (window.location.hostname.includes("vercel.app") ||
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1")

// Determine if we should use mock data
export const shouldUseMockData = () => isPreview

// Get the current environment
export const getEnvironment = () => {
  if (!isBrowser) return "server"
  if (isPreview) return "preview"
  return "production"
}

export const isPreviewEnvironment = () => isPreview
