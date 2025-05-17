"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Home, BarChart, Users, Settings, LogOut } from "lucide-react"
import { formatAddress } from "@/lib/utils"
import { useAccount, useDisconnect } from "wagmi"

export function DashboardSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { address } = useAccount()
  const { disconnect } = useDisconnect()

  const sidebarItems = [
    {
      href: "/dashboard",
      icon: <Home className="h-4 w-4" />,
      label: "Dashboard",
    },
    {
      href: "/dashboard/analytics",
      icon: <BarChart className="h-4 w-4" />,
      label: "Analytics",
    },
    {
      href: "/dashboard/pools",
      icon: <Users className="h-4 w-4" />,
      label: "Pools",
    },
    {
      href: "/dashboard/referrals",
      icon: <Settings className="h-4 w-4" />,
      label: "Referrals",
    },
  ]

  const handleDisconnect = () => {
    disconnect()
  }

  return (
    <motion.aside
      className={`fixed top-0 left-0 h-full w-64 bg-black/80 backdrop-blur-md border-r border-purple-900/20 overflow-y-auto transition-transform ${
        isCollapsed ? "-translate-x-full" : ""
      }`}
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 flex items-center justify-between">
          <span className="text-lg font-bold">Dashboard</span>
          {/* Collapsible button - Removed for simplicity */}
        </div>

        <nav className="flex-1 px-2 py-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center space-x-3 py-2 px-4 rounded-lg hover:bg-purple-900/30 hover:text-white transition-colors"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-purple-900/20">
          {address && (
            <div className="text-sm text-gray-400 mb-2">
              Connected as: <span className="font-medium">{formatAddress(address)}</span>
            </div>
          )}
          <Button className="w-full justify-start" onClick={handleDisconnect} variant="ghost">
            <LogOut className="mr-2 h-4 w-4" />
            Disconnect
          </Button>
        </div>
      </div>
    </motion.aside>
  )
}

function Button({ className, onClick, variant, children }) {
  return (
    <button
      className={`flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default DashboardSidebar
