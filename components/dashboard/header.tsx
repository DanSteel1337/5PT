/**
 * @file components/dashboard/header.tsx
 * @description Dashboard header component with navigation and Web3 controls
 *
 * ⚠️ IMPORTANT ARCHITECTURE NOTES ⚠️
 *
 * 1. COMPONENT STRUCTURE:
 *    - This component includes navigation links, NetworkSwitcher, and CustomConnectButton
 *    - It should be included at the top of each dashboard page
 *    - It does NOT use a layout file (app/dashboard/layout.tsx was removed)
 *
 * 2. WEB3 COMPONENT RESPONSIBILITIES:
 *    - NetworkSwitcher: Displays current network and handles network switching
 *    - CustomConnectButton: Handles wallet connection and displays account address
 *    - These components have SEPARATE responsibilities to avoid duplication
 *
 * 3. NETWORK DISPLAY:
 *    - ONLY the NetworkSwitcher should display network information
 *    - The CustomConnectButton has been modified to NOT display network info
 *    - This prevents duplication of network information in the UI
 *
 * 4. USAGE GUIDELINES:
 *    - Include this component at the top of each dashboard page
 *    - Do not modify NetworkSwitcher or CustomConnectButton to duplicate functionality
 *    - Do not create alternative navigation or Web3 components
 *
 * @dependencies
 * - NetworkSwitcher: Displays current network and allows switching
 * - CustomConnectButton: Handles wallet connection (without network display)
 * - Logo: Displays the application logo
 */

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useAccount } from "wagmi"
import { NetworkSwitcher } from "@/components/web3/NetworkSwitcher"
import { Logo } from "@/components/shared/logo"
import { CustomConnectButton } from "@/components/web3/ConnectButton"

/**
 * DashboardHeader Component
 *
 * Main header for dashboard pages with navigation and Web3 controls.
 * Includes NetworkSwitcher for network display and CustomConnectButton
 * for wallet connection.
 */
export function DashboardHeader() {
  const [mounted, setMounted] = useState(false)
  const { isConnected } = useAccount()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <motion.header
      className="sticky top-0 z-50 w-full border-b border-purple-900/20 bg-black/80 backdrop-blur-md"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo size={36} className="py-1" />
        </div>

        {/* Main navigation links */}
        <div className="hidden md:flex items-center space-x-6">
          <NavLink href="/dashboard">Dashboard</NavLink>
          <NavLink href="/dashboard/analytics">Analytics</NavLink>
          <NavLink href="/dashboard/pools">Pools</NavLink>
          <NavLink href="/dashboard/referrals">Referrals</NavLink>
        </div>

        {/* Web3 components with separate responsibilities */}
        <div className="flex items-center gap-3">
          {/* NetworkSwitcher: ONLY component that should display network information */}
          <NetworkSwitcher />

          {/* CustomConnectButton: Handles wallet connection WITHOUT displaying network */}
          <CustomConnectButton />
        </div>
      </div>
    </motion.header>
  )
}

/**
 * NavLink Component
 *
 * Styled navigation link with hover effect.
 */
function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="relative text-gray-300 hover:text-white transition-colors group px-2 py-1">
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
    </Link>
  )
}
