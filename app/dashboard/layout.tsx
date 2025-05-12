import type React from "react"
import type { Metadata } from "next"
import { Web3Providers } from "@/components/web3-providers"
import { SafeModernSidebar } from "@/components/dashboard/dynamic-sidebar"

export const metadata: Metadata = {
  title: "5PT Dashboard - Five Pillars Token",
  description: "Investment dashboard for the Five Pillars Token (5PT)",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Web3Providers>
      <div className="flex min-h-screen flex-col md:flex-row">
        <aside className="w-full md:w-64 shrink-0 border-r border-border/40 hidden md:block">
          <SafeModernSidebar />
        </aside>
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </Web3Providers>
  )
}
