"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Home, Bell, Settings } from "lucide-react"
import { CustomConnectButton } from "@/components/web3/ConnectButton"
import { Logo } from "@/components/shared/logo"

export function DashboardHeader() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-30 w-full bg-black/80 backdrop-blur-md border-b border-purple-900/20"
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Logo size={32} href="/" />

          <Link
            href="/"
            className="hidden md:flex items-center text-sm text-gray-400 hover:text-white transition-colors"
          >
            <Home className="w-4 h-4 mr-1" />
            Back to Home
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2">
            <button className="p-2 rounded-full bg-purple-900/20 text-purple-400 hover:bg-purple-900/30 hover:text-purple-300 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-full bg-purple-900/20 text-purple-400 hover:bg-purple-900/30 hover:text-purple-300 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>

          <CustomConnectButton />
        </div>
      </div>
    </motion.header>
  )
}
