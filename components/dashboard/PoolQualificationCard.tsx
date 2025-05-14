"use client"

import { useState, useEffect } from "react"
import { useReadContract } from "wagmi"
import { formatUnits } from "viem"
import { contracts } from "@/lib/contracts"
import { CyberButton } from "@/components/ui/cyber-button"

interface PoolQualificationCardProps {
  address?: `0x${string}`
}

export function PoolQualificationCard({ address }: PoolQualificationCardProps) {
  const [mounted, setMounted] = useState(false)

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

  if (!mounted) return null

  const balance = tokenBalance ? Number.parseFloat(formatUnits(tokenBalance as bigint, 18)) : 0

  const pools = [
    {
      id: 1,
      name: "Pool 1",
      requirement: 550000,
      apy: "12%",
      qualified: balance >= 550000,
      description: "Entry-level investment pool with moderate returns",
    },
    {
      id: 2,
      name: "Pool 2",
      requirement: 1250000,
      apy: "18%",
      qualified: balance >= 1250000,
      description: "Mid-tier investment pool with enhanced returns",
    },
    {
      id: 3,
      name: "Pool 3",
      requirement: 3000000,
      apy: "25%",
      qualified: balance >= 3000000,
      description: "Premium investment pool with maximum returns",
    },
  ]

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-900/40 to-purple-900/20 p-6 backdrop-blur-sm">
      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl filter" />
      <div className="absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl filter" />

      <h3 className="mb-4 text-xl font-semibold text-white">Pool Qualification</h3>

      <div className="space-y-4">
        {pools.map((pool) => (
          <div
            key={pool.id}
            className={`relative overflow-hidden rounded-lg border ${
              pool.qualified ? "border-green-500/50 bg-green-900/10" : "border-gray-700 bg-gray-800/50"
            } p-4 transition-all duration-300 hover:border-opacity-100`}
          >
            {pool.qualified && (
              <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-green-500/20 blur-xl filter" />
            )}

            <div className="flex items-center justify-between">
              <h4 className="text-lg font-medium text-white">{pool.name}</h4>
              <div
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  pool.qualified ? "bg-green-900/50 text-green-300" : "bg-gray-700 text-gray-300"
                }`}
              >
                {pool.qualified ? "Qualified" : "Not Qualified"}
              </div>
            </div>

            <p className="mt-1 text-sm text-gray-300">{pool.description}</p>

            <div className="mt-3 flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-400">Required</div>
                <div className="text-sm font-medium text-white">{pool.requirement.toLocaleString()} 5PT</div>
              </div>

              <div>
                <div className="text-xs text-gray-400">APY</div>
                <div className="text-sm font-medium text-white">{pool.apy}</div>
              </div>

              <div>
                <div className="text-xs text-gray-400">Status</div>
                <div className="text-sm font-medium text-white">
                  {balance >= pool.requirement
                    ? "Eligible"
                    : `Need ${(pool.requirement - balance).toLocaleString()} more`}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <CyberButton
                disabled={!pool.qualified}
                className="w-full"
                variant={pool.qualified ? "primary" : "secondary"}
              >
                {pool.qualified ? "Enter Pool" : "Not Eligible"}
              </CyberButton>
            </div>
          </div>
        ))}

        <div className="rounded-lg bg-gray-800/50 p-4">
          <div className="text-sm font-medium text-white">Your Balance</div>
          <div className="mt-1 text-2xl font-bold text-white">{balance.toLocaleString()} 5PT</div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-700">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-600 to-blue-600"
              style={{
                width: `${Math.min(100, (balance / 3000000) * 100)}%`,
              }}
            />
          </div>
          <div className="mt-1 flex justify-between text-xs text-gray-400">
            <span>0</span>
            <span>Pool 1</span>
            <span>Pool 2</span>
            <span>Pool 3</span>
          </div>
        </div>
      </div>
    </div>
  )
}
