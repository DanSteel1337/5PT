"use client"

import { Bell, Menu, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Web3ConnectButton } from "@/components/web3-connect-button"

interface ModernHeaderProps {
  onMenuClick: () => void
}

export function ModernHeader({ onMenuClick }: ModernHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <header className="bg-black/20 backdrop-blur-lg border-b border-white/10 p-4 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="lg:hidden text-white" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
        </Button>
        <div className="hidden md:flex items-center gap-2">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-9 bg-black/20 border-white/10 w-[200px] focus:w-[300px] transition-all duration-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative text-white">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>
        <Web3ConnectButton />
      </div>
    </header>
  )
}
