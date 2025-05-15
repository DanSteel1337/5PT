"use client"

import { useState, useEffect, type ReactNode } from "react"

/**
 * This component ensures that components are only rendered after client-side hydration
 * It acts as a safety barrier for components that use browser APIs or client-side hooks
 *
 * IMPORTANT: This component does NOT use any wagmi hooks directly to avoid circular dependencies
 * It only handles client-side mounting checks
 */
export function Web3ProviderWrapper({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)

  // Set mounted state after component mounts on the client
  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render children until client-side hydration is complete
  if (!mounted) {
    return (
      <div className="animate-pulse" aria-label="Loading content...">
        <div className="h-12 w-full mb-4 bg-gray-800 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-40 w-full bg-gray-800 rounded"></div>
          <div className="h-40 w-full bg-gray-800 rounded"></div>
          <div className="h-40 w-full bg-gray-800 rounded"></div>
        </div>
      </div>
    )
  }

  // Once mounted, render children
  return <>{children}</>
}

export default Web3ProviderWrapper
