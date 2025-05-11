/**
 * Utility for safely using html2canvas in any environment
 * This handles the blob URL module export issues in v0 preview
 */

// Type definition for html2canvas function
export type Html2CanvasFunction = (element: HTMLElement, options?: any) => Promise<HTMLCanvasElement>

/**
 * Loads html2canvas via script tag to avoid module export issues
 */
export function loadHtml2Canvas(): Promise<Html2CanvasFunction> {
  return new Promise((resolve, reject) => {
    // Check if html2canvas is already loaded in window
    if (typeof window !== "undefined" && (window as any).html2canvas) {
      return resolve((window as any).html2canvas)
    }

    // Check if we're in a browser environment
    if (typeof document === "undefined") {
      return reject(new Error("Cannot load html2canvas outside browser environment"))
    }

    // Create script element
    const script = document.createElement("script")
    script.src = "https://html2canvas.hertzen.com/dist/html2canvas.min.js"
    script.async = true

    // Set up load handler
    script.onload = () => {
      if ((window as any).html2canvas) {
        resolve((window as any).html2canvas)
      } else {
        reject(new Error("html2canvas loaded but not available on window"))
      }
    }

    // Set up error handler
    script.onerror = () => {
      reject(new Error("Failed to load html2canvas script"))
    }

    // Add to document
    document.head.appendChild(script)
  })
}

/**
 * Safely captures a screenshot of an element
 * Provides proper error handling and fallback behavior
 */
export async function captureScreenshot(
  elementId: string,
  onSuccess: (dataUrl: string) => void,
  onError: (error: Error) => void,
): Promise<void> {
  try {
    // Check if we're in a browser environment
    if (typeof window === "undefined" || typeof document === "undefined") {
      throw new Error("Cannot capture screenshot outside browser environment")
    }

    // Get the element to capture
    const element = document.getElementById(elementId)
    if (!element) {
      throw new Error(`Element with ID "${elementId}" not found`)
    }

    // Load html2canvas
    const html2canvas = await loadHtml2Canvas()

    // Capture the element
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: "#0f0f19",
      logging: false,
      useCORS: true,
    })

    // Convert to data URL
    const dataUrl = canvas.toDataURL("image/png")
    onSuccess(dataUrl)
  } catch (error) {
    console.error("Screenshot capture error:", error)
    onError(error instanceof Error ? error : new Error("Unknown error during screenshot capture"))
  }
}

/**
 * Checks if screenshot functionality is supported in current environment
 */
export function isScreenshotSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof document !== "undefined" &&
    typeof HTMLCanvasElement !== "undefined" &&
    typeof document.createElement === "function"
  )
}

/**
 * Downloads a data URL as a file
 */
export function downloadDataUrl(dataUrl: string, filename: string): void {
  const link = document.createElement("a")
  link.href = dataUrl
  link.download = filename
  link.click()
}
