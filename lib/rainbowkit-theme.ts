"use client"

import { darkTheme, type Theme } from "@rainbow-me/rainbowkit"

// Create a custom theme based on the dark theme
export const customTheme: Theme = {
  ...darkTheme(),
  colors: {
    ...darkTheme().colors,
    accentColor: "hsl(var(--primary))",
    accentColorForeground: "hsl(var(--primary-foreground))",
    connectButtonBackground: "hsl(var(--background))",
    connectButtonText: "hsl(var(--foreground))",
  },
  radii: {
    ...darkTheme().radii,
    connectButton: "var(--radius)",
    modal: "var(--radius)",
  },
  shadows: {
    ...darkTheme().shadows,
  },
}
