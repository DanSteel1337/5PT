"use client"

import { useState, useEffect } from "react"
import { POOL_CRITERIA } from "@/lib/contracts"
import { useInvestmentData } from "@/hooks/useInvestmentData"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { formatNumber } from "@/lib/utils"

export function InvestmentPools() {
  const { userTotalDeposits, userReferralCount, userDirectReferralVolume, tokenSymbol, poolEligibility } =
    useInvestmentData()

  const [mounted, setMounted] = useState(false)
  const [selectedPool, setSelectedPool] = useState(0)
  const [activeTab, setActiveTab] = useState<"all" | "qualified" | "unqualified">("all")

  // Client-side mounting check to prevent hydration errors
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Filter pools based on active tab
  const filteredPools = POOL_CRITERIA.slice(0, 7).filter((pool, index) => {
    if (activeTab === "all") return true
    if (activeTab === "qualified") return poolEligibility[index]
    if (activeTab === "unqualified") return !poolEligibility[index]
    return true
  })

  // Get the selected pool data
  const selectedPoolData = POOL_CRITERIA[selectedPool]

  // Check if user qualifies for the selected pool
  const checkQualification = (poolId: number) => {
    const pool = POOL_CRITERIA[poolId]

    // Handle whitelist pools
    if (pool.personalInvestment === "Whitelist") {
      return { qualified: poolEligibility?.[poolId] || false, message: "Whitelist only" }
    }

    const personalInvestmentRequired =
      typeof pool.personalInvestment === "string" ? 0 : Number(pool.personalInvestment) / 10 ** 18

    const directInvestmentRequired =
      typeof pool.directInvestment === "string" ? 0 : Number(pool.directInvestment) / 10 ** 18

    const directRefsRequired = typeof pool.directRefs === "string" ? 0 : pool.directRefs

    // Check qualification criteria
    const hasPersonalInvestment = userTotalDeposits >= personalInvestmentRequired
    const hasDirectInvestment = userDirectReferralVolume >= directInvestmentRequired
    const hasDirectRefs = userReferralCount >= directRefsRequired

    // Overall qualification
    const qualified = hasPersonalInvestment && hasDirectInvestment && hasDirectRefs

    // Generate message
    let message = ""
    if (!hasPersonalInvestment) {
      message += `Need ${formatNumber(personalInvestmentRequired - userTotalDeposits)} more ${tokenSymbol}. `
    }
    if (!hasDirectInvestment) {
      message += `Need ${formatNumber(directInvestmentRequired - userDirectReferralVolume)} more direct referral volume. `
    }
    if (!hasDirectRefs) {
      message += `Need ${directRefsRequired - userReferralCount} more direct referrals. `
    }

    return { qualified, message: message || "Qualified" }
  }

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4">Investment Pools</h2>

      <Tabs defaultValue="all" onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Pools</TabsTrigger>
          <TabsTrigger value="qualified">Qualified</TabsTrigger>
          <TabsTrigger value="unqualified">Unqualified</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPools.map((pool, index) => {
              const { qualified, message } = checkQualification(pool.id)
              return (
                <Card
                  key={pool.id}
                  className={`p-4 border ${qualified ? "border-green-500" : "border-gray-700"} bg-gray-900`}
                  onClick={() => setSelectedPool(pool.id)}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">Pool {pool.id + 1}</h3>
                    <Badge variant={qualified ? "success" : "outline"}>
                      {qualified ? "Qualified" : "Not Qualified"}
                    </Badge>
                  </div>

                  <div className="text-sm space-y-1">
                    <p>Share: {pool.share / 10000}% daily</p>
                    <p>
                      Min:{" "}
                      {typeof pool.personalInvestment === "string"
                        ? pool.personalInvestment
                        : formatNumber(Number(pool.personalInvestment) / 10 ** 18)}{" "}
                      {tokenSymbol}
                    </p>
                  </div>

                  {!qualified && <p className="text-xs text-gray-400 mt-2">{message}</p>}
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="qualified" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPools.map((pool, index) => {
              const { qualified, message } = checkQualification(pool.id)
              if (!qualified) return null
              return (
                <Card
                  key={pool.id}
                  className="p-4 border border-green-500 bg-gray-900"
                  onClick={() => setSelectedPool(pool.id)}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">Pool {pool.id + 1}</h3>
                    <Badge variant="success">Qualified</Badge>
                  </div>

                  <div className="text-sm space-y-1">
                    <p>Share: {pool.share / 10000}% daily</p>
                    <p>
                      Min:{" "}
                      {typeof pool.personalInvestment === "string"
                        ? pool.personalInvestment
                        : formatNumber(Number(pool.personalInvestment) / 10 ** 18)}{" "}
                      {tokenSymbol}
                    </p>
                  </div>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="unqualified" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPools.map((pool, index) => {
              const { qualified, message } = checkQualification(pool.id)
              if (qualified) return null
              return (
                <Card
                  key={pool.id}
                  className="p-4 border border-gray-700 bg-gray-900"
                  onClick={() => setSelectedPool(pool.id)}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">Pool {pool.id + 1}</h3>
                    <Badge variant="outline">Not Qualified</Badge>
                  </div>

                  <div className="text-sm space-y-1">
                    <p>Share: {pool.share / 10000}% daily</p>
                    <p>
                      Min:{" "}
                      {typeof pool.personalInvestment === "string"
                        ? pool.personalInvestment
                        : formatNumber(Number(pool.personalInvestment) / 10 ** 18)}{" "}
                      {tokenSymbol}
                    </p>
                  </div>

                  <p className="text-xs text-gray-400 mt-2">{message}</p>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>

      {selectedPoolData && (
        <div className="mt-6 p-4 bg-gray-800 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Pool {selectedPoolData.id + 1} Requirements</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-400">Personal Investment</p>
              <p className="font-medium">
                {typeof selectedPoolData.personalInvestment === "string"
                  ? selectedPoolData.personalInvestment
                  : formatNumber(Number(selectedPoolData.personalInvestment) / 10 ** 18)}{" "}
                {tokenSymbol}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Direct Referral Volume</p>
              <p className="font-medium">
                {typeof selectedPoolData.directInvestment === "string"
                  ? selectedPoolData.directInvestment
                  : formatNumber(Number(selectedPoolData.directInvestment) / 10 ** 18)}{" "}
                {tokenSymbol}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Direct Referrals</p>
              <p className="font-medium">{selectedPoolData.directRefs}</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-400">Daily Reward Rate</p>
            <p className="font-medium">{selectedPoolData.share / 10000}%</p>
          </div>
        </div>
      )}

      <div className="mt-6 flex justify-center">
        <Button
          variant="outline"
          className="text-blue-400 border-blue-400 hover:bg-blue-900 hover:text-blue-100"
          onClick={() => window.open("/pools", "_self")}
        >
          View Detailed Pool Requirements
        </Button>
      </div>
    </div>
  )
}
