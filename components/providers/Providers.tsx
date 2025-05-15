"use client"

import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Web3Provider } from "./Web3Provider"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <Web3Provider>{children}</Web3Provider>
    </ThemeProvider>
  )
}

export default Providers
