/**
 * @file NetworkSwitcher.tsx
 * @description Network switching component for BSC networks
 *
 * This component provides a dropdown interface for switching between
 * BSC Mainnet and Testnet. It uses wagmi hooks for chain detection
 * and switching functionality.
 *
 * @dependencies
 * - wagmi: Provides chain detection and switching hooks
 * - components/ui/CyberButton: Used for styling the trigger button
 * - components/ui/dropdown-menu: Used for the dropdown interface
 *
 * @related
 * - components/web3/ConnectButton.tsx: Often used alongside this component
 * - lib/wagmi-config.ts: Provides chain configuration
 */

"use client"

import { useState, useEffect } from "react"
import { useChainId, useSwitchChain } from "wagmi"
import { bsc, bscTestnet } from "wagmi/chains"
import { CyberButton } from "@/components/ui/CyberButton"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"

/**
 * NetworkSwitcher Component
 *
 * A dropdown component that allows users to switch between BSC Mainnet and Testnet.
 * Shows the current network and provides options to switch to other supported networks.
 *
 * @example
 * ```tsx
 * <NetworkSwitcher />
 * ```
 */
export function NetworkSwitcher() {
  // CRITICAL: Mounting check to prevent hydration errors
  const [mounted, setMounted] = useState(false)

  // Get current chain ID and switch chain function from wagmi
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render during SSR to prevent hydration errors
  if (!mounted) return null

  // Define supported chains with icons
  const chains = [
    { id: bsc.id, name: "BSC Mainnet", icon: "🟡" },
    { id: bscTestnet.id, name: "BSC Testnet", icon: "🔵" },
  ]

  // Find the current chain or default to the first one
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
