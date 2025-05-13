"use client"

import type { ReactNode } from "react"
import { useState, useEffect, useRef } from "react"
import { WalletProvider } from "./WalletProvider"
import { ThemeProvider } from "@/components/theme-provider"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  const [error, setError] = useState<Error | null>(null)
  const initializedRef = useRef(false)

  useEffect(() => {
    // Mark as initialized to prevent double initialization
    if (initializedRef.current) return
    initializedRef.current = true

    // Add global error handler for provider errors
    const handleError = (event: ErrorEvent) => {
      // Check if the error is related to WalletConnect
      if (
        event.error?.message?.includes("provider") ||
        event.error?.message?.includes("wallet") ||
        event.error?.message?.includes("@walletconnect") ||
        event.error?.stack?.includes("@walletconnect") ||
        event.error?.message?.includes("WalletConnect") ||
        event.error?.message?.includes("Allowlist") ||
        event.error?.message?.includes("u[a]")
      ) {
        console.warn("Wallet provider error:", event.error?.message || "Unknown wallet error")

        // Don't set error for allowlist warnings - these are expected in development
        if (event.error?.message?.includes("Allowlist")) {
          console.info("Allowlist warning - this is expected in development environments")
        } else {
          setError(event.error)
        }

        // Prevent the error from bubbling up
        event.preventDefault()
      }
    }

    // Handle unhandled promise rejections
    const handleRejection = (event: PromiseRejectionEvent) => {
      if (
        event.reason?.message?.includes("provider") ||
        event.reason?.message?.includes("wallet") ||
        event.reason?.message?.includes("@walletconnect") ||
        event.reason?.stack?.includes("@walletconnect") ||
        event.reason?.message?.includes("WalletConnect") ||
        event.reason?.message?.includes("Allowlist") ||
        event.reason?.message?.includes("u[a]")
      ) {
        console.warn("Wallet provider rejection:", event.reason?.message || "Unknown wallet rejection")

        // Don't set error for allowlist warnings
        if (event.reason?.message?.includes("Allowlist")) {
          console.info("Allowlist warning - this is expected in development environments")
        } else {
          setError(event.reason instanceof Error ? event.reason : new Error(String(event.reason)))
        }

        // Prevent the error from bubbling up
        event.preventDefault()
      }
    }

    window.addEventListener("error", handleError)
    window.addEventListener("unhandledrejection", handleRejection)

    return () => {
      window.removeEventListener("error", handleError)
      window.removeEventListener("unhandledrejection", handleRejection)
    }
  }, [])

  // Provide a way to reset errors
  const resetError = () => setError(null)

  if (error) {
    return (
      <ThemeProvider attribute="class" defaultTheme="dark">
        <div className="container py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Wallet Connection Error</AlertTitle>
            <AlertDescription>
              <div>
                There was an issue with the wallet connection. This is likely due to the development environment.
              </div>
              {error.message && <div className="mt-2 text-xs opacity-80 break-words">Error: {error.message}</div>}
              <button
                onClick={resetError}
                className="mt-4 px-4 py-2 bg-background/20 hover:bg-background/30 rounded-md text-sm"
              >
                Dismiss and Continue
              </button>
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
