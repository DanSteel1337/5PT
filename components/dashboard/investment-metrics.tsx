"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useAccount, useReadContract } from "wagmi"
import { formatUnits } from "viem"
import { CyberCard } from "@/components/ui/cyber-card"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { INVESTMENT_MANAGER_ABI, CONTRACT_ADDRESSES } from "@/lib/contracts"
import { TrendingUp, Users, Zap, BarChart3 } from "lucide-react"

export function InvestmentMetrics() {
  const { address } = useAccount()
  const [mounted, setMounted] = useState(false)

  // Get total investors
  const { data: totalInvestors } = useReadContract({
    address: CONTRACT_ADDRESSES.mainnet.investmentManager as `0x${string}`,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "getTotalInvestors",
    enabled: !!address,
  })

  // Get total value locked
  const { data: totalValueLocked } = useReadContract({
    address: CONTRACT_ADDRESSES.mainnet.investmentManager as `0x${string}`,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "getTotalValueLocked",
    enabled: !!address,
  })

  // Get user pool rewards
  const { data: userPoolRewards } = useReadContract({
    address: CONTRACT_ADDRESSES.mainnet.investmentManager as `0x${string}`,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "getUserPoolRewards",
    args: [address as `0x${string}`],
    enabled: !!address,
  })

  // Get accumulated rewards
  const { data: accumulatedRewards } = useReadContract({
    address: CONTRACT_ADDRESSES.mainnet.investmentManager as `0x${string}`,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "getAccumulatedRewards",
    enabled: !!address,
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Format values for display
  const formattedTVL = totalValueLocked ? Number.parseFloat(formatUnits(totalValueLocked, 18)) : 0
  const formattedPoolRewards = userPoolRewards ? Number.parseFloat(formatUnits(userPoolRewards, 18)) : 0
  const formattedAccumulatedRewards = accumulatedRewards ? Number.parseFloat(formatUnits(accumulatedRewards, 18)) : 0
  const investors = totalInvestors ? Number(totalInvestors) : 0

  // Calculate daily ROI (0.3% base + pool rewards)
  const dailyROI = 0.3 + (formattedPoolRewards > 0 ? 0.175 : 0)

  const metrics = [
    {
      icon: <TrendingUp className="h-6 w-6 text-purple-400" />,
      title: "Total Value Locked",
      value: formattedTVL,
      format: (val) => `${val.toLocaleString(undefined, { maximumFractionDigits: 0 })} 5PT`,
      subValue: `~$${(formattedTVL * 0.00175).toLocaleString(undefined, { maximumFractionDigits: 0 })} USD`,
      color: "from-purple-500 to-blue-500",
    },
    {
      icon: <Users className="h-6 w-6 text-blue-400" />,
      title: "Total Investors",
      value: investors,
      format: (val) => val.toLocaleString(),
      subValue: "Growing community",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Zap className="h-6 w-6 text-green-400" />,
      title: "Accumulated Rewards",
      value: formattedAccumulatedRewards,
      format: (val) => `${val.toLocaleString(undefined, { maximumFractionDigits: 2 })} 5PT`,
      subValue: `~$${(formattedAccumulatedRewards * 0.00175).toLocaleString(undefined, { maximumFractionDigits: 2 })} USD`,
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-amber-400" />,
      title: "Daily ROI",
      value: dailyROI,
      format: (val) => `${val.toFixed(2)}%`,
      subValue: "Compounding daily",
      color: "from-amber-500 to-orange-500",
    },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
          >
            <CyberCard className="h-full p-6">
              <div className="flex flex-col h-full">
                <div className="flex items-center mb-4">
                  <div
                    className={`w-10 h-10 rounded-full bg-gradient-to-br ${metric.color} flex items-center justify-center mr-3`}
                  >
                    {metric.icon}
                  </div>
                  <h3 className="text-lg font-medium text-gray-300">{metric.title}</h3>
                </div>

                <div className="mt-auto">
                  <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                    <AnimatedCounter value={metric.value} formatFn={metric.format} />
                  </p>
                  <p className="text-sm text-gray-400 mt-1">{metric.subValue}</p>
                </div>
              </div>
            </CyberCard>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
