"use client"

import type React from "react"
import { ModernSidebar } from "@/components/dashboard/modern-sidebar"
import { ModernHeader } from "@/components/dashboard/modern-header"
import { Web3Providers } from "@/components/web3-providers"
import { useEffect, useState } from "react"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isPreview, setIsPreview] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check if we're in a preview environment
    const hostname = window.location.hostname
    setIsPreview(hostname.includes("vercel.app") || hostname === "localhost" || hostname === "127.0.0.1")
  }, [])

  // In preview mode, don't use Web3Providers
  if (!mounted || isPreview) {
    return (
      <div className="flex min-h-screen flex-col circuit-bg">
        {isPreview && (
          <div className="bg-yellow-600 text-white text-center py-1 px-4 text-sm font-medium relative z-50">
            Preview Mode - Using Mock Data
          </div>
        )}
        <ModernHeader />
        <div className="flex-1 items-start md:grid md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr]">
          <aside className="fixed top-16 z-30 hidden h-[calc(100vh-4rem)] w-full shrink-0 overflow-y-auto border-r border-border/50 md:sticky md:block">
            <ModernSidebar />
          </aside>
          <main className="flex w-full flex-col">{children}</main>
        </div>
      </div>
    )
  }

  // In production, use Web3Providers
  return (
    <Web3Providers>
      <div className="flex min-h-screen flex-col circuit-bg">
        <ModernHeader />
        <div className="flex-1 items-start md:grid md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr]">
          <aside className="fixed top-16 z-30 hidden h-[calc(100vh-4rem)] w-full shrink-0 overflow-y-auto border-r border-border/50 md:sticky md:block">
            <ModernSidebar />
          </aside>
          <main className="flex w-full flex-col">{children}</main>
        </div>
      </div>
    </Web3Providers>
  )
}
