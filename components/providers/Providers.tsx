"use client"

import { ThemeProvider } from "@/components/theme-provider"
import { Web3Provider } from "./Web3Provider"
import type { ReactNode } from "react"

/**
 * Root Providers component
 *
 * This component wraps all providers needed for the application.
 * The order is important:
 * 1. ThemeProvider (for UI theming)
 * 2. Web3Provider (for blockchain interaction)
 */
export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <Web3Provider>{children}</Web3Provider>
    </ThemeProvider>
  )
}
