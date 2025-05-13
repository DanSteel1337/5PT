"use client"

import { darkTheme, type Theme } from "@rainbow-me/rainbowkit"

// Create a custom theme based on the dark theme with purple/blue accents
export const customTheme: Theme = {
  ...darkTheme(),
  blurs: {
    modalOverlay: "blur(8px)",
  },
  colors: {
    accentColor: "#8b5cf6", // Purple 500
    accentColorForeground: "#ffffff",
    actionButtonBorder: "rgba(139, 92, 246, 0.1)",
    actionButtonBorderMobile: "rgba(139, 92, 246, 0.2)",
    actionButtonSecondaryBackground: "rgba(139, 92, 246, 0.1)",
    closeButton: "rgba(224, 232, 255, 0.6)",
    closeButtonBackground: "rgba(139, 92, 246, 0.1)",
    connectButtonBackground: "#111111",
    connectButtonBackgroundError: "#FF494A",
    connectButtonInnerBackground: "linear-gradient(90deg, rgba(139, 92, 246, 0.8), rgba(59, 130, 246, 0.8))",
    connectButtonText: "#ffffff",
    connectButtonTextError: "#ffffff",
    connectionIndicator: "#30E000",
    error: "#FF494A",
    generalBorder: "rgba(139, 92, 246, 0.1)",
    generalBorderDim: "rgba(139, 92, 246, 0.05)",
    menuItemBackground: "rgba(139, 92, 246, 0.1)",
    modalBackdrop: "rgba(0, 0, 0, 0.5)",
    modalBackground: "#111111",
    modalBorder: "rgba(139, 92, 246, 0.2)",
    modalText: "#ffffff",
    modalTextDim: "rgba(224, 232, 255, 0.5)",
    modalTextSecondary: "rgba(255, 255, 255, 0.6)",
    profileAction: "rgba(139, 92, 246, 0.1)",
    profileActionHover: "rgba(139, 92, 246, 0.2)",
    profileForeground: "rgba(224, 232, 255, 0.05)",
    selectedOptionBorder: "#8b5cf6",
    standby: "#FFD641",
  },
  radii: {
    actionButton: "12px",
    connectButton: "12px",
    menuButton: "12px",
    modal: "16px",
    modalMobile: "16px",
  },
  shadows: {
    connectButton: "0px 4px 12px rgba(139, 92, 246, 0.2)",
    dialog: "0px 8px 32px rgba(139, 92, 246, 0.1)",
    profileDetailsAction: "0px 2px 6px rgba(139, 92, 246, 0.1)",
    selectedOption: "0px 2px 6px rgba(139, 92, 246, 0.2)",
    selectedWallet: "0px 2px 6px rgba(139, 92, 246, 0.2)",
    walletLogo: "0px 2px 16px rgba(139, 92, 246, 0.2)",
  },
  fonts: {
    body: "Inter, sans-serif",
  },
}
