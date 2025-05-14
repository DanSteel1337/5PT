"use client"

import dynamic from "next/dynamic"
import { PageLoading } from "@/components/ui/page-loading"

// Dynamically import the client page with SSR disabled
const DashboardClientPage = dynamic(() => import("./client-page"), {
  ssr: false,
  loading: () => <PageLoading label="Loading dashboard..." />,
})

export default function DashboardClientWrapper() {
  return <DashboardClientPage />
}
