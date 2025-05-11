"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BarChart3, Coins, CreditCard, History, Home, Menu, PieChart, Settings, Users, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const navItems: NavItem[] = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Investments",
    href: "/dashboard/investments",
    icon: Coins,
  },
  {
    title: "Transactions",
    href: "/dashboard/transactions",
    icon: History,
  },
  {
    title: "Referrals",
    href: "/dashboard/referrals",
    icon: Users,
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    title: "Tokenomics",
    href: "/dashboard/tokenomics",
    icon: PieChart,
  },
  {
    title: "Wallet",
    href: "/dashboard/wallet",
    icon: CreditCard,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <div className="flex items-center justify-center mb-6">
            <Link href="/dashboard">
              <img src="/images/5pt-logo.png" alt="5PT Logo" className="h-16 w-16" />
            </Link>
          </div>
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">Dashboard</h2>
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                  pathname === item.href ? "bg-accent text-accent-foreground" : "transparent",
                  pathname === item.href && "border-l-4 border-gold-500",
                )}
              >
                <item.icon className={cn("mr-2 h-4 w-4", pathname === item.href ? "text-gold-500" : "")} />
                <span>{item.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function MobileSidebar() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <div className="flex items-center justify-between border-b px-4 py-2">
          <Link href="/dashboard" onClick={() => setOpen(false)}>
            <div className="flex items-center gap-2">
              <img src="/images/5pt-logo.png" alt="5PT Logo" className="h-8 w-8" />
              <span className="font-bold">Five Pillars Token</span>
            </div>
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
        <ScrollArea className="h-[calc(100vh-4rem)]">
          <Sidebar />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
