import type React from "react"
import { Navbar } from "@/components/Navbar"
import { TestRainbowKitButton } from "@/components/web3/TestRainbowKitButton"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">{children}</div>
      <TestRainbowKitButton />
    </div>
  )
}
