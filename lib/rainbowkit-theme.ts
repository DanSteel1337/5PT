"use client"

import { darkTheme, type Theme } from "@rainbow-me/rainbowkit"

// Create a custom theme based on the dark theme with purple/blue accents
export const customTheme: Theme = {
  ...darkTheme(),
  blurs: {
    modalOverlay: "blur(0px)",
  },
  colors: {
    accentColor: "#8b5cf6", // Purple 500
    accentColorForeground: "#ffffff",
    actionButtonBorder: "rgba(255, 255, 255, 0.04)",
    actionButtonBorderMobile: "rgba(255, 255, 255, 0.08)",
    actionButtonSecondaryBackground: "rgba(255, 255, 255, 0.08)",
    closeButton: "rgba(224, 232, 255, 0.6)",
    closeButtonBackground: "rgba(255, 255, 255, 0.08)",
    connectButtonBackground: "#111111",
    connectButtonBackgroundError: "#FF494A",
    connectButtonInnerBackground: "linear-gradient(0deg, rgba(255, 255, 255, 0.075), rgba(255, 255, 255, 0.15))",
    connectButtonText: "#ffffff",
    connectButtonTextError: "#ffffff",
    connectionIndicator: "#30E000",
    error: "#FF494A",
    generalBorder: "rgba(255, 255, 255, 0.08)",
    generalBorderDim: "rgba(255, 255, 255, 0.04)",
    menuItemBackground: "rgba(239, 246, 255, 0.08)",
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
    actionButton: "9999px",
    connectButton: "12px",
    menuButton: "12px",
    modal: "24px",
    modalMobile: "28px",
  },
  shadows: {
    connectButton: "0px 4px 12px rgba(139, 92, 246, 0.1)",
    dialog: "0px 8px 32px rgba(0, 0, 0, 0.32)",
    profileDetailsAction: "0px 2px 6px rgba(37, 41, 46, 0.04)",
    selectedOption: "0px 2px 6px rgba(0, 0, 0, 0.24)",
    selectedWallet: "0px 2px 6px rgba(0, 0, 0, 0.24)",
    walletLogo: "0px 2px 16px rgba(0, 0, 0, 0.16)",
  },
  fonts: {
    body: "Inter, sans-serif",
  },
}
