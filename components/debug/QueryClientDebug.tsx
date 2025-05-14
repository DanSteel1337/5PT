"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"

/**
 * Debug component to verify QueryClient context is available
 * This helps diagnose context issues in different environments
 */
export function QueryClientDebug() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [queryClient, setQueryClient] = useState<any>(null)

  useEffect(() => {
    try {
      // This will throw if QueryClient context is not available
      const client = useQueryClient()
      setQueryClient(client)

      if (client) {
        console.log("QueryClient is available:", client)
        setSuccess(true)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
      console.error("QueryClient error:", err)
    }
  }, [])

  if (error) {
    return (
      <div className="fixed bottom-4 right-4 z-50 p-2 bg-red-800 text-white text-xs rounded">
        ❌ QueryClient Error: {error || "Unknown error"}
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 p-2 bg-green-800 text-white text-xs rounded">
      {success ? "✅ QueryClient OK" : "⏳ Checking QueryClient..."}
    </div>
  )
}
