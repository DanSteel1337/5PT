"use client"

import { darkTheme, type Theme } from "@rainbow-me/rainbowkit"

// Create a custom theme based on the dark theme
export const customTheme: Theme = {
  ...darkTheme(),
  colors: {
    ...darkTheme().colors,
    accentColor: "#f59e0b", // Amber 500
    accentColorForeground: "#000000",
    connectButtonBackground: "hsl(var(--background))",
    connectButtonText: "hsl(var(--foreground))",
    modalBackground: "#111111",
    modalBorder: "rgba(245, 158, 11, 0.2)",
    modalText: "#ffffff",
    modalTextSecondary: "rgba(255, 255, 255, 0.6)",
    profileForeground: "#111111",
    profileAction: "rgba(245, 158, 11, 0.1)",
    profileActionHover: "rgba(245, 158, 11, 0.2)",
    profileForeground: "#111111",
    selectedOptionBorder: "#f59e0b",
  },
  radii: {
    ...darkTheme().radii,
    connectButton: "0.5rem",
    modal: "0.75rem",
  },
  shadows: {
    ...darkTheme().shadows,
    connectButton: "0px 4px 12px rgba(245, 158, 11, 0.1)",
    dialog: "0px 8px 32px rgba(0, 0, 0, 0.32)",
  },
  fonts: {
    body: "Inter, sans-serif",
  },
}
