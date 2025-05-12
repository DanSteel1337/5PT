"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
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
  X,
  Layers,
  TrendingUp,
  Share2,
  HelpCircle,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { shouldUseMockData } from "@/lib/environment"
import { usePoolCount } from "@/lib/contract-hooks"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string | number
  isNew?: boolean
  variant?: "primary" | "secondary" | "accent"
}

export function ModernSidebar({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const useMockData = shouldUseMockData()

  // Client-side only rendering to avoid hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  // Only call hooks when the component is mounted
  const poolCountResult = usePoolCount({
    enabled: !useMockData,
  })

  // Safely handle pool count with fallbacks
  const displayPoolCount = useMemo(() => {
    if (!mounted || poolCountResult.isLoading) return "..."
    if (useMockData || !poolCountResult.data || poolCountResult.isError) return "7+"

    try {
      return Number(poolCountResult.data).toString()
    } catch (error) {
      console.error("Error processing pool count:", error)
      return "7+"
    }
  }, [mounted, poolCountResult.isLoading, useMockData, poolCountResult.data, poolCountResult.isError])

  // Memoize nav items to prevent unnecessary re-renders
  const navItems: NavItem[] = useMemo(
    () => [
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
    ],
    [displayPoolCount],
  )

  const secondaryNavItems: NavItem[] = useMemo(
    () => [
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
    ],
    [],
  )

  return (
    <div className={cn("pb-12 circuit-bg", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <div className="flex items-center justify-center mb-6">
            <Link href="/dashboard" className="flex items-center space-x-2 relative">
              <div className="relative">
                <img src="/images/5pt-logo.png" alt="5PT Logo" className="h-12 w-12 z-10 relative" />
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-md animate-pulse-glow"></div>
              </div>
              <span className="text-xl font-bold cyber-text">Five Pillars</span>
            </Link>
          </div>
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-all duration-300",
                  pathname === item.href
                    ? `bg-${item.variant || "primary"}/10 text-${item.variant || "primary"} border-l-4 border-${item.variant || "primary"}`
                    : "hover:bg-muted",
                  pathname === item.href && "text-glow",
                )}
              >
                <div className="flex items-center">
                  <item.icon
                    className={cn(
                      "mr-2 h-4 w-4",
                      pathname === item.href ? `text-${item.variant || "primary"}` : "text-muted-foreground",
                    )}
                  />
                  <span>{item.title}</span>
                </div>
                {item.badge && (
                  <Badge
                    variant="outline"
                    className={cn(
                      "ml-auto",
                      item.isNew
                        ? `bg-${item.variant || "primary"} text-${item.variant || "primary"}-foreground`
                        : "bg-muted",
                      poolCountResult.isLoading && !useMockData ? "animate-pulse" : "",
                    )}
                  >
                    {item.badge}
                  </Badge>
                )}
              </Link>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-border/50">
            <h3 className="mb-2 px-2 text-xs font-semibold text-muted-foreground tracking-wider uppercase">
              More Options
            </h3>
            <div className="space-y-1">
              {secondaryNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-all duration-300",
                    pathname === item.href
                      ? `bg-${item.variant || "primary"}/10 text-${item.variant || "primary"} border-l-4 border-${item.variant || "primary"}`
                      : "hover:bg-muted",
                    pathname === item.href && "text-glow",
                  )}
                >
                  <item.icon
                    className={cn(
                      "mr-2 h-4 w-4",
                      pathname === item.href ? `text-${item.variant || "primary"}` : "text-muted-foreground",
                    )}
                  />
                  <span>{item.title}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-6">
            <div className="rounded-xl border border-primary/20 bg-card/30 p-4 backdrop-blur-sm">
              <div className="flex items-center mb-2">
                <Zap className="h-5 w-5 text-primary mr-2" />
                <h3 className="font-medium text-sm">AI Insights</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                Market analysis suggests a 12% increase in token value over the next 24 hours.
              </p>
              <Button variant="outline" size="sm" className="w-full border-primary/50 text-primary hover:bg-primary/10">
                View Analysis
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ModernMobileSidebar() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden border-primary/50 hover:bg-primary/10">
          <Menu className="h-5 w-5 text-primary" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 border-primary/30 bg-background/95 backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-border/50 px-4 py-2">
          <Link href="/dashboard" onClick={() => setOpen(false)} className="flex items-center space-x-2">
            <div className="relative">
              <img src="/images/5pt-logo.png" alt="5PT Logo" className="h-8 w-8 z-10 relative" />
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-md"></div>
            </div>
            <span className="font-bold cyber-text">Five Pillars Token</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(false)}
            className="text-primary hover:bg-primary/10"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
        <ScrollArea className="h-[calc(100vh-4rem)]">
          <ModernSidebar />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
