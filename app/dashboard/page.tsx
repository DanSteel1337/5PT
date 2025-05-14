import { Suspense } from "react"
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton"
import DashboardClientWrapper from "./client-wrapper"

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardClientWrapper />
    </Suspense>
  )
}
