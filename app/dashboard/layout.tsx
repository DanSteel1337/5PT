import type React from "react"
import { Navbar } from "@/components/Navbar"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Home } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950/10 to-black">
      <Navbar />
      <div className="pt-20 flex">
        {/* Dashboard Sidebar */}
        <DashboardSidebar />

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Breadcrumb Navigation */}
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">
                  <Home className="h-4 w-4 mr-1" />
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Dashboard Content */}
          {children}
        </div>
      </div>
    </div>
  )
}
