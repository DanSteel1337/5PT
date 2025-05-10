"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Award, RefreshCw } from "lucide-react"
import { useInvestmentManager } from "@/lib/hooks/use-investment-manager"

export function OptimizedQuickActions() {
  const [isClaimingRewards, setIsClaimingRewards] = useState(false)
  const [isCompounding, setIsCompounding] = useState(false)
  const { claimReward } = useInvestmentManager()

  const handleClaimRewards = async () => {
    try {
      setIsClaimingRewards(true)
      await claimReward()
      // Success notification would go here
    } catch (error) {
      console.error("Error claiming rewards:", error)
      // Error notification would go here
    } finally {
      setIsClaimingRewards(false)
    }
  }

  const handleAutoCompound = async () => {
    try {
      setIsCompounding(true)
      // Auto-compound logic would go here
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulating API call
      // Success notification would go here
    } catch (error) {
      console.error("Error auto-compounding:", error)
      // Error notification would go here
    } finally {
      setIsCompounding(false)
    }
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold text-amber-300 mb-4">Quick Actions</h2>
      <Card className="bg-gradient-to-br from-black/60 to-black/40 border-amber-600/30 backdrop-blur-sm overflow-hidden">
        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            className="bg-amber-900/20 border-amber-600/50 hover:bg-amber-800/30 text-amber-300 h-14"
          >
            <Plus className="mr-2 h-5 w-5" />
            Deposit Tokens
          </Button>

          <Button
            variant="outline"
            className="bg-amber-900/20 border-amber-600/50 hover:bg-amber-800/30 text-amber-300 h-14"
            onClick={handleClaimRewards}
            disabled={isClaimingRewards}
          >
            <Award className="mr-2 h-5 w-5" />
            {isClaimingRewards ? "Claiming..." : "Claim Rewards"}
          </Button>

          <Button
            variant="outline"
            className="bg-amber-900/20 border-amber-600/50 hover:bg-amber-800/30 text-amber-300 h-14"
            onClick={handleAutoCompound}
            disabled={isCompounding}
          >
            <RefreshCw className="mr-2 h-5 w-5" />
            {isCompounding ? "Processing..." : "Auto-Compound"}
          </Button>
        </div>
      </Card>
    </div>
  )
}
