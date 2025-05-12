import type React from "react"
import { ModernSidebar } from "@/components/dashboard/modern-sidebar"
import { SmartHeader } from "@/components/dashboard/smart-header"
import type { Metadata } from "next"
import { Web3Providers } from "@/components/web3-providers"

export const metadata: Metadata = {
  title: "5PT Dashboard - Five Pillars Token",
  description: "Next-gen investment platform for the Five Pillars Token (5PT)",
}

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <Web3Providers>
      <div className="flex min-h-screen flex-col circuit-bg">
        <SmartHeader />
        <div className="flex-1 items-start md:grid md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr]">
          <aside className="fixed top-16 z-30 hidden h-[calc(100vh-4rem)] w-full shrink-0 overflow-y-auto border-r border-border/50 md:sticky md:block">
            <ModernSidebar />
          </aside>
          <main className="flex w-full flex-col">{children}</main>
        </div>
      </div>
    </Web3Providers>
  )
}
