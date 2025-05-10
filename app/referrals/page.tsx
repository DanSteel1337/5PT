"use client"

import { Badge } from "@/components/ui/badge"

import { useState } from "react"
import { useAccount } from "wagmi"
import { motion } from "framer-motion"
import { formatEther } from "ethers"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { useInvestmentManager } from "@/lib/hooks/use-investment-manager"
import { Skeleton } from "@/components/ui/skeleton"
import { ConnectKitButton } from "connectkit"
import { Users, UserPlus, Copy, QrCode, Share2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

export default function ReferralsPage() {
  const { isConnected, address } = useAccount()
  const { toast } = useToast()
  const [isQrModalOpen, setIsQrModalOpen] = useState(false)

  // Generate referral link
  const referralLink = address ? `https://5pt.finance/ref/${address}` : ""

  const handleCopyLink = () => {
    if (referralLink) {
      navigator.clipboard.writeText(referralLink)
      toast({
        title: "Referral link copied",
        description: "Your referral link has been copied to clipboard",
      })
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Referral Network</h1>

          {!isConnected && (
            <ConnectKitButton.Custom>
              {({ show }) => (
                <Button
                  onClick={show}
                  className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700"
                >
                  Connect Wallet
                </Button>
              )}
            </ConnectKitButton.Custom>
          )}
        </div>

        {isConnected ? (
          <>
            <ReferralStats />

            <GlassCard className="p-6">
              <h3 className="text-xl font-bold mb-6">Your Referral Link</h3>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Input value={referralLink} readOnly className="bg-black/30 border-white/10 pr-10" />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    onClick={handleCopyLink}
                  >
                    <Copy size={16} />
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="border-white/20 hover:bg-white/10"
                    onClick={() => setIsQrModalOpen(true)}
                  >
                    <QrCode size={16} className="mr-2" />
                    QR Code
                  </Button>

                  <Button className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700">
                    <Share2 size={16} className="mr-2" />
                    Share
                  </Button>
                </div>
              </div>

              <p className="mt-4 text-sm text-gray-400">
                Share this link with others to earn referral rewards when they join the platform.
              </p>
            </GlassCard>

            <ReferralTree />

            <Dialog open={isQrModalOpen} onOpenChange={setIsQrModalOpen}>
              <DialogContent className="bg-gray-900 border border-white/10 text-white">
                <DialogHeader>
                  <DialogTitle>Your Referral QR Code</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Scan this QR code to share your referral link
                  </DialogDescription>
                </DialogHeader>

                <div className="flex justify-center p-4">
                  <div className="bg-white p-4 rounded-lg">
                    {/* QR code would be generated here */}
                    <div className="w-64 h-64 bg-gray-200 flex items-center justify-center">
                      <p className="text-black">QR Code Placeholder</p>
                    </div>
                  </div>
                </div>

                <p className="text-center text-sm text-gray-400">{referralLink}</p>
              </DialogContent>
            </Dialog>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
            <p className="text-gray-400 mb-8 max-w-md">
              Connect your wallet to view your referral network and share your referral link.
            </p>
            <ConnectKitButton />
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

function ReferralStats() {
  const { address } = useAccount()
  const { useInvestorInfo } = useInvestmentManager()

  const { data: investorInfo, isLoading } = useInvestorInfo(address)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      <motion.div variants={itemVariants}>
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-200">Direct Referrals</h3>
            <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center">
              <UserPlus size={20} className="text-violet-400" />
            </div>
          </div>

          <div className="space-y-2">
            {isLoading ? (
              <Skeleton className="h-10 w-full bg-white/5" />
            ) : (
              <div className="text-3xl font-bold">{investorInfo ? investorInfo[1].toString() : "0"}</div>
            )}
          </div>
        </GlassCard>
      </motion.div>

      <motion.div variants={itemVariants}>
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-200">Total Network</h3>
            <div className="w-10 h-10 rounded-full bg-fuchsia-500/20 flex items-center justify-center">
              <Users size={20} className="text-fuchsia-400" />
            </div>
          </div>

          <div className="space-y-2">
            {isLoading ? (
              <Skeleton className="h-10 w-full bg-white/5" />
            ) : (
              <div className="text-3xl font-bold">
                {investorInfo ? (Number(investorInfo[1]) + Number(investorInfo[2])).toString() : "0"}
              </div>
            )}
          </div>
        </GlassCard>
      </motion.div>

      <motion.div variants={itemVariants}>
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-200">Network Volume</h3>
            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
              <Users size={20} className="text-amber-400" />
            </div>
          </div>

          <div className="space-y-2">
            {isLoading ? (
              <Skeleton className="h-10 w-full bg-white/5" />
            ) : (
              <div className="text-3xl font-bold">
                {investorInfo ? formatEther(investorInfo[3] + investorInfo[4]).slice(0, 6) : "0"} 5PT
              </div>
            )}
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  )
}

function ReferralTree() {
  // Mock data for referral tree
  const referrals = [
    { address: "0x1234...5678", level: 1, date: "2023-05-01", volume: "120.5" },
    { address: "0x2345...6789", level: 1, date: "2023-05-03", volume: "85.2" },
    { address: "0x3456...7890", level: 2, date: "2023-05-05", volume: "45.7" },
    { address: "0x4567...8901", level: 2, date: "2023-05-07", volume: "62.3" },
    { address: "0x5678...9012", level: 3, date: "2023-05-09", volume: "30.1" },
  ]

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
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <GlassCard className="p-6">
        <h3 className="text-xl font-bold mb-6">Your Referral Network</h3>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 font-medium text-gray-300">Address</th>
                <th className="text-left py-3 px-4 font-medium text-gray-300">Level</th>
                <th className="text-left py-3 px-4 font-medium text-gray-300">Joined</th>
                <th className="text-right py-3 px-4 font-medium text-gray-300">Volume</th>
              </tr>
            </thead>
            <tbody>
              {referrals.map((referral, index) => (
                <tr key={index} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-3 px-4">{referral.address}</td>
                  <td className="py-3 px-4">
                    <Badge
                      variant="outline"
                      className={
                        referral.level === 1
                          ? "border-violet-500 text-violet-400"
                          : referral.level === 2
                            ? "border-pink-500 text-pink-400"
                            : "border-amber-500 text-amber-400"
                      }
                    >
                      Level {referral.level}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">{referral.date}</td>
                  <td className="py-3 px-4 text-right font-medium">{referral.volume} 5PT</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </motion.div>
  )
}
