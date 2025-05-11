import type { Metadata } from "next"
import { DashboardOverview } from "@/components/dashboard/dashboard-overview"

export const metadata: Metadata = {
  title: "5PT Investment Dashboard",
  description: "Comprehensive dashboard for 5PT token investors",
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <DashboardOverview />
    </div>
  )
}
