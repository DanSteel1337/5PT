"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, Menu } from "lucide-react"
import { ConnectButton } from "@/components/web3/ConnectButton"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  toggleSidebar: () => void
}

export function Header({ toggleSidebar }: HeaderProps) {
  const [mounted, setMounted] = useState(false)

  // Only render after client-side hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 glass border-b border-purple-500/20">
      <div className="container h-full flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="lg:hidden hover:bg-purple-500/10 hover:text-purple-400"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-8 h-8 rounded-full overflow-hidden shadow-lg shadow-purple-500/20">
              <Image
                src="/images/5pt-logo.png"
                alt="Five Pillars Token"
                width={32}
                height={32}
                className="object-cover"
              />
            </div>
            <span className="font-bold text-xl hidden md:inline-block animate-glow bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
              Five Pillars
            </span>
          </Link>
        </div>

        <div className="hidden md:flex relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search assets, pools..."
            className="pl-10 bg-muted/50 border-purple-500/20 focus-visible:border-purple-500/50 focus-visible:ring-purple-500/20"
          />
        </div>

        <div className="flex items-center gap-4">
          <ConnectButton />
        </div>
      </div>
    </header>
  )
}
