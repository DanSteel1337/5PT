"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/Header"
import { Sidebar } from "@/components/layout/Sidebar"
import { Footer } from "@/components/layout/Footer"
import { ErrorBoundary } from "@/components/layout/ErrorBoundary"
import { Suspense } from "react"
import { Loader2 } from "lucide-react"

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Only render after client-side hydration
  useEffect(() => {
    setMounted(true)
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
