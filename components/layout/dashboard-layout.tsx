"use client"

import { type ReactNode, useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  Coins,
  Award,
  Users,
  Settings,
  Menu,
  X,
  LogOut,
  ChevronDown,
  ExternalLink,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAccount, useDisconnect, useSwitchChain } from "wagmi"
import { formatAddress } from "@/lib/utils"
import { PredictiveActionButton } from "@/components/ui/predictive-action-button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { bsc, bscTestnet } from "wagmi/chains"
import { toast } from "@/components/ui/use-toast"
import { ConnectWalletButton } from "@/components/ui/connect-wallet-button"

interface DashboardLayoutProps {
  children: ReactNode
}

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Investment Pools",
    href: "/pools",
    icon: Coins,
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

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { address, isConnected, chain } = useAccount()
  const { disconnect } = useDisconnect()
  const { switchChain, isPending: isSwitchingNetwork } = useSwitchChain()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleDisconnect = () => {
    disconnect()
    toast({
      title: "Wallet disconnected",
      description: "You have successfully disconnected your wallet.",
    })
  }

  const handleSwitchNetwork = (chainId: number) => {
    if (switchChain) {
      switchChain({ chainId })
    }
  }

  const getBscScanUrl = (address: string) => {
    const baseUrl = chain?.id === bsc.id ? "https://bscscan.com/address/" : "https://testnet.bscscan.com/address/"
    return `${baseUrl}${address}`
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header with Connect Wallet button */}
      <header className="fixed top-0 right-0 z-50 p-4 flex justify-end w-full md:w-[calc(100%-16rem)]">
        {!isConnected && <ConnectWalletButton />}
      </header>

      {/* Mobile menu button */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-black/60 backdrop-blur-md border border-amber-600/30 text-amber-300"
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-black/60 backdrop-blur-xl border-r border-amber-600/20 transition-transform duration-300 ease-in-out",
          "md:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-amber-600/20">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10">
                <Image
                  src="/images/5pt-logo.png"
                  alt="Five Pillars Token"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              </div>
              <span className="text-xl font-bold text-amber-300">Five Pillars</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href

              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                      "hover:bg-amber-900/20",
                      isActive ? "bg-amber-900/20 text-amber-300" : "text-gray-300",
                    )}
                  >
                    <item.icon size={20} />
                    <span>{item.title}</span>
                    {isActive && (
                      <motion.div
                        className="absolute left-0 w-1 h-8 bg-amber-500 rounded-r-full"
                        layoutId="activeNav"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </div>
                </Link>
              )
            })}
          </nav>

          {/* Predictive Action Button */}
          <div className="p-4">
            <PredictiveActionButton />
          </div>

          {/* User section */}
          <div className="p-4 border-t border-amber-600/20">
            {mounted && isConnected && address ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center justify-between cursor-pointer p-2 rounded-lg hover:bg-amber-900/20">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-amber-700 flex items-center justify-center">
                        <span className="text-xs font-bold text-white">{address.slice(2, 4)}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{formatAddress(address)}</p>
                        {chain && <p className="text-xs text-amber-300/70">{chain.name}</p>}
                      </div>
                    </div>
                    <ChevronDown size={16} className="text-amber-300/70" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-black/90 backdrop-blur-xl border border-amber-600/30 text-white">
                  <DropdownMenuLabel>Wallet Options</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-amber-600/20" />
                  <DropdownMenuItem
                    className="flex items-center gap-2 cursor-pointer hover:bg-amber-900/20 focus:bg-amber-900/20"
                    onClick={() => {
                      navigator.clipboard.writeText(address)
                      toast({
                        title: "Address copied",
                        description: "Wallet address copied to clipboard",
                      })
                    }}
                  >
                    <span>Copy Address</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex items-center gap-2 cursor-pointer hover:bg-amber-900/20 focus:bg-amber-900/20"
                    onClick={() => {
                      window.open(getBscScanUrl(address), "_blank")
                    }}
                  >
                    <span>View on BscScan</span>
                    <ExternalLink size={12} className="ml-1" />
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-amber-600/20" />
                  <DropdownMenuLabel>Switch Network</DropdownMenuLabel>
                  <DropdownMenuItem
                    className="flex items-center gap-2 cursor-pointer hover:bg-amber-900/20 focus:bg-amber-900/20"
                    onClick={() => handleSwitchNetwork(bscTestnet.id)}
                    disabled={isSwitchingNetwork || chain?.id === bscTestnet.id}
                  >
                    <span>BSC Testnet</span>
                    {chain?.id === bscTestnet.id && <span className="ml-auto text-xs text-amber-300">Active</span>}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex items-center gap-2 cursor-pointer hover:bg-amber-900/20 focus:bg-amber-900/20"
                    onClick={() => handleSwitchNetwork(bsc.id)}
                    disabled={isSwitchingNetwork || chain?.id === bsc.id}
                  >
                    <span>BSC Mainnet</span>
                    {chain?.id === bsc.id && <span className="ml-auto text-xs text-amber-300">Active</span>}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-amber-600/20" />
                  <DropdownMenuItem
                    className="flex items-center gap-2 text-red-400 cursor-pointer hover:bg-red-900/20 focus:bg-red-900/20"
                    onClick={handleDisconnect}
                  >
                    <LogOut size={16} />
                    <span>Disconnect</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className={cn("min-h-screen pt-16 transition-all duration-300 ease-in-out", "md:ml-64")}>
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="container mx-auto p-4 md:p-8"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
