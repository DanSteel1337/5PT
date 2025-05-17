"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Users, Link, Share2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatCrypto, formatAddress } from "@/lib/utils"

interface ReferralStatsProps {
  data: {
    referrals: string[]
    referralCommission: number
    address?: string
  }
}

export function ReferralStats({ data }: ReferralStatsProps) {
  const [copied, setCopied] = useState(false)

  const copyReferralLink = () => {
    if (!data.address) return

    const link = `https://5pt.io/ref/${data.address}`
    navigator.clipboard
      .writeText(link)
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        alert("Referral link copied to clipboard!")
      })
      .catch((err) => {
        console.error("Failed to copy: ", err)
      })
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
      <Card className="border-purple-500/20 bg-black/40 backdrop-blur-sm overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold flex items-center">
            <Users className="mr-2 h-5 w-5 text-purple-400" />
            Referral Network
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-purple-500/10 rounded-lg p-4 text-center">
                <div className="text-sm text-gray-400 mb-1">Total Referrals</div>
                <div className="text-2xl font-bold text-purple-300">{data.referrals.length}</div>
              </div>

              <div className="bg-purple-500/10 rounded-lg p-4 text-center">
                <div className="text-sm text-gray-400 mb-1">Total Commission</div>
                <div className="text-2xl font-bold text-purple-300">{formatCrypto(data.referralCommission)}</div>
              </div>
            </div>

            <div className="bg-purple-900/30 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Link className="h-4 w-4 text-purple-400 mr-2" />
                <span className="text-sm font-medium">Your Referral Link</span>
              </div>

              <div className="flex items-center">
                <div className="bg-black/30 rounded p-2 text-xs text-gray-300 flex-1 truncate">
                  {data.address ? `https://5pt.io/ref/${data.address}` : "Connect wallet to get your referral link"}
                </div>

                <Button
                  size="sm"
                  className="ml-2 bg-purple-600 hover:bg-purple-700"
                  onClick={copyReferralLink}
                  disabled={!data.address}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Recent Referrals</h4>

              {data.referrals.length > 0 ? (
                <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                  {data.referrals.slice(0, 5).map((referral, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-900/50 rounded-md">
                      <span className="text-xs">{formatAddress(referral)}</span>
                      <span className="text-xs text-purple-400">Active</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500 text-sm">
                  No referrals yet. Share your link to start earning!
                </div>
              )}
            </div>

            <Button variant="outline" className="w-full">
              View All Referrals
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
