"use client"

import { useEffect, useState, type ReactNode } from "react"

/**
 * RainbowKitStylesProvider
 *
 * This component provides a workaround for RainbowKit CSS loading issues in the Vercel v0 preview environment.
 *
 * Problem: In the Vercel v0 preview environment, importing CSS files directly can cause MIME type errors:
 * "Failed to load module script: Expected a JavaScript module script but the server responded with a MIME type of 'text/css'"
 *
 * Solution: This component:
 * 1. Detects if we're running in the Vercel v0 preview environment
 * 2. If not in preview: Dynamically imports RainbowKit styles
 * 3. If in preview: Injects critical RainbowKit styles inline
 *
 * Usage:
 * Wrap your RainbowKitProvider with this component and remove the direct import
 * of "@rainbow-me/rainbowkit/styles.css" from your layout.tsx file.
 */
export function RainbowKitStylesProvider({ children }: { children: ReactNode }) {
  const [isVercelPreview, setIsVercelPreview] = useState(false)
  const [stylesLoaded, setStylesLoaded] = useState(false)

  useEffect(() => {
    // Check if we're in Vercel v0 preview environment
    // vusercontent.net is the domain used by Vercel v0 preview
    const isPreview =
      typeof window !== "undefined" &&
      (window.location.hostname.includes("vusercontent.net") || window.location.hostname.includes("v0.dev"))

    setIsVercelPreview(isPreview)

    if (!isPreview) {
      // Not in preview: Dynamically import RainbowKit styles
      import("@rainbow-me/rainbowkit/styles.css")
        .then(() => {
          console.log("RainbowKit styles loaded dynamically")
          setStylesLoaded(true)
        })
        .catch((err) => {
          console.error("Failed to load RainbowKit styles:", err)
          // Still set styles as loaded to prevent blocking the UI
          setStylesLoaded(true)
        })
    } else {
      // In preview: Apply critical RainbowKit styles inline
      console.log("Vercel v0 preview detected, applying inline RainbowKit styles")

      const style = document.createElement("style")
      style.textContent = `
        /* Critical RainbowKit styles for Vercel v0 preview environment */
        [data-rk] {
          --rk-blurs-modalOverlay: blur(4px);
          --rk-fonts-body: system-ui, sans-serif;
          --rk-radii-actionButton: 6px;
          --rk-radii-connectButton: 6px;
          --rk-radii-menuButton: 6px;
          --rk-radii-modal: 10px;
          --rk-radii-modalMobile: 10px;
          --rk-colors-accentColor: #8b5cf6;
          --rk-colors-accentColorForeground: white;
          --rk-colors-actionButtonBorder: rgba(139, 92, 246, 0.3);
          --rk-colors-actionButtonBorderMobile: rgba(139, 92, 246, 0.3);
          --rk-colors-actionButtonSecondaryBackground: rgba(139, 92, 246, 0.1);
          --rk-colors-closeButton: rgba(255, 255, 255, 0.8);
          --rk-colors-closeButtonBackground: rgba(139, 92, 246, 0.2);
          --rk-colors-connectButtonBackground: #0d0d14;
          --rk-colors-connectButtonBackgroundError: #ff494a;
          --rk-colors-connectButtonInnerBackground: linear-gradient(
            to right,
            rgba(139, 92, 246, 0.2),
            rgba(59, 130, 246, 0.2)
          );
          --rk-colors-connectButtonText: #fff;
          --rk-colors-connectButtonTextError: #fff;
          --rk-colors-connectionIndicator: #30e000;
          --rk-colors-error: #ff494a;
          --rk-colors-generalBorder: rgba(139, 92, 246, 0.3);
          --rk-colors-generalBorderDim: rgba(139, 92, 246, 0.2);
          --rk-colors-menuItemBackground: rgba(139, 92, 246, 0.1);
          --rk-colors-modalBackground: #0d0d14;
          --rk-colors-modalBorder: rgba(139, 92, 246, 0.3);
          --rk-colors-modalText: #fff;
          --rk-colors-modalTextDim: rgba(255, 255, 255, 0.3);
          --rk-colors-modalTextSecondary: rgba(255, 255, 255, 0.6);
          --rk-colors-profileAction: rgba(139, 92, 246, 0.1);
          --rk-colors-profileActionHover: rgba(139, 92, 246, 0.2);
          --rk-colors-profileForeground: rgba(139, 92, 246, 0.05);
          --rk-colors-selectedOptionBorder: rgba(139, 92, 246, 0.3);
          --rk-colors-standby: #ffd641;
          --rk-shadows-connectButton: 0px 4px 12px rgba(139, 92, 246, 0.4);
          --rk-shadows-dialog: 0px 8px 32px rgba(139, 92, 246, 0.4);
          --rk-shadows-profileDetailsAction: 0px 2px 6px rgba(37, 41, 46, 0.04);
          --rk-shadows-selectedOption: 0px 2px 6px rgba(139, 92, 246, 0.24);
          --rk-shadows-selectedWallet: 0px 2px 6px rgba(139, 92, 246, 0.24);
          --rk-shadows-walletLogo: 0px 2px 16px rgba(139, 92, 246, 0.16);
        }
        
        /* Modal positioning fixes */
        [data-rk] [role="dialog"] {
          position: fixed !important;
          top: 50% !important;
          left: 50% !important;
          transform: translate(-50%, -50%) !important;
          max-width: 420px !important;
          width: 100% !important;
          border-radius: var(--rk-radii-modal) !important;
          border: 1px solid var(--rk-colors-modalBorder) !important;
          background-color: var(--rk-colors-modalBackground) !important;
          box-shadow: var(--rk-shadows-dialog) !important;
          z-index: 9999 !important;
          padding: 24px !important;
        }
        
        /* Modal overlay */
        [data-rk] [role="dialog"]::before {
          content: "";
          position: fixed;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.6);
          backdrop-filter: var(--rk-blurs-modalOverlay);
          z-index: -1;
        }
        
        /* Connect button styling */
        [data-rk] button {
          font-family: var(--rk-fonts-body);
          font-weight: 600;
          border-radius: var(--rk-radii-connectButton);
          padding: 8px 12px;
        }
        
        /* Dialog overlay */
        [data-radix-dialog-overlay] {
          position: fixed !important;
          inset: 0 !important;
          background-color: rgba(0, 0, 0, 0.5) !important;
          z-index: 9998 !important;
        }
        
        /* Fix for Radix UI Dialog components used by RainbowKit */
        [data-radix-popper-content-wrapper] {
          z-index: 9999 !important;
        }
      `
      document.head.appendChild(style)
      setStylesLoaded(true)
    }
  }, [])

  // Show a minimal loading state while styles are being loaded
  if (!stylesLoaded && typeof window !== "undefined") {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
          <p className="text-white text-sm">Loading wallet connection...</p>
        </div>
      </div>
    )
  }

  // Show a notice in the preview environment
  if (isVercelPreview && typeof window !== "undefined") {
    console.info("Using inline RainbowKit styles for Vercel v0 preview environment")
  }

  return <>{children}</>
}

export default RainbowKitStylesProvider
