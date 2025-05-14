"use client"

import { useState, useEffect } from "react"
import { ClientDashboard } from "@/components/dashboard/client-dashboard"
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton"

export default function DashboardPage() {
  // Client-side mounting check to prevent hydration errors
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <DashboardSkeleton />
  }

  return <ClientDashboard />
}
