"use client"

import { ModernMobileSidebar } from "@/components/dashboard/modern-sidebar"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { MoonIcon, SunIcon, BellIcon, Cpu } from "lucide-react"
import { useTheme } from "next-themes"
import { Badge } from "@/components/ui/badge"
import { WalletConnect } from "@/components/wallet-connect"

export function ModernHeader() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  // Client-side only rendering to avoid hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="sticky top-0 z-40 border-b border-purple-900/20 bg-black/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <ModernMobileSidebar />
          <h1 className="text-xl font-bold md:text-2xl">
            <span className="hidden md:inline-block">Five Pillars Dashboard</span>
            <span className="md:hidden">5PT Dashboard</span>
          </h1>
          <Badge
            variant="outline"
            className="hidden md:flex bg-purple-900/20 text-purple-300 border-purple-500/30 ml-2"
          >
            <Cpu className="mr-1 h-3 w-3" /> AI-Enhanced
          </Badge>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" className="relative border-purple-500/30 hover:bg-purple-900/20">
            <BellIcon className="h-5 w-5 text-purple-300" />
            <span className="sr-only">Notifications</span>
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-purple-600 text-white">
              3
            </Badge>
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="border-purple-500/30 hover:bg-purple-900/20"
          >
            {mounted && theme === "dark" ? (
              <SunIcon className="h-5 w-5 text-purple-300" />
            ) : (
              <MoonIcon className="h-5 w-5 text-purple-300" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>

          <WalletConnect />
        </div>
      </div>
    </header>
  )
}
