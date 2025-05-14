"use client"

import { useState, useEffect } from "react"
import { useReadContract, useWriteContract } from "wagmi"
import { formatUnits, parseUnits } from "viem"
import { contracts } from "@/lib/contracts"
import { CyberButton } from "@/components/ui/cyber-button"
import { CyberCard } from "@/components/ui/cyber-card"

interface InvestmentPoolsProps {
  address?: `0x${string}`
}

export function InvestmentPools({ address }: InvestmentPoolsProps) {
  const [mounted, setMounted] = useState(false)
  const [activePool, setActivePool] = useState(0)
  const [depositAmount, setDepositAmount] = useState("")

  useEffect(() => {
    setMounted(true)
  }, [])

  const { data: tokenBalance } = useReadContract({
    address: contracts.token.address as `0x${string}`,
    abi: contracts.token.abi,
    functionName: "balanceOf",
    args: [address],
    query: {
      enabled: mounted && !!address,
      staleTime: 10000,
    },
  })

  const { data: poolInfo } = useReadContract({
    address: contracts.investmentManager.address as `0x${string}`,
    abi: contracts.investmentManager.abi,
    functionName: "getPoolInfo",
    args: [activePool],
    query: {
      enabled: mounted && activePool > 0,
      staleTime: 30000,
    },
  })

  const { data: userPoolInfo } = useReadContract({
    address: contracts.investmentManager.address as `0x${string}`,
    abi: contracts.investmentManager.abi,
    functionName: "getUserPoolInfo",
    args: [address, activePool],
    query: {
      enabled: mounted && !!address && activePool > 0,
      staleTime: 10000,
    },
  })

  const { writeContractAsync } = useWriteContract()

  if (!mounted) return null

  const balance = tokenBalance ? Number.parseFloat(formatUnits(tokenBalance as bigint, 18)) : 0

  const formattedBalance = balance.toLocaleString("en-US", { maximumFractionDigits: 0 })

  const pools = [
    {
      id: 1,
      name: "Pool 1",
      requirement: 550000,
      apy: "12%",
      lockPeriod: "30 days",
      minDeposit: 10000,
      maxDeposit: 500000,
      totalStaked: 12500000,
      participants: 42,
      qualified: balance >= 550000,
      description: "Entry-level investment pool with moderate returns and shorter lock period.",
    },
    {
      id: 2,
      name: "Pool 2",
      requirement: 1250000,
      apy: "18%",
      lockPeriod: "60 days",
      minDeposit: 50000,
      maxDeposit: 1000000,
      totalStaked: 28750000,
      participants: 26,
      qualified: balance >= 1250000,
      description: "Mid-tier investment pool with enhanced returns and medium lock period.",
    },
    {
      id: 3,
      name: "Pool 3",
      requirement: 3000000,
      apy: "25%",
      lockPeriod: "90 days",
      minDeposit: 100000,
      maxDeposit: 2500000,
      totalStaked: 42000000,
      participants: 14,
      qualified: balance >= 3000000,
      description: "Premium investment pool with maximum returns and longer lock period.",
    },
  ]

  const selectedPool = pools.find((pool) => pool.id === activePool) || pools[0]

  const handleDeposit = async () => {
    if (!address || !depositAmount || activePool === 0) return

    try {
      // First approve tokens
      await writeContractAsync({
        address: contracts.token.address as `0x${string}`,
        abi: contracts.token.abi,
        functionName: "approve",
        args: [contracts.investmentManager.address, parseUnits(depositAmount, 18)],
      })

      // Then deposit
      await writeContractAsync({
        address: contracts.investmentManager.address as `0x${string}`,
        abi: contracts.investmentManager.abi,
        functionName: "deposit",
        args: [activePool, parseUnits(depositAmount, 18)],
      })

      // Reset form
      setDepositAmount("")
    } catch (error) {
      console.error("Error depositing:", error)
    }
  }

  const handleWithdraw = async () => {
    if (!address || activePool === 0) return

    try {
      await writeContractAsync({
        address: contracts.investmentManager.address as `0x${string}`,
        abi: contracts.investmentManager.abi,
        functionName: "withdraw",
        args: [activePool],
      })
    } catch (error) {
      console.error("Error withdrawing:", error)
    }
  }

  const handleMaxDeposit = () => {
    if (selectedPool) {
      const max = Math.min(balance, selectedPool.maxDeposit)
      setDepositAmount(max.toString())
    }
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-3">
        {pools.map((pool) => (
          <div
            key={pool.id}
            className={`relative cursor-pointer overflow-hidden rounded-xl border-2 p-6 transition-all duration-300 ${
              activePool === pool.id
                ? "border-purple-500 bg-gradient-to-br from-purple-900/40 to-blue-900/20 backdrop-blur-sm"
                : "border-gray-700 bg-gradient-to-br from-gray-900/60 to-gray-900/40 backdrop-blur-sm hover:border-gray-500"
            }`}
            onClick={() => pool.qualified && setActivePool(pool.id)}
          >
            {activePool === pool.id && (
              <>
                <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl filter" />
                <div className="absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl filter" />
              </>
            )}

            <div className="relative">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-medium text-white">{pool.name}</h4>
                <div
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    pool.qualified ? "bg-green-900/50 text-green-300" : "bg-red-900/50 text-red-300"
                  }`}
                >
                  {pool.qualified ? "Eligible" : "Not Eligible"}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-400">APY</div>
                  <div className="text-lg font-bold text-white">{pool.apy}</div>
                </div>

                <div>
                  <div className="text-xs text-gray-400">Lock Period</div>
                  <div className="text-lg font-bold text-white">{pool.lockPeriod}</div>
                </div>

                <div>
                  <div className="text-xs text-gray-400">Min Deposit</div>
                  <div className="text-sm font-medium text-white">{pool.minDeposit.toLocaleString()}</div>
                </div>

                <div>
                  <div className="text-xs text-gray-400">Max Deposit</div>
                  <div className="text-sm font-medium text-white">{pool.maxDeposit.toLocaleString()}</div>
                </div>
              </div>

              <div className="mt-4 rounded-lg bg-gray-800/50 p-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Total Staked</span>
                  <span className="text-white">{pool.totalStaked.toLocaleString()} 5PT</span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-gray-700">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-600 to-blue-600"
                    style={{ width: "65%" }}
                  />
                </div>
              </div>

              <div className="mt-4 text-center">
                <CyberButton
                  size="sm"
                  disabled={!pool.qualified}
                  variant={activePool === pool.id ? "primary" : "secondary"}
                  className="w-full"
                  onClick={() => pool.qualified && setActivePool(pool.id)}
                >
                  {activePool === pool.id ? "Selected" : "Select Pool"}
                </CyberButton>
              </div>
            </div>
          </div>
        ))}
      </div>

      {activePool > 0 && (
        <CyberCard className="relative overflow-hidden backdrop-blur-sm">
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl filter" />
          <div className="absolute -left-32 -bottom-32 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl filter" />

          <div className="relative grid gap-8 p-6 lg:grid-cols-2">
            <div>
              <h3 className="mb-4 text-2xl font-bold text-white">{selectedPool.name} Details</h3>

              <p className="mb-6 text-gray-300">{selectedPool.description}</p>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg bg-gray-800/50 p-4">
                  <div className="text-sm text-gray-400">Annual Percentage Yield</div>
                  <div className="mt-1 text-2xl font-bold text-white">{selectedPool.apy}</div>
                </div>

                <div className="rounded-lg bg-gray-800/50 p-4">
                  <div className="text-sm text-gray-400">Lock Period</div>
                  <div className="mt-1 text-2xl font-bold text-white">{selectedPool.lockPeriod}</div>
                </div>

                <div className="rounded-lg bg-gray-800/50 p-4">
                  <div className="text-sm text-gray-400">Total Participants</div>
                  <div className="mt-1 text-2xl font-bold text-white">{selectedPool.participants}</div>
                </div>

                <div className="rounded-lg bg-gray-800/50 p-4">
                  <div className="text-sm text-gray-400">Total Value Locked</div>
                  <div className="mt-1 text-2xl font-bold text-white">{selectedPool.totalStaked.toLocaleString()}</div>
                </div>
              </div>

              <div className="mt-6 rounded-lg bg-gray-800/50 p-4">
                <div className="text-sm font-medium text-white">Pool Requirements</div>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-sm text-gray-300">
                      Minimum {selectedPool.requirement.toLocaleString()} 5PT tokens to qualify
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-sm text-gray-300">
                      Deposit between {selectedPool.minDeposit.toLocaleString()} and{" "}
                      {selectedPool.maxDeposit.toLocaleString()} 5PT
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-sm text-gray-300">
                      {selectedPool.lockPeriod} lock period for maximum returns
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-2xl font-bold text-white">Manage Investment</h3>

              <div className="mb-6 rounded-lg bg-gray-800/50 p-4">
                <div className="text-sm text-gray-400">Your 5PT Balance</div>
                <div className="mt-1 text-2xl font-bold text-white">{formattedBalance}</div>
              </div>

              <div className="mb-6 space-y-4">
                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-gray-300">Deposit Amount</span>
                  <div className="relative">
                    <input
                      type="number"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      placeholder={`Min: ${selectedPool.minDeposit.toLocaleString()}`}
                      className="w-full rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-2 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    />
                    <button
                      onClick={handleMaxDeposit}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-gray-700 px-2 py-1 text-xs font-medium text-white hover:bg-gray-600"
                    >
                      MAX
                    </button>
                  </div>
                </label>

                <div className="flex gap-4">
                  <CyberButton
                    onClick={handleDeposit}
                    disabled={
                      !depositAmount ||
                      Number.parseFloat(depositAmount) < selectedPool.minDeposit ||
                      Number.parseFloat(depositAmount) > Math.min(balance, selectedPool.maxDeposit)
                    }
                    className="flex-1"
                  >
                    Deposit
                  </CyberButton>

                  <CyberButton onClick={handleWithdraw} variant="secondary" className="flex-1">
                    Withdraw
                  </CyberButton>
                </div>
              </div>

              <div className="rounded-lg bg-gray-800/50 p-4">
                <div className="text-sm font-medium text-white">Your Investment</div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Deposited</span>
                    <span className="text-sm font-medium text-white">0 5PT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Pending Rewards</span>
                    <span className="text-sm font-medium text-white">0 5PT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Lock Ends</span>
                    <span className="text-sm font-medium text-white">Not staked</span>
                  </div>
                </div>

                <div className="mt-4">
                  <CyberButton size="sm" className="w-full" disabled>
                    Claim Rewards
                  </CyberButton>
                </div>
              </div>
            </div>
          </div>
        </CyberCard>
      )}
    </div>
  )
}
