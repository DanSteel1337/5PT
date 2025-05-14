import type { ReactNode } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardFooter } from "@/components/dashboard/dashboard-footer"

export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950/10 to-black">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">{children}</main>
      <DashboardFooter />
    </div>
  )
}
