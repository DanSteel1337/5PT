"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton"
import { ClientOnly } from "@/components/ClientOnly"
import { Web3DebugPanel } from "@/utils/web3-debug"
import { RainbowKitDebug } from "@/components/web3/RainbowKitDebug"

// Dynamically import the FuturisticLogo component
const FuturisticLogo = dynamic(() => import("@/components/FuturisticLogo"), {
  // Don't use ssr: false here, use ClientOnly wrapper instead
  loading: () => <div className="w-10 h-10 bg-purple-900/30 rounded-full animate-pulse"></div>,
})

// Dynamically import client components
const DashboardContent = dynamic(() => import("@/components/dashboard/DashboardContent"), {
  // Don't use ssr: false here, use ClientOnly wrapper instead
  loading: () => <DashboardSkeleton />,
})

export default function ClientDashboardPage() {
  const showDebug = process.env.NODE_ENV === "development"

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <ClientOnly fallback={<div className="w-10 h-10 bg-purple-900/30 rounded-full animate-pulse"></div>}>
          <FuturisticLogo size={42} withText={false} className="flex-shrink-0" />
        </ClientOnly>
        <h1 className="text-3xl font-bold text-gradient glow-text">Investment Dashboard</h1>
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <ClientOnly fallback={<DashboardSkeleton />}>
          <DashboardContent />
        </ClientOnly>
      </Suspense>

      {/* Debug panels */}
      <ClientOnly>
        {/* Web3 Debug Panel */}
        {showDebug && <Web3DebugPanel />}

        {/* RainbowKit Debug Panel - always shown in development and preview */}
        <RainbowKitDebug />
      </ClientOnly>
    </main>
  )
}
