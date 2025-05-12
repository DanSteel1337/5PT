"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  BarChart3,
  Coins,
  CreditCard,
  History,
  Home,
  Menu,
  PieChart,
  Settings,
  Users,
  Layers,
  TrendingUp,
  Share2,
  HelpCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAccount } from "wagmi"
import { ModernMobileSidebar } from "./modern-sidebar"
import { WalletConnector } from "@/components/wallet-connector"
import { shouldUseMockData } from "@/lib/environment"
import { useInvestmentManager, useEnsResolver } from "@/lib/contract-hooks"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string | number
  isNew?: boolean
  variant?: "primary" | "secondary" | "accent"
}

interface ModernHeaderProps {
  className?: string
}

export function ModernHeader({ className }: ModernHeaderProps) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const { address, isConnected } = useAccount()
  const useMockData = shouldUseMockData()

  // Use the abstracted hooks from contract-hooks.ts
  const { usePoolCount } = useInvestmentManager()
  const { useEnsName } = useEnsResolver()

  // Get pool count with proper error handling
  const { data: poolCount, isLoading: isLoadingPoolCount } = usePoolCount({
    enabled: mounted && !useMockData,
  })

  // Get ENS name if available
  const { data: ensName, isLoading: isLoadingEns } = useEnsName(address, {
    enabled: isConnected && !!address && mounted && !useMockData,
  })

  // Client-side only rendering to avoid hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  // Safely handle pool count with fallbacks
  const displayPoolCount = useMockData ? "7+" : poolCount ? Number(poolCount).toString() : "7+"

  const navItems: NavItem[] = [
    {
      title: "Overview",
      href: "/dashboard",
      icon: Home,
      variant: "primary",
    },
    {
      title: "Investment Pools",
      href: "/dashboard/pools",
      icon: Layers,
      badge: displayPoolCount,
      isNew: true,
      variant: "secondary",
    },
    {
      title: "My Investments",
      href: "/dashboard/investments",
      icon: Coins,
      variant: "primary",
    },
    {
      title: "Transactions",
      href: "/dashboard/transactions",
      icon: History,
      variant: "accent",
    },
    {
      title: "Referrals",
      href: "/dashboard/referrals",
      icon: Users,
      variant: "secondary",
    },
    {
      title: "Analytics",
      href: "/dashboard/analytics",
      icon: BarChart3,
      variant: "primary",
    },
    {
      title: "Tokenomics",
      href: "/dashboard/tokenomics",
      icon: PieChart,
      variant: "accent",
    },
    {
      title: "Token Price",
      href: "/dashboard/price",
      icon: TrendingUp,
      variant: "secondary",
    },
    {
      title: "Wallet",
      href: "/dashboard/wallet",
      icon: CreditCard,
      variant: "primary",
    },
  ]

  const secondaryNavItems: NavItem[] = [
    {
      title: "Share & Earn",
      href: "/dashboard/share",
      icon: Share2,
      variant: "secondary",
    },
    {
      title: "Help & Support",
      href: "/dashboard/help",
      icon: HelpCircle,
      variant: "accent",
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
      variant: "primary",
    },
  ]

  return (
    <header className={cn("sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm", className)}>
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="p-0 lg:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full sm:w-64">
            <ModernMobileSidebar />
          </SheetContent>
        </Sheet>
        <Link href="/dashboard" className="hidden lg:flex items-center space-x-2">
          <img src="/images/5pt-logo.png" alt="5PT Logo" className="h-8 w-8" />
          <span className="font-bold">5PT Dashboard</span>
        </Link>
        <div className="flex-1 items-center justify-between space-x-2 sm:flex">
          <div className="hidden sm:flex flex-1 items-center space-x-2 text-sm text-muted-foreground">
            <p>Next-gen investment platform for the Five Pillars Token (5PT)</p>
          </div>
          <div className="flex items-center space-x-2">
            <WalletConnector />
          </div>
        </div>
      </div>
    </header>
  )
}

export function ModernMobileHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="p-0 lg:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full sm:w-64">
            <ModernMobileSidebar />
          </SheetContent>
        </Sheet>
        <Link href="/dashboard" className="flex items-center space-x-2">
          <img src="/images/5pt-logo.png" alt="5PT Logo" className="h-8 w-8" />
          <span className="font-bold">5PT Dashboard</span>
        </Link>
        <div className="flex-1 items-center justify-between space-x-2 sm:flex">
          <div className="hidden sm:flex flex-1 items-center space-x-2 text-sm text-muted-foreground">
            <p>Next-gen investment platform for the Five Pillars Token (5PT)</p>
          </div>
          <div className="flex items-center space-x-2">
            <WalletConnector />
          </div>
        </div>
      </div>
    </header>
  )
}
