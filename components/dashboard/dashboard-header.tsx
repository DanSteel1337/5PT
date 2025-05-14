"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { CustomConnectButton } from "@/components/web3/ConnectButton"
import { Logo } from "@/components/shared/logo"
import { ChevronRight, Home, LayoutDashboard, Users, Award, Zap } from "lucide-react"

export function DashboardHeader() {
  const [mounted, setMounted] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    setMounted(true)

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (!mounted) return null

  return (
    <motion.header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-black/80 backdrop-blur-md py-3 shadow-lg" : "bg-transparent py-5"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Logo size={36} className="py-1" href="/" />

          <nav className="hidden md:flex items-center">
            <div className="flex items-center text-sm text-gray-400">
              <Link href="/" className="hover:text-white transition-colors">
                <Home className="h-4 w-4" />
                <span className="sr-only">Home</span>
              </Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              <span className="text-white">Dashboard</span>
            </div>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <nav className="hidden md:flex">
            <ul className="flex items-center gap-6">
              <NavItem href="/dashboard" icon={<LayoutDashboard className="h-4 w-4 mr-1" />} label="Overview" active />
              <NavItem href="/dashboard/referrals" icon={<Users className="h-4 w-4 mr-1" />} label="Referrals" />
              <NavItem href="/dashboard/rewards" icon={<Zap className="h-4 w-4 mr-1" />} label="Rewards" />
              <NavItem href="/dashboard/achievements" icon={<Award className="h-4 w-4 mr-1" />} label="Achievements" />
            </ul>
          </nav>

          <CustomConnectButton />
        </div>
      </div>
    </motion.header>
  )
}

function NavItem({ href, icon, label, active = false }) {
  return (
    <li>
      <Link
        href={href}
        className={`flex items-center px-3 py-1.5 rounded-lg text-sm transition-colors ${
          active
            ? "bg-purple-900/30 text-white border border-purple-500/30"
            : "text-gray-400 hover:text-white hover:bg-purple-900/20"
        }`}
      >
        {icon}
        <span>{label}</span>
      </Link>
    </li>
  )
}
