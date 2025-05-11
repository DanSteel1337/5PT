"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Award, Copy, Check, Share2, Network } from "lucide-react"
import { useAccount, useReadContract } from "wagmi"
import { CONTRACT_ADDRESSES, INVESTMENT_MANAGER_ABI } from "@/lib/contracts"
import { formatUnits } from "viem"
import { useToast } from "@/hooks/use-toast"

export function ReferralNetworkCard() {
  const { address, isConnected } = useAccount()
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  // Get investor info
  const { data: investorInfo, isPending: isLoadingInvestorInfo } = useReadContract({
    address: CONTRACT_ADDRESSES.investmentManager,
    abi: INVESTMENT_MANAGER_ABI,
    functionName: "accountToInvestorInfo",
    args: [address || "0x0000000000000000000000000000000000000000"],
    query: {
      enabled: isConnected,
    },
  })

  const isLoading = isLoadingInvestorInfo

  // Format investor stats
  const investorStats = useMemo(() => {
    if (!investorInfo)
      return {
        totalDeposit: "0",
        directRefsCount: 0,
        downlineRefsCount: 0,
        directRefsDeposit: "0",
        downlineRefsDeposit: "0",
        referer: "0x0000000000000000000000000000000000000000",
      }

    return {
      totalDeposit: formatUnits(investorInfo.totalDeposit || 0n, 18),
      directRefsCount: Number(investorInfo.directRefsCount || 0n),
      downlineRefsCount: Number(investorInfo.downlineRefsCount || 0n),
      directRefsDeposit: formatUnits(investorInfo.directRefsDeposit || 0n, 18),
      downlineRefsDeposit: formatUnits(investorInfo.downlineRefsDeposit || 0n, 18),
      referer: investorInfo.referer,
    }
  }, [investorInfo])

  // Calculate referral rank
  const referralRank = useMemo(() => {
    const directRefs = investorStats.directRefsCount

    if (directRefs >= 100) return { name: "Royal", color: "from-purple-600 to-pink-600" }
    if (directRefs >= 50) return { name: "Diamond", color: "from-cyan-500 to-blue-600" }
    if (directRefs >= 25) return { name: "Platinum", color: "from-slate-400 to-slate-600" }
    if (directRefs >= 10) return { name: "Gold", color: "from-amber-400 to-amber-600" }
    if (directRefs >= 5) return { name: "Silver", color: "from-gray-300 to-gray-500" }
    return { name: "Bronze", color: "from-amber-700 to-amber-900" }
  }, [investorStats.directRefsCount])

  // Format referral link
  const referralLink = useMemo(() => {
    if (!address) return ""
    return `https://5pt.finance/ref/${address}`
  }, [address])

  // Handle copy referral link
  const handleCopyLink = () => {
    if (!referralLink) return

    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    toast({
      title: "Copied!",
      description: "Referral link copied to clipboard",
    })

    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  // Handle share referral link
  const handleShareLink = () => {
    const text = "Join me on 5PT Finance and start earning daily rewards! Use my referral link:"
    const url = referralLink

    if (navigator.share) {
      navigator
        .share({
          title: "Join 5PT Finance",
          text: text,
          url: url,
        })
        .catch((error) => console.error("Share error:", error))
    } else {
      // Fallback for browsers that don't support the Web Share API
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`)
    }
  }

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Referral Network</CardTitle>
          <CardDescription>Connect your wallet to view your referral network</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <div className="text-center space-y-4">
            <Users className="h-16 w-16 text-purple-400 mx-auto opacity-50" />
            <h3 className="text-xl font-medium">Wallet Not Connected</h3>
            <p className="text-muted-foreground max-w-md">
              Connect your wallet to view your referral network, earnings, and status.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Referral Network</CardTitle>
              <CardDescription>Your referral network performance and earnings</CardDescription>
            </div>
            <Badge className={`bg-gradient-to-r ${referralRank.color} text-white self-start md:self-auto`}>
              {referralRank.name} Rank
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="overview" className="data-[state=active]:bg-purple-900/50">
                Overview
              </TabsTrigger>
              <TabsTrigger value="network" className="data-[state=active]:bg-purple-900/50">
                Network
              </TabsTrigger>
              <TabsTrigger value="earnings" className="data-[state=active]:bg-purple-900/50">
                Earnings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center">
                    <Users className="h-5 w-5 mr-2 text-purple-400" />
                    Referral Statistics
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-purple-900/20 rounded-lg border border-purple-500/20">
                      <div className="text-sm text-muted-foreground mb-1">Direct Referrals</div>
                      <div className="text-2xl font-bold text-purple-300">
                        {isLoading ? <Skeleton className="h-8 w-20" /> : investorStats.directRefsCount.toLocaleString()}
                      </div>
                    </div>

                    <div className="p-4 bg-purple-900/20 rounded-lg border border-purple-500/20">
                      <div className="text-sm text-muted-foreground mb-1">Downline Referrals</div>
                      <div className="text-2xl font-bold text-purple-300">
                        {isLoading ? (
                          <Skeleton className="h-8 w-20" />
                        ) : (
                          investorStats.downlineRefsCount.toLocaleString()
                        )}
                      </div>
                    </div>

                    <div className="p-4 bg-purple-900/20 rounded-lg border border-purple-500/20">
                      <div className="text-sm text-muted-foreground mb-1">Direct Volume</div>
                      <div className="text-2xl font-bold text-purple-300">
                        {isLoading ? (
                          <Skeleton className="h-8 w-20" />
                        ) : (
                          `${Number(investorStats.directRefsDeposit).toLocaleString(undefined, { maximumFractionDigits: 0 })} 5PT`
                        )}
                      </div>
                    </div>

                    <div className="p-4 bg-purple-900/20 rounded-lg border border-purple-500/20">
                      <div className="text-sm text-muted-foreground mb-1">Downline Volume</div>
                      <div className="text-2xl font-bold text-purple-300">
                        {isLoading ? (
                          <Skeleton className="h-8 w-20" />
                        ) : (
                          `${Number(investorStats.downlineRefsDeposit).toLocaleString(undefined, { maximumFractionDigits: 0 })} 5PT`
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-muted-foreground">Rank Progress</span>
                        <span className="text-sm">
                          {isLoading ? (
                            <Skeleton className="h-4 w-20 inline-block" />
                          ) : (
                            <>
                              <span className="font-medium text-purple-300">{investorStats.directRefsCount}</span>
                              <span className="text-muted-foreground">
                                {" / "}
                                {referralRank.name === "Royal"
                                  ? "100+"
                                  : referralRank.name === "Diamond"
                                    ? "100"
                                    : referralRank.name === "Platinum"
                                      ? "50"
                                      : referralRank.name === "Gold"
                                        ? "25"
                                        : referralRank.name === "Silver"
                                          ? "10"
                                          : "5"}
                              </span>
                            </>
                          )}
                        </span>
                      </div>
                      <Progress
                        value={
                          referralRank.name === "Royal"
                            ? 100
                            : referralRank.name === "Diamond"
                              ? (investorStats.directRefsCount / 100) * 100
                              : referralRank.name === "Platinum"
                                ? (investorStats.directRefsCount / 50) * 100
                                : referralRank.name === "Gold"
                                  ? (investorStats.directRefsCount / 25) * 100
                                  : referralRank.name === "Silver"
                                    ? (investorStats.directRefsCount / 10) * 100
                                    : (investorStats.directRefsCount / 5) * 100
                        }
                        className="h-2"
                        indicatorClassName={`bg-gradient-to-r ${referralRank.color}`}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center">
                    <Share2 className="h-5 w-5 mr-2 text-purple-400" />
                    Your Referral Link
                  </h3>

                  <div className="p-4 bg-purple-900/20 rounded-lg border border-purple-500/20">
                    <div className="relative flex items-center mb-4">
                      <input
                        type="text"
                        value={referralLink}
                        readOnly
                        className="w-full rounded-md border border-purple-500/30 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pr-20"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1 h-7 text-purple-300 hover:text-purple-100 hover:bg-purple-900/50"
                        onClick={handleCopyLink}
                      >
                        {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                        {copied ? "Copied" : "Copy"}
                      </Button>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        onClick={handleShareLink}
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share Link
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full border-purple-500/30 hover:bg-purple-900/20"
                        onClick={handleCopyLink}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Link
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 bg-purple-900/20 rounded-lg border border-purple-500/20">
                    <h4 className="text-sm font-medium mb-3">Referral Benefits</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <div className="mr-2 h-5 w-5 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-300">
                          ✓
                        </div>
                        <span>Earn 5% of your direct referrals' deposits</span>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-2 h-5 w-5 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-300">
                          ✓
                        </div>
                        <span>Earn 2% of your downline referrals' deposits</span>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-2 h-5 w-5 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-300">
                          ✓
                        </div>
                        <span>Unlock higher ranks with more benefits</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="network" className="space-y-6 mt-0">
              <div className="p-6 bg-purple-900/20 rounded-lg border border-purple-500/20 flex items-center justify-center">
                <div className="text-center">
                  <Network className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium mb-2">Network Visualization</h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-4">
                    Your referral network visualization will appear here, showing your direct and downline referrals.
                  </p>
                  <Badge className={`bg-gradient-to-r ${referralRank.color} text-white`}>
                    {referralRank.name} Rank
                  </Badge>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Referral Levels</CardTitle>
                  <CardDescription>Breakdown of your referral network by level</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-purple-900/10 rounded-lg border border-purple-500/10">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
                          <span className="font-bold">1</span>
                        </div>
                        <div>
                          <div className="font-medium">Level 1 (Direct)</div>
                          <div className="text-xs text-muted-foreground">Your direct referrals</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-purple-300">
                          {isLoading ? <Skeleton className="h-5 w-16 inline-block" /> : investorStats.directRefsCount}
                        </div>
                        <div className="text-xs text-muted-foreground">5% commission</div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-purple-900/10 rounded-lg border border-purple-500/10">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
                          <span className="font-bold">2</span>
                        </div>
                        <div>
                          <div className="font-medium">Level 2-10 (Downline)</div>
                          <div className="text-xs text-muted-foreground">Your extended network</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-purple-300">
                          {isLoading ? (
                            <Skeleton className="h-5 w-16 inline-block" />
                          ) : (
                            investorStats.downlineRefsCount - investorStats.directRefsCount
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">2% commission</div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-purple-900/10 rounded-lg border border-purple-500/10">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
                          <span className="font-bold">Σ</span>
                        </div>
                        <div>
                          <div className="font-medium">Total Network</div>
                          <div className="text-xs text-muted-foreground">All referrals</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-purple-300">
                          {isLoading ? <Skeleton className="h-5 w-16 inline-block" /> : investorStats.downlineRefsCount}
                        </div>
                        <div className="text-xs text-muted-foreground">Combined</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="earnings" className="space-y-6 mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Referral Earnings</CardTitle>
                  <CardDescription>Your earnings from referral commissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="p-4 bg-purple-900/20 rounded-lg border border-purple-500/20">
                      <div className="text-sm text-muted-foreground mb-1">Total Earned</div>
                      <div className="text-2xl font-bold text-purple-300">
                        {isLoading ? <Skeleton className="h-8 w-20" /> : "1,250 5PT"}
                      </div>
                    </div>

                    <div className="p-4 bg-purple-900/20 rounded-lg border border-purple-500/20">
                      <div className="text-sm text-muted-foreground mb-1">Direct Commissions</div>
                      <div className="text-2xl font-bold text-purple-300">
                        {isLoading ? <Skeleton className="h-8 w-20" /> : "950 5PT"}
                      </div>
                    </div>

                    <div className="p-4 bg-purple-900/20 rounded-lg border border-purple-500/20">
                      <div className="text-sm text-muted-foreground mb-1">Downline Commissions</div>
                      <div className="text-2xl font-bold text-purple-300">
                        {isLoading ? <Skeleton className="h-8 w-20" /> : "300 5PT"}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-purple-900/20 rounded-lg border border-purple-500/20 flex items-center justify-center">
                    <div className="text-center">
                      <Award className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                      <h3 className="text-xl font-medium mb-2">Earnings Chart</h3>
                      <p className="text-muted-foreground max-w-md mx-auto">
                        Your referral earnings chart will appear here, showing your earnings over time.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Rank Benefits</CardTitle>
                  <CardDescription>Benefits and bonuses for each referral rank</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-purple-900/10 rounded-lg border border-purple-500/10">
                      <div className="flex items-center">
                        <Badge className="bg-gradient-to-r from-amber-700 to-amber-900 text-white mr-3">Bronze</Badge>
                        <div>
                          <div className="font-medium">Bronze Rank</div>
                          <div className="text-xs text-muted-foreground">5+ direct referrals</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">Standard commissions</div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-purple-900/10 rounded-lg border border-purple-500/10">
                      <div className="flex items-center">
                        <Badge className="bg-gradient-to-r from-gray-300 to-gray-500 text-white mr-3">Silver</Badge>
                        <div>
                          <div className="font-medium">Silver Rank</div>
                          <div className="text-xs text-muted-foreground">10+ direct referrals</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">+0.5% bonus commission</div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-purple-900/10 rounded-lg border border-purple-500/10">
                      <div className="flex items-center">
                        <Badge className="bg-gradient-to-r from-amber-400 to-amber-600 text-white mr-3">Gold</Badge>
                        <div>
                          <div className="font-medium">Gold Rank</div>
                          <div className="text-xs text-muted-foreground">25+ direct referrals</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">+1% bonus commission</div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-purple-900/10 rounded-lg border border-purple-500/10">
                      <div className="flex items-center">
                        <Badge className="bg-gradient-to-r from-slate-400 to-slate-600 text-white mr-3">Platinum</Badge>
                        <div>
                          <div className="font-medium">Platinum Rank</div>
                          <div className="text-xs text-muted-foreground">50+ direct referrals</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">+1.5% bonus commission</div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-purple-900/10 rounded-lg border border-purple-500/10">
                      <div className="flex items-center">
                        <Badge className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white mr-3">Diamond</Badge>
                        <div>
                          <div className="font-medium">Diamond Rank</div>
                          <div className="text-xs text-muted-foreground">100+ direct referrals</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">+2% bonus commission</div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-purple-900/10 rounded-lg border border-purple-500/10">
                      <div className="flex items-center">
                        <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white mr-3">Royal</Badge>
                        <div>
                          <div className="font-medium">Royal Rank</div>
                          <div className="text-xs text-muted-foreground">100+ direct referrals with high volume</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">+3% bonus commission + special rewards</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
