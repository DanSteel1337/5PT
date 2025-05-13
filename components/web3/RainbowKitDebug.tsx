"use client"

import { useState, useEffect } from "react"
import { CyberButton } from "@/components/ui/cyber-button"

/**
 * RainbowKitDebug Component
 *
 * This component provides debugging information for RainbowKit integration,
 * particularly useful for troubleshooting the Vercel v0 preview workaround.
 *
 * Only shown in development mode.
 */
export function RainbowKitDebug() {
  const [isOpen, setIsOpen] = useState(false)
  const [debugInfo, setDebugInfo] = useState<{
    environment: string
    isVercelPreview: boolean
    rainbowKitStylesLoaded: boolean
    cssModulesSupported: boolean
    windowEthereumAvailable: boolean
  }>({
    environment: "unknown",
    isVercelPreview: false,
    rainbowKitStylesLoaded: false,
    cssModulesSupported: false,
    windowEthereumAvailable: false,
  })

  useEffect(() => {
    if (typeof window === "undefined") return

    // Detect environment
    const isVercelPreview =
      window.location.hostname.includes("vusercontent.net") || window.location.hostname.includes("v0.dev")

    // Check if RainbowKit styles are loaded
    const rainbowKitStylesLoaded =
      !!document.querySelector("[data-rk]") ||
      Array.from(document.styleSheets).some((sheet) => {
        try {
          return sheet.href?.includes("rainbowkit") || false
        } catch (e) {
          return false
        }
      })

    // Check if CSS modules are supported
    const cssModulesSupported = typeof CSSStyleSheet !== "undefined" && "replace" in CSSStyleSheet.prototype

    // Check if window.ethereum is available
    const windowEthereumAvailable = typeof window.ethereum !== "undefined"

    // Determine environment
    let environment = "production"
    if (process.env.NODE_ENV === "development") {
      environment = "development"
    } else if (isVercelPreview) {
      environment = "vercel-v0-preview"
    }

    setDebugInfo({
      environment,
      isVercelPreview,
      rainbowKitStylesLoaded,
      cssModulesSupported,
      windowEthereumAvailable,
    })
  }, [])

  // Only show in development mode
  if (process.env.NODE_ENV !== "development" && !debugInfo.isVercelPreview) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <CyberButton variant="outline" size="sm" onClick={() => setIsOpen(!isOpen)} className="text-xs">
        {isOpen ? "Hide" : "Show"} RainbowKit Debug
      </CyberButton>

      {isOpen && (
        <div className="mt-2 p-4 bg-black/90 border border-purple-500/50 rounded-md text-white text-xs w-80">
          <h3 className="font-bold mb-2">RainbowKit Debug Info</h3>
          <ul className="space-y-1">
            <li>
              Environment: <span className="text-purple-400">{debugInfo.environment}</span>
            </li>
            <li>
              Vercel v0 Preview:{" "}
              <span className={debugInfo.isVercelPreview ? "text-green-400" : "text-gray-400"}>
                {debugInfo.isVercelPreview ? "Yes" : "No"}
              </span>
            </li>
            <li>
              RainbowKit Styles:{" "}
              <span className={debugInfo.rainbowKitStylesLoaded ? "text-green-400" : "text-red-400"}>
                {debugInfo.rainbowKitStylesLoaded ? "Loaded" : "Not Loaded"}
              </span>
            </li>
            <li>
              CSS Modules Support:{" "}
              <span className={debugInfo.cssModulesSupported ? "text-green-400" : "text-yellow-400"}>
                {debugInfo.cssModulesSupported ? "Supported" : "Not Supported"}
              </span>
            </li>
            <li>
              window.ethereum:{" "}
              <span className={debugInfo.windowEthereumAvailable ? "text-green-400" : "text-yellow-400"}>
                {debugInfo.windowEthereumAvailable ? "Available" : "Not Available"}
              </span>
            </li>
          </ul>

          <div className="mt-4 pt-2 border-t border-purple-900/30">
            <p className="text-gray-400 mb-2">Workaround Status:</p>
            {debugInfo.isVercelPreview ? (
              <p className="text-green-400">Using inline styles for Vercel v0 preview</p>
            ) : (
              <p className="text-gray-400">Using dynamic import for RainbowKit styles</p>
            )}
          </div>

          <div className="mt-4 pt-2 border-t border-purple-900/30">
            <p className="text-gray-400 mb-2">Troubleshooting:</p>
            <ul className="list-disc pl-4 text-gray-400">
              <li>Clear browser cache</li>
              <li>Restart development server</li>
              <li>Check console for errors</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default RainbowKitDebug
