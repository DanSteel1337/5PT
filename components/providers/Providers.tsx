"use client"

import type { ReactNode } from "react"
import { WalletProvider } from "./WalletProvider"

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return <WalletProvider>{children}</WalletProvider>
}
