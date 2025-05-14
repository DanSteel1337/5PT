"use client"

import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import { Clock, Wallet, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CyberButton } from "@/components/ui/cyber-button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DashboardSidebar } from "./DashboardSidebar"

interface DashboardHeaderProps {
  title: string
}

export function DashboardHeader({ title }: DashboardHeaderProps) {
  const { address, isConnected } = useAccount()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Format address for display
  const formattedAddress = address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : ""

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-8">
        <div className="flex items-center">
          {/* Mobile sidebar trigger */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden mr-4">
              <Button variant="outline" size="icon" className="h-10 w-10">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72">
              <div className="py-4">
                <DashboardSidebar />
              </div>
            </SheetContent>
          </Sheet>

          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 via-blue-500 to-purple-400 bg-clip-text text-transparent animate-gradient bg-size-200">
              {title}
            </h1>
            {isConnected && (
              <p className="text-gray-400 mt-2 flex items-center">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                Connected as {formattedAddress} • Last update: just now
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          <Button
            variant="outline"
            className="border-purple-500/50 text-purple-100 hover:bg-purple-900/20 h-10 md:h-11 px-4 md:px-6"
          >
            <Clock className="mr-2 md:mr-3 h-4 w-4" />
            <span className="hidden sm:inline">Transaction</span> History
          </Button>
          <CyberButton variant="primary" size="md" className="h-10 md:h-11 px-4 md:px-6">
            <Wallet className="mr-2 md:mr-3 h-4 w-4" />
            Deposit Funds
          </CyberButton>
        </div>
      </div>
    </div>
  )
}
