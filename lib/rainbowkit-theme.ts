/**
 * @file rainbowkit-theme.ts
 * @description Custom theme configuration for RainbowKit
 *
 * This file defines a custom theme for RainbowKit that matches
 * the application's design system with purple accents.
 *
 * @dependencies
 * - @rainbow-me/rainbowkit: Provides theming capabilities
 *
 * @related
 * - components/providers/Providers.tsx: Uses this theme
 */

import { type Theme, darkTheme } from "@rainbow-me/rainbowkit"

/**
 * Custom RainbowKit theme with purple accents
 *
 * Extends the default dark theme with custom colors to match
 * the application's design system.
 */
export const theme: Theme = {
  ...darkTheme(),
  colors: {
    ...darkTheme().colors,
    accentColor: "#8b5cf6", // Purple accent color
    accentColorForeground: "#ffffff",
    modalBackground: "#121212",
    modalBorder: "rgba(139, 92, 246, 0.3)", // Semi-transparent purple
    profileForeground: "#121212",
  },
  fonts: {
    body: "Inter, sans-serif",
  },
  radii: {
    actionButton: "8px",
    connectButton: "8px",
    menuButton: "8px",
    modal: "12px",
    modalMobile: "12px",
  },
  shadows: {
    connectButton: "0px 4px 12px rgba(0, 0, 0, 0.1)",
    dialog: "0px 8px 32px rgba(0, 0, 0, 0.32)",
    profileDetailsAction: "0px 2px 6px rgba(37, 41, 46, 0.04)",
    selectedOption: "0px 2px 6px rgba(0, 0, 0, 0.24)",
    selectedWallet: "0px 2px 6px rgba(0, 0, 0, 0.24)",
    walletLogo: "0px 2px 16px rgba(0, 0, 0, 0.16)",
  },
}
