import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { ClientWrapper } from "../client-wrapper"

export default function ReferralsPage() {
  return (
    <>
      <DashboardHeader title="Referral Program" />
      <ClientWrapper activePage="referrals" />
    </>
  )
}
