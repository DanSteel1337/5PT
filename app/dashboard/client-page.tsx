"use client"

import { DashboardContent } from "@/components/dashboard/DashboardContent"
import InvestmentActions from "@/components/dashboard/InvestmentActions"

export default function ClientDashboardPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <DashboardContent />
        </div>
        <div className="lg:col-span-1">
          <InvestmentActions />
        </div>
      </div>
      {/* This file might be using mock data with "SOLS" as the token symbol */}
      {/* This file might be importing components with hardcoded token symbols */}
    </div>
  )
}
