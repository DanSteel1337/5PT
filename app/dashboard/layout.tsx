import type React from "react"
import { Navbar } from "@/components/Navbar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">{children}</div>
    </div>
  )
}
