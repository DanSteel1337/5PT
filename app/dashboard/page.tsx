import { Suspense } from "react"
import DashboardClient from "./client-page"
import { PageLoading } from "@/components/ui/page-loading"

export const metadata = {
  title: "5PT Investment Command Center | Your Crypto Growth Dashboard",
  description:
    "Track your 5PT investments, rewards, and referrals in real-time with our advanced visualization dashboard.",
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <DashboardClient />
    </Suspense>
  )
}
