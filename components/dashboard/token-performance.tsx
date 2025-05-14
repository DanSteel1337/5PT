"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useAccount, useReadContract } from "wagmi"
import { formatUnits } from "viem"
import { CyberCard } from "@/components/ui/cyber-card"
import { PremiumCard } from "@/components/ui/premium-card"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { TOKEN_ABI, CONTRACT_ADDRESSES } from "@/lib/contracts"
import { Coins, Flame, TrendingUp, ArrowDown } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function TokenPerformance() {
  const { address } = useAccount()
  const [mounted, setMounted] = useState(false)

  // Get token balance
  const { data: tokenBalance } = useReadContract({
    address: CONTRACT_ADDRESSES.mainnet.fivePillarsToken as `0x${string}`,
    abi: TOKEN_ABI,
    functionName: "balanceOf",
    args: [address as `0x${string}`],
    enabled: !!address,
  })

  // Get token total supply
  const { data: totalSupply } = useReadContract({
    address: CONTRACT_ADDRESSES.mainnet.fivePillarsToken as `0x${string}`,
    abi: TOKEN_ABI,
    functionName: "totalSupply",
    enabled: !!address,
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Format values for display
  const formattedBalance = tokenBalance ? Number.parseFloat(formatUnits(tokenBalance, 18)) : 0
  const formattedTotalSupply = totalSupply ? Number.parseFloat(formatUnits(totalSupply, 18)) : 100_000_000_000

  // Calculate token metrics
  const tokenPrice = 0.00175 // Fixed token price in USD
  const marketCap = formattedTotalSupply * tokenPrice
  const balanceValue = formattedBalance * tokenPrice

  // Calculate burn rate (simulated for display purposes)
  const burnRate = 2.5 // 2.5% daily burn rate
  const burnedToday = formattedTotalSupply * (burnRate / 100)

  // Calculate token percentage of total supply
  const percentageOfSupply = (formattedBalance / formattedTotalSupply) * 100

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.5 }}>
      <CyberCard variant="panel" className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Token Performance</h2>
            <p className="text-gray-400">Track your 5PT token holdings and market metrics</p>
          </div>

          <div className="mt-4 md:mt-0 flex items-center bg-black/30 rounded-lg px-3 py-1.5">
            <Coins className="h-4 w-4 text-purple-400 mr-2" />
            <span className="text-sm">5PT Token</span>
            <span className="mx-2 text-gray-600">|</span>
            <span className="text-sm text-purple-400">${tokenPrice}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <PremiumCard variant="primary" className="p-5">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center mr-3">
                <Coins className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-medium">Your Balance</h3>
            </div>

            <p className="text-3xl font-bold mb-2">
              <AnimatedCounter
                value={formattedBalance}
                formatFn={(val) => `${val.toLocaleString(undefined, { maximumFractionDigits: 2 })} 5PT`}
              />
            </p>

            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Value:</span>
              <span className="text-purple-400">
                ${balanceValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </span>
            </div>

            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-400">% of Supply:</span>
              <span className="text-purple-400">{percentageOfSupply.toFixed(6)}%</span>
            </div>
          </PremiumCard>

          <PremiumCard variant="secondary" className="p-5">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center mr-3">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-medium">Market Cap</h3>
            </div>

            <p className="text-3xl font-bold mb-2">
              <AnimatedCounter
                value={marketCap}
                formatFn={(val) => `$${val.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
              />
            </p>

            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Total Supply:</span>
              <span className="text-blue-400">
                {formattedTotalSupply.toLocaleString(undefined, { maximumFractionDigits: 0 })} 5PT
              </span>
            </div>

            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-400">Token Price:</span>
              <span className="text-blue-400">${tokenPrice}</span>
            </div>
          </PremiumCard>

          <PremiumCard variant="accent" className="p-5">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center mr-3">
                <Flame className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-medium">Deflationary Metrics</h3>
            </div>

            <p className="text-3xl font-bold mb-2">
              <AnimatedCounter value={burnRate} formatFn={(val) => `${val.toFixed(1)}% Daily`} />
            </p>

            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Burned Today:</span>
              <span className="text-red-400">
                {burnedToday.toLocaleString(undefined, { maximumFractionDigits: 0 })} 5PT
              </span>
            </div>

            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-400">Burn Mechanism:</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-red-400 cursor-help flex items-center">
                      100% Deposits <ArrowDown className="h-3 w-3 ml-1" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs max-w-xs">
                      All deposits are permanently burned, creating a powerful deflationary effect that benefits all
                      token holders.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </PremiumCard>
        </div>

        <div className="bg-black/30 rounded-lg p-5 border border-purple-500/20">
          <h3 className="text-lg font-medium mb-4">Token Burn Visualization</h3>

          <div className="relative h-8 bg-black/50 rounded-full overflow-hidden mb-3">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 30, repeat: Number.POSITIVE_INFINITY }}
            />

            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-medium text-white">Tokens Being Burned in Real-Time</span>
            </div>
          </div>

          <p className="text-sm text-gray-400">
            The 5PT token implements a powerful deflationary mechanism where 100% of deposits are permanently burned,
            reducing the total supply over time. This creates scarcity and potentially increases the value of remaining
            tokens.
          </p>
        </div>
      </CyberCard>
    </motion.div>
  )
}
