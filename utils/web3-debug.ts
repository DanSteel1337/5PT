"use client"

/**
 * Web3 Provider Debug Utility
 *
 * This utility helps diagnose issues with Web3 providers in the application.
 * It provides functions to check provider state, connection status, and more.
 */

import { useEffect, useState } from "react"
import { useConfig, useAccount, useChainId } from "wagmi"

export function useWeb3Debug() {
  const [mounted, setMounted] = useState(false)
  const [config] = useState(() => {
    try {
      return useConfig()
    } catch (e) {
      return null
    }
  })
  const [account] = useState(() => {
    try {
      return useAccount()
    } catch (e) {
      return null
    }
  })
  const [chainId] = useState(() => {
    try {
      return useChainId()
    } catch (e) {
      return null
    }
  })
  const [errors, setErrors] = useState<string[]>([])

  const [providerState, setProviderState] = useState<{
    configAvailable: boolean
    accountAvailable: boolean
    chainAvailable: boolean
    windowEthereumAvailable: boolean
    wagmiInitialized: boolean
    rainbowkitInitialized: boolean
    errors: string[]
  }>({
    configAvailable: false,
    accountAvailable: false,
    chainAvailable: false,
    windowEthereumAvailable: false,
    wagmiInitialized: false,
    rainbowkitInitialized: false,
    errors: [],
  })

  useEffect(() => {
    setMounted(true)

    // Check window.ethereum availability
    const windowEthereumAvailable = typeof window !== "undefined" && window.ethereum !== undefined

    // Check for RainbowKit initialization
    const rainbowkitInitialized =
      typeof window !== "undefined" && (window as any).__RAINBOWKIT_PROVIDERS__ !== undefined

    const errorMessages: string[] = []
    if (!config) {
      try {
        useConfig() // Call it again to catch the error
      } catch (e: any) {
        errorMessages.push(`useConfig error: ${e instanceof Error ? e.message : String(e)}`)
      }
    }
    if (!account) {
      try {
        useAccount() // Call it again to catch the error
      } catch (e: any) {
        errorMessages.push(`useAccount error: ${e instanceof Error ? e.message : String(e)}`)
      }
    }
    if (!chainId) {
      try {
        useChainId() // Call it again to catch the error
      } catch (e: any) {
        errorMessages.push(`useChainId error: ${e instanceof Error ? e.message : String(e)}`)
      }
    }

    setErrors(errorMessages)

    // Update provider state
    setProviderState({
      configAvailable: !!config,
      accountAvailable: !!account,
      chainAvailable: !!chainId,
      windowEthereumAvailable,
      wagmiInitialized: !!config,
      rainbowkitInitialized,
      errors: errorMessages,
    })
  }, [config, account, chainId])

  return {
    mounted,
    providerState,
    // Helper function to log debug info
    logDebugInfo: () => {
      console.group("Web3 Provider Debug Info")
      console.log("Provider State:", providerState)
      console.log("Mounted:", mounted)
      console.log("Config Available:", !!config)
      console.log("Account Available:", !!account)
      console.log("Chain Available:", !!chainId)
      console.log("window.ethereum Available:", typeof window !== "undefined" && window.ethereum !== undefined)
      console.log("Errors:", errors)
      console.groupEnd()
    },
  }
}

// Export a debug component that can be added to any page for troubleshooting
export function Web3DebugPanel() {
  const { mounted, providerState, logDebugInfo } = useWeb3Debug()
  const [showDebug, setShowDebug] = useState(false)

  useEffect(() => {
    // Log debug info on mount
    logDebugInfo()
  }, [logDebugInfo])

  if (!mounted) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setShowDebug(!showDebug)}
        className="bg-purple-900/80 text-white px-3 py-2 rounded-md text-sm"
      >
        {showDebug ? "Hide" : "Show"} Web3 Debug
      </button>

      {showDebug && (
        <div className="mt-2 p-4 bg-black/90 border border-purple-500/50 rounded-md text-white text-xs w-80 max-h-96 overflow-auto">
          <h3 className="font-bold mb-2">Web3 Provider Debug</h3>
          <ul className="space-y-1">
            <li>
              Config Available:{" "}
              <span className={providerState.configAvailable ? "text-green-400" : "text-red-400"}>
                {providerState.configAvailable ? "Yes" : "No"}
              </span>
            </li>
            <li>
              Account Available:{" "}
              <span className={providerState.accountAvailable ? "text-green-400" : "text-red-400"}>
                {providerState.accountAvailable ? "Yes" : "No"}
              </span>
            </li>
            <li>
              Chain Available:{" "}
              <span className={providerState.chainAvailable ? "text-green-400" : "text-red-400"}>
                {providerState.chainAvailable ? "Yes" : "No"}
              </span>
            </li>
            <li>
              window.ethereum:{" "}
              <span className={providerState.windowEthereumAvailable ? "text-green-400" : "text-red-400"}>
                {providerState.windowEthereumAvailable ? "Available" : "Not Available"}
              </span>
            </li>
            <li>
              Wagmi Initialized:{" "}
              <span className={providerState.wagmiInitialized ? "text-green-400" : "text-red-400"}>
                {providerState.wagmiInitialized ? "Yes" : "No"}
              </span>
            </li>
            <li>
              RainbowKit Initialized:{" "}
              <span className={providerState.rainbowkitInitialized ? "text-green-400" : "text-red-400"}>
                {providerState.rainbowkitInitialized ? "Yes" : "No"}
              </span>
            </li>
          </ul>

          {providerState.errors.length > 0 && (
            <div className="mt-2">
              <h4 className="font-bold text-red-400">Errors:</h4>
              <ul className="list-disc pl-4 text-red-300">
                {providerState.errors.map((error, i) => (
                  <li key={i}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <button onClick={logDebugInfo} className="mt-2 bg-purple-700 text-white px-2 py-1 rounded-md text-xs">
            Log to Console
          </button>
        </div>
      )}
    </div>
  )
}
