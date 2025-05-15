"use client"

import { useState, useEffect } from "react"
import { useChainId, useSwitchChain } from "wagmi"
import { bsc, bscTestnet } from "wagmi/chains"
import { CyberButton } from "@/components/ui/cyber-button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"

export function NetworkSwitcher() {
  const [mounted, setMounted] = useState(false)
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const chains = [
    { id: bsc.id, name: "BSC Mainnet", icon: "🟡" },
    { id: bscTestnet.id, name: "BSC Testnet", icon: "🔵" },
  ]

  const currentChain = chains.find((c) => c.id === chainId) || chains[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <CyberButton variant="outline" size="sm" className="text-purple-400">
          {currentChain.icon} {currentChain.name}
          <ChevronDown className="ml-2 h-4 w-4" />
        </CyberButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-black/90 border border-purple-500/30">
        {chains.map((chain) => (
          <DropdownMenuItem
            key={chain.id}
            onClick={() => switchChain({ chainId: chain.id })}
            className={`cursor-pointer ${
              chain.id === chainId ? "bg-purple-900/30 text-purple-400" : "hover:bg-purple-900/20"
            }`}
          >
            <span className="mr-2">{chain.icon}</span>
            {chain.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default NetworkSwitcher

// This file might be setting network-specific token symbols
