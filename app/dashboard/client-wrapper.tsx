"use client"

import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import { DashboardOverview } from "@/components/dashboard/DashboardOverview"
import { PageLoading } from "@/components/ui/page-loading"
import { RainbowKitDebug } from "@/components/web3/RainbowKitDebug"
import { QueryClientDebug } from "@/components/debug/QueryClientDebug"

interface ClientWrapperProps {
  activePage?: string
}

export function ClientWrapper({ activePage = "overview" }: ClientWrapperProps) {
  const { address, isConnected } = useAccount()
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (!mounted) return null

  return (
    <div className="relative w-full">
      {/* Debug components */}
      {process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
          <RainbowKitDebug />
          <QueryClientDebug />
        </div>
      )}

      {isLoading ? (
        <PageLoading message="Initializing dashboard..." />
      ) : (
        <DashboardOverview isConnected={isConnected} address={address} activePage={activePage} />
      )}
    </div>
  )
}
