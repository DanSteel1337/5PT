import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { ClientWrapper } from "../client-wrapper"

export default function InvestmentsPage() {
  return (
    <>
      <DashboardHeader title="Investment Pools" />
      <ClientWrapper activePage="investments" />
    </>
  )
}
