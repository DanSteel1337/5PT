"use client"

import type { ReactNode } from "react"
import { WalletProvider } from "./WalletProvider"
import { ThemeProvider } from "@/components/theme-provider"

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <WalletProvider>{children}</WalletProvider>
    </ThemeProvider>
  )
}
