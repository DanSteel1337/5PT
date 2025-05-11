"use client"

import { ConnectKitButton } from "connectkit"
import { useAccount } from "wagmi"
import { NetworkStatus } from "@/components/ui/network-status"

export function DashboardHeader() {
  const { isConnected } = useAccount()

  return (
    <header className="flex items-center justify-between py-4 px-6 bg-black/40 backdrop-blur-md border-b border-amber-600/20">
      <h1 className="text-xl font-bold text-amber-300">Five Pillars Token</h1>

      <div className="flex items-center gap-4">
        <NetworkStatus />
        {!isConnected && <ConnectKitButton />}
      </div>
    </header>
  )
}
