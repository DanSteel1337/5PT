/**
 * @file Web3ProviderWrapper.tsx
 * @description Client component wrapper for Web3 functionality
 *
 * This component ensures that Web3 functionality is only used
 * on the client side, preventing server-side rendering errors.
 *
 * @dependencies
 * - react: Provides React functionality
 *
 * @related
 * - components/web3/ConnectButton.tsx: Uses this wrapper
 * - components/web3/NetworkSwitcher.tsx: Uses this wrapper
 */

"use client"

import { type ReactNode, useState, useEffect } from "react"

interface Web3ProviderWrapperProps {
  children: ReactNode
}

/**
 * Web3ProviderWrapper Component
 *
 * A client-side only wrapper for Web3 components.
 * Prevents hydration errors by only rendering children
 * after client-side hydration is complete.
 *
 * @example
 * ```tsx
 * <Web3ProviderWrapper>
 *   <ConnectButton />
 * </Web3ProviderWrapper>
 * ```
 */
export function Web3ProviderWrapper({ children }: Web3ProviderWrapperProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return <>{children}</>
}

export default Web3ProviderWrapper
