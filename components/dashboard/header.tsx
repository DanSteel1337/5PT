"use client"

import { MobileSidebar } from "@/components/dashboard/sidebar"
import { MetaMaskConnect } from "@/components/metamask-connect"
import { WalletConnectSimple } from "@/components/wallet-connect-simple"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"

export function DashboardHeader() {
  const [isPreview, setIsPreview] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  // Check if we're in a preview environment
  useEffect(() => {
    setMounted(true)
    setIsPreview(window.location.hostname.includes("vusercontent.net"))
  }, [])

  // Only render wallet components after mounting to prevent hydration issues
  const WalletComponent = mounted ? isPreview ? <MetaMaskConnect /> : <WalletConnectSimple /> : null

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <MobileSidebar />
          <h1 className="text-xl font-bold md:text-2xl">
            <span className="hidden md:inline-block">Five Pillars Token</span>
            <span className="md:hidden">5PT</span>
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="mr-2"
          >
            {mounted && theme === "dark" ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            <span className="sr-only">Toggle theme</span>
          </Button>
          {WalletComponent}
        </div>
      </div>
    </header>
  )
}
