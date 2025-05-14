"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAccount } from "wagmi"
import { FuturisticLogo } from "@/components/FuturisticLogo"
import { CustomConnectButton } from "@/components/web3/ConnectButton"
import { NetworkSwitcher } from "@/components/web3/NetworkSwitcher"
import { LayoutGrid, LineChart, Wallet, Users, Settings, HelpCircle, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: React.ReactNode
  activePage?: string
}

export function DashboardLayout({ children, activePage = "overview" }: DashboardLayoutProps) {
  const { isConnected } = useAccount()
  const [mounted, setMounted] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutGrid },
    { id: "analytics", label: "Analytics", icon: LineChart },
    { id: "investments", label: "Investments", icon: Wallet },
    { id: "referrals", label: "Referrals", icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "help", label: "Help", icon: HelpCircle },
  ]

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-purple-900/30 backdrop-blur-md bg-black/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              className="lg:hidden p-2 rounded-md hover:bg-purple-900/20"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <FuturisticLogo size={32} withText={true} className="hidden sm:flex" />
            <FuturisticLogo size={32} withText={false} className="sm:hidden" />
          </div>

          <div className="flex items-center gap-2">
            <NetworkSwitcher />
            <CustomConnectButton />
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Sidebar - Desktop */}
        <aside className="w-64 border-r border-purple-900/30 bg-black/80 hidden lg:block">
          <nav className="p-4 space-y-1">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`/dashboard/${item.id === "overview" ? "" : item.id}`}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                  activePage === item.id
                    ? "bg-purple-900/30 text-purple-300 border-l-2 border-purple-500"
                    : "hover:bg-purple-900/10 text-gray-400 hover:text-gray-200",
                )}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
                {activePage === item.id && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute right-0 w-1 h-8 bg-gradient-to-b from-purple-400 to-blue-500 rounded-l"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </a>
            ))}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-500/20">
              <p className="text-sm text-purple-300 font-medium">5PT Finance</p>
              <p className="text-xs text-gray-400 mt-1">Secure Investment Platform</p>
            </div>
          </div>
        </aside>

        {/* Sidebar - Mobile */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0, x: -300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              className="fixed inset-0 z-40 lg:hidden"
            >
              <div className="absolute inset-0 bg-black/80" onClick={() => setSidebarOpen(false)} />
              <motion.aside
                className="absolute top-0 left-0 bottom-0 w-64 border-r border-purple-900/30 bg-black/95 z-50"
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
              >
                <div className="p-4 border-b border-purple-900/30 flex items-center gap-3">
                  <FuturisticLogo size={24} withText={true} />
                </div>
                <nav className="p-4 space-y-1">
                  {navItems.map((item) => (
                    <a
                      key={item.id}
                      href={`/dashboard/${item.id === "overview" ? "" : item.id}`}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                        activePage === item.id
                          ? "bg-purple-900/30 text-purple-300 border-l-2 border-purple-500"
                          : "hover:bg-purple-900/10 text-gray-400 hover:text-gray-200",
                      )}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon size={18} />
                      <span>{item.label}</span>
                    </a>
                  ))}
                </nav>
              </motion.aside>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 py-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
