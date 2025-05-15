import type React from "react"
import { InvestmentDataProvider } from "@/providers/InvestmentDataProvider"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <InvestmentDataProvider>{children}</InvestmentDataProvider>
    </div>
  )
}
// This file might be setting layout context with token symbols
