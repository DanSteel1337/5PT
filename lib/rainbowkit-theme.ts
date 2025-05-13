"use client"

import { darkTheme } from "@rainbow-me/rainbowkit"

// Create a custom theme for RainbowKit
export const customRainbowKitTheme = darkTheme({
  accentColor: "#8b5cf6", // Purple accent color
  accentColorForeground: "white",
  borderRadius: "medium",
  fontStack: "system",
  overlayBlur: "small",
})

// Export custom styles for RainbowKit components
export const rainbowKitStyles = {
  connectButton: "rainbow-kit-connect-button",
  accountButton: "rainbow-kit-account-button",
  modal: "rainbow-kit-modal",
}
