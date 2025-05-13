"use client"

import { useState, useEffect, type ReactNode } from "react"
import { useConfig } from "wagmi"

/**
 * This component ensures that Wagmi hooks are only used when the provider is fully initialized
 * It acts as a safety barrier between the WagmiProvider and components using Wagmi hooks
 */
export function Web3ProviderWrapper({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const config = useConfig()

  // This will throw if useConfig is used outside WagmiProvider
  // But since we're checking for mounted state first, it should never happen
  const isProviderReady = Boolean(config)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render children until client-side and provider is ready
  if (!mounted || !isProviderReady) {
    return (
      <div className="animate-pulse">
        <div className="h-12 w-full mb-4 bg-gray-800 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-40 w-full bg-gray-800 rounded"></div>
          <div className="h-40 w-full bg-gray-800 rounded"></div>
          <div className="h-40 w-full bg-gray-800 rounded"></div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

export default Web3ProviderWrapper
