"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Droplets, Award, Users, Settings, ExternalLink, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
  isExternal?: boolean
  subItems?: { title: string; href: string }[]
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Investment Pools",
    href: "/pools",
    icon: Droplets,
    subItems: [
      { title: "Active Pools", href: "/pools/active" },
      { title: "My Investments", href: "/pools/my-investments" },
      { title: "Historical", href: "/pools/historical" },
    ],
  },
  {
    title: "Rewards",
    href: "/rewards",
    icon: Award,
  },
  {
    title: "Referrals",
    href: "/referrals",
    icon: Users,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [openCollapsible, setOpenCollapsible] = useState<string | null>(null)

  // Only render after client-side hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  // Set the active collapsible based on the current path
  useEffect(() => {
    if (!mounted) return

    navItems.forEach((item) => {
      if (item.subItems) {
        const isSubItemActive = item.subItems.some(
          (subItem) => pathname === subItem.href || pathname.startsWith(subItem.href + "/"),
        )

        if (isSubItemActive) {
          setOpenCollapsible(item.title)
        }
      }
    })
  }, [pathname, mounted])

  if (!mounted) return null

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden" onClick={onClose} />}

      <aside
        className={cn(
          "fixed top-16 bottom-0 left-0 z-40 w-64 glass border-r border-border/40 transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="h-full flex flex-col overflow-y-auto py-4">
          <nav className="flex-1 px-4 space-y-1">
            {navItems.map((item) => (
              <div key={item.title} className="py-1">
                {item.subItems ? (
                  <Collapsible
                    open={openCollapsible === item.title}
                    onOpenChange={(open) => {
                      setOpenCollapsible(open ? item.title : null)
                    }}
                  >
                    <CollapsibleTrigger asChild>
                      <button
                        className={cn(
                          "flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors",
                          "hover:bg-muted/50 hover:text-primary",
                          pathname.startsWith(item.href) || openCollapsible === item.title
                            ? "bg-muted text-primary"
                            : "text-muted-foreground",
                        )}
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        <span>{item.title}</span>
                        <ChevronDown
                          className={cn(
                            "ml-auto h-4 w-4 transition-transform",
                            openCollapsible === item.title && "transform rotate-180",
                          )}
                        />
                      </button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pl-9 mt-1 space-y-1">
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.title}
                          href={subItem.href}
                          className={cn(
                            "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                            "hover:bg-muted/50 hover:text-primary",
                            pathname === subItem.href ? "bg-muted/30 text-primary" : "text-muted-foreground",
                          )}
                        >
                          {subItem.title}
                        </Link>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                      "hover:bg-muted/50 hover:text-primary",
                      pathname === item.href ? "bg-muted text-primary" : "text-muted-foreground",
                    )}
                    target={item.isExternal ? "_blank" : undefined}
                    rel={item.isExternal ? "noopener noreferrer" : undefined}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.title}</span>
                    {item.isExternal && <ExternalLink className="ml-auto h-3 w-3" />}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          <div className="px-4 mt-6">
            <div className="p-4 rounded-lg bg-muted/30 border border-border/40">
              <h4 className="font-medium text-sm mb-2 text-primary">Need Help?</h4>
              <p className="text-xs text-muted-foreground mb-3">
                Have questions or need assistance with your investments?
              </p>
              <Link href="/support" className="text-xs text-primary hover:underline">
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
