"use client"

import { useState, useEffect, type ReactNode } from "react"
import { useAccount } from "wagmi"
import { ConnectButton } from "@/components/web3/ConnectButton"

interface AuthCheckProps {
  children: ReactNode
}

export function AuthCheck({ children }: AuthCheckProps) {
  const { isConnected } = useAccount()
  const [mounted, setMounted] = useState(false)

  // Only render after client-side hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h3 className="text-xl font-semibold mb-4">Connect Wallet to Continue</h3>
        <ConnectButton />
      </div>
    )
  }

  return <>{children}</>
}
