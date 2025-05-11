import type { Metadata } from "next"
import { EnhancedTokenChart } from "@/components/dashboard/enhanced-token-chart"
import { InvestmentAnalytics } from "@/components/dashboard/investment-analytics"
import { EnhancedReferralSystem } from "@/components/dashboard/enhanced-referral-system"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "5PT Investment Dashboard",
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <EnhancedTokenChart />

      <div className="grid grid-cols-1 gap-6">
        <InvestmentAnalytics />
        <EnhancedReferralSystem />
      </div>
    </div>
  )
}
