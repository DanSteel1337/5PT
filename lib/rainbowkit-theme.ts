"use client"

import { darkTheme } from "@rainbow-me/rainbowkit"

// Create a custom theme for RainbowKit with cyberpunk aesthetic
export const customRainbowKitTheme = darkTheme({
  accentColor: "#8b5cf6", // Purple accent color
  accentColorForeground: "white",
  borderRadius: "medium",
  fontStack: "system",
  overlayBlur: "small",
  shadows: {
    connectButton: "0px 4px 12px rgba(139, 92, 246, 0.4)",
    dialog: "0px 8px 32px rgba(139, 92, 246, 0.4)",
  },
  colors: {
    modalBackground: "#0d0d14", // Darker background for modal
    connectButtonBackground: "#0d0d14", // Match your cyberpunk theme
    connectButtonInnerBackground: "linear-gradient(to right, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2))",
    modalBorder: "rgba(139, 92, 246, 0.3)",
    modalText: "#ffffff",
    modalTextSecondary: "rgba(255, 255, 255, 0.6)",
    modalTextDim: "rgba(255, 255, 255, 0.3)",
    actionButtonBorder: "rgba(139, 92, 246, 0.3)",
    actionButtonBorderMobile: "rgba(139, 92, 246, 0.3)",
    actionButtonSecondaryBackground: "rgba(139, 92, 246, 0.1)",
    closeButton: "rgba(255, 255, 255, 0.8)",
    closeButtonBackground: "rgba(139, 92, 246, 0.2)",
    generalBorder: "rgba(139, 92, 246, 0.3)",
    generalBorderDim: "rgba(139, 92, 246, 0.2)",
    menuItemBackground: "rgba(139, 92, 246, 0.1)",
  },
})
