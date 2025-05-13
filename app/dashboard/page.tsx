import { Suspense } from "react"
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton"
import ClientDashboardPage from "./client-page"

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <ClientDashboardPage />
    </Suspense>
  )
}
