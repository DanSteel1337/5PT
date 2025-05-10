"use client"

import { useState } from "react"
import { useAccount } from "wagmi"
import { motion } from "framer-motion"
import { Plus, Award, RefreshCw } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { useInvestmentManager } from "@/lib/hooks/use-investment-manager"
import { DepositModal } from "@/components/modals/deposit-modal"
import { useToast } from "@/components/ui/use-toast"

export function QuickActions() {
  const { address, isConnected } = useAccount()
  const { claimReward, claimStatus } = useInvestmentManager()
  const { toast } = useToast()
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false)

  const handleClaimRewards = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to claim rewards",
        variant: "destructive",
      })
      return
    }

    try {
      await claimReward()
    } catch (error) {
      console.error("Error claiming rewards:", error)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.4,
      },
    },
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="mt-8">
      <h2 className="text-2xl font-bold mb-6 gold-gradient-text">Quick Actions</h2>

      <GlassCard className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="default"
            size="lg"
            className="bg-gradient-to-r from-gold-dark to-gold-light hover:from-gold hover:to-gold-light text-black font-bold"
            onClick={() => setIsDepositModalOpen(true)}
          >
            <Plus size={18} className="mr-2" />
            Deposit Tokens
          </Button>

          <Button
            variant="default"
            size="lg"
            className="bg-gradient-to-r from-gold-dark to-gold-light hover:from-gold hover:to-gold-light text-black font-bold"
            onClick={handleClaimRewards}
            disabled={claimStatus.isLoading}
          >
            {claimStatus.isLoading ? (
              <>
                <RefreshCw size={18} className="mr-2 animate-spin" />
                Claiming...
              </>
            ) : (
              <>
                <Award size={18} className="mr-2" />
                Claim Rewards
              </>
            )}
          </Button>

          <Button variant="outline" size="lg" className="border-gold/30 hover:bg-gold/10 text-gold">
            <RefreshCw size={18} className="mr-2" />
            Auto-Compound
          </Button>
        </div>
      </GlassCard>

      <DepositModal isOpen={isDepositModalOpen} onClose={() => setIsDepositModalOpen(false)} />
    </motion.div>
  )
}
