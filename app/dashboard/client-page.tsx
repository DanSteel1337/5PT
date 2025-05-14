"use client"

import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import { DashboardOverview } from "@/components/dashboard/DashboardOverview"
import { PageLoading } from "@/components/ui/page-loading"
import { RainbowKitDebug } from "@/components/web3/RainbowKitDebug"
import { QueryClientDebug } from "@/components/debug/QueryClientDebug"

export default function DashboardClientPage() {
  const { isConnected, address } = useAccount()
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
    // Simulate loading for smoother transitions
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  if (!mounted) return null

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-black via-purple-950/20 to-black">
      {/* Debug components - only visible in development */}
      {process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
          <RainbowKitDebug />
          <QueryClientDebug />
        </div>
      )}

      {isLoading ? (
        <PageLoading message="Initializing dashboard..." />
      ) : (
        <DashboardOverview isConnected={isConnected} address={address} />
      )}
    </div>
  )
}
