"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Header } from "@/components/layout/Header"
import { Sidebar } from "@/components/layout/Sidebar"
import { Footer } from "@/components/layout/Footer"
import { ErrorBoundary } from "@/components/layout/ErrorBoundary"
import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [walletError, setWalletError] = useState<Error | null>(null)
  const mountedRef = useRef(false)

  // Only render after client-side hydration
  useEffect(() => {
    if (mountedRef.current) return
    mountedRef.current = true
    setMounted(true)

    // Add global error handler for wallet connection errors
    const handleError = (event: ErrorEvent) => {
      // Check if the error is related to WalletConnect
      if (
        event.error?.message?.includes("walletconnect") ||
        event.error?.message?.includes("wallet") ||
        event.error?.stack?.includes("@walletconnect") ||
        event.error?.message?.includes("WalletConnect")
      ) {
        console.warn("Wallet connection error:", event.error)
        setWalletError(event.error)
        // Prevent the error from bubbling up
        event.preventDefault()
        return true
      }
      return false
    }

    const handleRejection = (event: PromiseRejectionEvent) => {
      if (event.reason && typeof event.reason === "object") {
        const error = event.reason as Error
        if (
          error.message?.includes("walletconnect") ||
          error.message?.includes("wallet") ||
          error.stack?.includes("@walletconnect") ||
          error.message?.includes("WalletConnect")
        ) {
          console.warn("Unhandled wallet connection error:", error)
          setWalletError(error)
          event.preventDefault()
        }
      }
    }

    window.addEventListener("error", handleError)
    window.addEventListener("unhandledrejection", handleRejection)

    return () => {
      window.removeEventListener("error", handleError)
      window.removeEventListener("unhandledrejection", handleRejection)
    }
  }, [])

  // Reset wallet error
  const resetWalletError = () => setWalletError(null)

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 pt-16 lg:pl-64">
        <ErrorBoundary>
          {walletError && (
            <div className="container py-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Wallet Connection Error</AlertTitle>
                <AlertDescription>
                  <div>There was an issue with the wallet connection. Please refresh the page and try again.</div>
                  {walletError.message && (
                    <div className="mt-2 text-xs opacity-80 break-words">Error: {walletError.message}</div>
                  )}
                  <button
                    onClick={resetWalletError}
                    className="mt-4 px-4 py-2 bg-background/20 hover:bg-background/30 rounded-md text-sm"
                  >
                    Dismiss
                  </button>
                </AlertDescription>
              </Alert>
            </div>
          )}
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            }
          >
            <div className="container py-6">{children}</div>
          </Suspense>
        </ErrorBoundary>
        <Footer />
      </main>
    </div>
  )
}
