"use client"

import type { ReactNode } from "react"
import { useState, useEffect } from "react"
import { WalletProvider } from "./WalletProvider"
import { ThemeProvider } from "@/components/theme-provider"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    // Check if WalletConnect project ID is available
    if (!process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID) {
      console.warn("Missing NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID environment variable")
    }

    // Add global error handler for provider errors
    const handleError = (event: ErrorEvent) => {
      if (
        event.error?.message?.includes("provider") ||
        event.error?.message?.includes("wallet") ||
        event.error?.stack?.includes("@walletconnect")
      ) {
        setError(event.error)
        // Prevent the error from bubbling up
        event.preventDefault()
      }
    }

    window.addEventListener("error", handleError)

    return () => {
      window.removeEventListener("error", handleError)
    }
  }, [])

  if (error) {
    return (
      <ThemeProvider attribute="class" defaultTheme="dark">
        <div className="container py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Provider Error</AlertTitle>
            <AlertDescription>
              There was an issue initializing the wallet provider. Please refresh the page and try again.
            </AlertDescription>
          </Alert>
        </div>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <WalletProvider>{children}</WalletProvider>
    </ThemeProvider>
  )
}
