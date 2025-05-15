import { Suspense } from "react"
import { FuturisticDashboardSkeleton } from "@/components/dashboard/FuturisticDashboardSkeleton"
import ClientDashboardPage from "./client-page"

export default function DashboardPage() {
  return (
    <Suspense fallback={<FuturisticDashboardSkeleton />}>
      <ClientDashboardPage />
    </Suspense>
  )
}
