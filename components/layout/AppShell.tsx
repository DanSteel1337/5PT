"use client"

import type React from "react"

import { useState, useEffect } from "react"
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

  // Only render after client-side hydration
  useEffect(() => {
    setMounted(true)

    // Add global error handler for wallet connection errors
    const handleError = (event: ErrorEvent) => {
      if (
        event.error?.message?.includes("walletconnect") ||
        event.error?.message?.includes("wallet") ||
        event.error?.stack?.includes("@walletconnect")
      ) {
        setWalletError(event.error)
        // Prevent the error from bubbling up
        event.preventDefault()
      }
    }

    window.addEventListener("error", handleError)

    return () => {
      window.removeEventListener("error", handleError)
    }
  }, [])

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
                  There was an issue with the wallet connection. Please refresh the page and try again.
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
