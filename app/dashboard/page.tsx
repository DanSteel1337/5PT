"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAccount } from "wagmi"
import { ClientDashboard } from "@/components/dashboard/client-dashboard"
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton"
import { ConnectWalletPrompt } from "@/components/dashboard/connect-wallet-prompt"

export default function DashboardPage() {
  // Client-side mounting check to prevent hydration errors
  const [mounted, setMounted] = useState(false)
  const { isConnected } = useAccount()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <DashboardSkeleton />
  }

  // If wallet is not connected, show connect wallet prompt
  if (!isConnected) {
    return <ConnectWalletPrompt />
  }

  return <ClientDashboard />
}
