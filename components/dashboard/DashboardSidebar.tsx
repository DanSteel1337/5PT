"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, BarChart2, Layers, Users, Settings, HelpCircle, ChevronRight } from "lucide-react"

export function DashboardSidebar() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const navItems = [
    {
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: "Overview",
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      icon: <BarChart2 className="h-5 w-5" />,
      label: "Analytics",
      href: "/dashboard/analytics",
      active: pathname === "/dashboard/analytics",
    },
    {
      icon: <Layers className="h-5 w-5" />,
      label: "Investments",
      href: "/dashboard/investments",
      active: pathname === "/dashboard/investments",
    },
    {
      icon: <Users className="h-5 w-5" />,
      label: "Referrals",
      href: "/dashboard/referrals",
      active: pathname === "/dashboard/referrals",
    },
  ]

  return (
    <div className="w-64 min-h-[calc(100vh-5rem)] border-r border-purple-900/20 p-4 hidden md:block">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-2">Dashboard</h2>
        <p className="text-sm text-gray-400">Manage your investments</p>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
              item.active
                ? "bg-purple-900/30 text-purple-300 border-l-4 border-purple-500"
                : "text-gray-400 hover:bg-purple-900/10 hover:text-gray-200"
            }`}
          >
            <div className="flex items-center">
              {item.icon}
              <span className="ml-3">{item.label}</span>
            </div>
            {item.active && <ChevronRight className="h-4 w-4" />}
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-8 left-4 right-4 space-y-1">
        <Link
          href="/dashboard/settings"
          className="flex items-center px-4 py-3 rounded-lg transition-colors text-gray-400 hover:bg-purple-900/10 hover:text-gray-200"
        >
          <Settings className="h-5 w-5" />
          <span className="ml-3">Settings</span>
        </Link>
        <Link
          href="/dashboard/help"
          className="flex items-center px-4 py-3 rounded-lg transition-colors text-gray-400 hover:bg-purple-900/10 hover:text-gray-200"
        >
          <HelpCircle className="h-5 w-5" />
          <span className="ml-3">Help & Support</span>
        </Link>
      </div>
    </div>
  )
}
