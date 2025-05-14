"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"

/**
 * Debug component to verify QueryClient context is available
 * This helps diagnose context issues in different environments
 */
export function QueryClientDebug() {
  // Try to access the QueryClient context
  // This will throw if the context is not available
  const queryClient = useQueryClient()

  // Log the QueryClient for debugging
  useEffect(() => {
    console.log("QueryClient available:", queryClient)
    console.log("QueryClient defaultOptions:", queryClient.getDefaultOptions())
    console.log("Environment:", process.env.NODE_ENV)
    console.log("Is Vercel v0:", typeof window !== "undefined" && window.location.hostname.includes("vusercontent"))
  }, [queryClient])

  // Visual indicator of QueryClient status
  return (
    <div className="fixed bottom-4 right-4 z-50 p-3 bg-green-800 text-white text-xs rounded shadow-lg">
      ✅ QueryClient Available
      <div className="text-xs opacity-70 mt-1">Check console for details</div>
    </div>
  )
}

// Error boundary wrapper to catch QueryClient errors
export function QueryClientDebugWithErrorBoundary() {
  const [hasError, setHasError] = useState(false)
  const [queryClient, setQueryClient] = useState<any>(null)

  useEffect(() => {
    let client: any = null
    try {
      // Try to access QueryClient
      client = useQueryClient()
      setQueryClient(client)
      console.log("QueryClient check passed:", client)
      setHasError(false)
    } catch (error) {
      console.error("QueryClient error:", error)
      setHasError(true)
    } finally {
      setQueryClient(client)
    }
  }, [])

  if (hasError) {
    return (
      <div className="fixed bottom-4 right-4 z-50 p-3 bg-red-800 text-white text-xs rounded shadow-lg">
        ❌ QueryClient Error
        <div className="text-xs opacity-70 mt-1">Check console for details</div>
      </div>
    )
  }

  // Only render the actual component if no error occurred during the check
  try {
    return <QueryClientDebug />
  } catch (error) {
    console.error("QueryClient render error:", error)
    return (
      <div className="fixed bottom-4 right-4 z-50 p-3 bg-red-800 text-white text-xs rounded shadow-lg">
        ❌ QueryClient Render Error
        <div className="text-xs opacity-70 mt-1">Check console for details</div>
      </div>
    )
  }
}
