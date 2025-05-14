import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { ClientWrapper } from "../client-wrapper"

export default function AnalyticsPage() {
  return (
    <>
      <DashboardHeader title="Analytics Dashboard" />
      <ClientWrapper activePage="analytics" />
    </>
  )
}
