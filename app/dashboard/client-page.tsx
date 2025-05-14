"use client"

import { useEffect, useState } from "react"
import { DashboardContent } from "@/components/dashboard/DashboardContent"
import { Web3ProviderWrapper } from "@/components/providers/Web3ProviderWrapper"
import { QueryClientDebug } from "@/components/debug/QueryClientDebug"

export default function DashboardClientPage() {
  const [showDebug, setShowDebug] = useState(false)

  useEffect(() => {
    // Only show debug in development or if URL has debug parameter
    const isDebug = process.env.NODE_ENV === "development" || window.location.search.includes("debug=true")
    setShowDebug(isDebug)
  }, [])

  return (
    <>
      <Web3ProviderWrapper>
        <DashboardContent />
      </Web3ProviderWrapper>

      {/* Add debug component to help diagnose context issues */}
      {showDebug && <QueryClientDebug />}
    </>
  )
}
