"use client"

import { Suspense } from "react"
import { FuturisticDashboard } from "@/components/dashboard/FuturisticDashboard"
import { PageLoading } from "@/components/ui/page-loading"

export default function ClientDashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<PageLoading />}>
        <FuturisticDashboard />
      </Suspense>
    </div>
  )
}
