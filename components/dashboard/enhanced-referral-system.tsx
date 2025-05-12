"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { useAccount, useReadContract } from "wagmi"
import { CONTRACT_ADDRESSES, INVESTMENT_MANAGER_ABI } from "@/lib/contracts"
import { formatUnits } from "viem"
import { useToast } from "@/hooks/use-toast"
import {
  Users,
  Award,
  Copy,
  Check,
  Share2,
  Network,
  TrendingUp,
  UserPlus,
  Gift,
  ChevronRight,
  Coins,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { mockReferrals } from "@/lib/mock-data"

// Mock data for referral earnings over time
const generateReferralEarningsData = (days: number) => {
  let cumulativeEarnings = 0
  return Array.from({ length: days }, (_, i) => {
    const date = new Date(Date.now() - (days - 1 - i) * 24 * 60 * 60 * 1000)
    // Random daily earnings between 5 and 50
    const dailyEarnings = Math.random() * 45 + 5
    cumulativeEarnings += dailyEarnings

    return {
      date: date.toISOString().split("T")[0],
      dailyEarnings: Number.parseFloat(dailyEarnings.toFixed(2)),
      cumulativeEarnings: Number.parseFloat(cumulativeEarnings.toFixed(2)),
    }
  })
}

// Mock data for referral network distribution
const referralNetworkData = [
  { name: "Direct Referrals", value: 65 },
  { name: "Level 2", value: 25 },
  { name: "Level 3+", value: 10 },
]

// Colors for pie chart
const COLORS = ["#8b5cf6", "#c026d3", "#7c3aed"]

export function EnhancedReferralSystem() {
  const { address, isConnected } = useAccount()
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [referralEarningsData, setReferralEarningsData] = useState<any[]>([])
  const referralLink = isConnected ? `https://5pt.finance/ref/${address}` : "https://5pt.finance/ref/preview-mode"

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

  // Generate referral earnings data on component mount
  useEffect(() => {
    const data = generateReferralEarningsData(30)
    setReferralEarningsData(data)
  }, [])

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
  // const referralLink = useMemo(() => {
  //   if (!address) return ""
  //   return `https://5pt.finance/ref/${address}`
  // }, [address])

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

  // Calculate total referral earnings
  const totalReferralEarnings = useMemo(() => {
    // In a real app, this would come from the contract
    // For now, we'll use a mock calculation based on deposits
    const directEarnings = Number(investorStats.directRefsDeposit) * 0.05
    const downlineEarnings =
      (Number(investorStats.downlineRefsDeposit) - Number(investorStats.directRefsDeposit)) * 0.02
    return directEarnings + downlineEarnings
  }, [investorStats.directRefsDeposit, investorStats.downlineRefsDeposit])

  const copyToClipboard = () => {
    setCopied(true)
    navigator.clipboard.writeText(referralLink)
    toast({
      title: "Copied!",
      description: "Referral link copied to clipboard",
    })
    setTimeout(() => setCopied(false), 2000)
  }

  if (!isConnected) {
    return (
      <Card className="border-purple-500/20 bg-black/40 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/20 pointer-events-none" />

        <CardHeader>
          <CardTitle>Referral Program</CardTitle>
          <CardDescription>Connect your wallet to view your referral network</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10">
          {/* <div className="text-center space-y-4">
            <Users className="h-16 w-16 text-purple-400 mx-auto opacity-50" />
            <h3 className="text-xl font-medium">Wallet Not Connected</h3>
            <p className="text-muted-foreground max-w-md">
              Connect your wallet to view your referral network, earnings, and status.
            </p>
          </div> */}
          <div className="space-y-4 w-full">
            <div className="space-y-2">
              <div className="text-sm font-medium">Your Referral Link</div>
              <div className="flex space-x-2">
                <Input value={referralLink} readOnly className="bg-black/20 border-purple-500/30 text-purple-300" />
                <Button
                  size="icon"
                  variant="outline"
                  className="border-purple-500/30 hover:bg-purple-900/20"
                  onClick={copyToClipboard}
                >
                  {copied ? <span className="text-green-500 text-xs">Copied!</span> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-sm font-medium">Share your link</div>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-purple-500/30 hover:bg-purple-900/20"
                  onClick={handleShareLink}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Recent Referrals</div>
              <div className="space-y-2">
                {mockReferrals.map((referral) => (
                  <div
                    key={referral.id}
                    className="flex justify-between items-center p-2 rounded-md bg-black/20 border border-purple-500/10"
                  >
                    <div className="text-sm">{referral.address}</div>
                    <div className="text-sm font-medium text-purple-300">${referral.earnings}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-purple-500/20 bg-black/40 backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/20 pointer-events-none" />

      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Referral Program</CardTitle>
            <CardDescription>Earn rewards by referring new investors</CardDescription>
          </div>
          <Badge className={`bg-gradient-to-r ${referralRank.color} text-white self-start md:self-auto`}>
            {referralRank.name} Rank
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="network" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Network
            </TabsTrigger>
            <TabsTrigger value="earnings" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Earnings
            </TabsTrigger>
            <TabsTrigger
              value="leaderboard"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              Leaderboard
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
                      {isLoading ? <Skeleton className="h-8 w-20" /> : investorStats.downlineRefsCount.toLocaleString()}
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
                    <div className="text-sm text-muted-foreground mb-1">Total Earnings</div>
                    <div className="text-2xl font-bold text-purple-300">
                      {isLoading ? (
                        <Skeleton className="h-8 w-20" />
                      ) : (
                        `${totalReferralEarnings.toLocaleString(undefined, { maximumFractionDigits: 0 })} 5PT`
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

                <div className="p-4 bg-purple-900/20 rounded-lg border border-purple-500/20 space-y-4">
                  <h4 className="text-sm font-medium">Quick Stats</h4>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-muted-foreground">Conversion Rate</span>
                        <span className="text-sm font-medium text-purple-300">32%</span>
                      </div>
                      <Progress value={32} className="h-2" indicatorClassName="bg-purple-500" />
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-muted-foreground">Link Clicks</span>
                        <span className="text-sm font-medium text-purple-300">128</span>
                      </div>
                      <Progress value={60} className="h-2" indicatorClassName="bg-pink-500" />
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-muted-foreground">Earnings Growth</span>
                        <span className="text-sm font-medium text-purple-300">+18% this month</span>
                      </div>
                      <Progress
                        value={18}
                        className="h-2"
                        indicatorClassName="bg-gradient-to-r from-purple-500 to-pink-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg border border-purple-500/20">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium flex items-center">
                      <Gift className="h-4 w-4 mr-2 text-purple-400" />
                      Referral Rewards
                    </h4>
                    <Badge variant="outline" className="bg-purple-500/10 text-purple-300 border-purple-500/30">
                      New
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">
                    Invite 5 friends who deposit at least 1000 5PT and receive a special bonus reward!
                  </p>

                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    <Gift className="h-4 w-4 mr-2" />
                    Claim Special Bonus
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="network" className="space-y-6 mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Card className="border-purple-500/20 bg-black/20 backdrop-blur-sm h-full">
                  <CardHeader>
                    <CardTitle className="text-lg">Network Visualization</CardTitle>
                    <CardDescription>Distribution of your referral network</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={referralNetworkData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {referralNetworkData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip content={<ChartTooltipContent formatter={(value) => `${value}%`} />} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="border-purple-500/20 bg-black/20 backdrop-blur-sm h-full">
                  <CardHeader>
                    <CardTitle className="text-lg">Referral Levels</CardTitle>
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
                            {isLoading ? (
                              <Skeleton className="h-5 w-16 inline-block" />
                            ) : (
                              investorStats.downlineRefsCount
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">Combined</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <Button variant="outline" className="w-full border-purple-500/30 hover:bg-purple-900/20">
                        <Network className="h-4 w-4 mr-2" />
                        View Full Network
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Card className="border-purple-500/20 bg-black/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Top Performers</CardTitle>
                <CardDescription>Your most active referrals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center p-3 bg-purple-900/10 rounded-lg border border-purple-500/10"
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
                          <UserPlus className="h-5 w-5 text-purple-400" />
                        </div>
                        <div>
                          <div className="font-medium">
                            0x{Math.random().toString(16).substring(2, 10)}...
                            {Math.random().toString(16).substring(2, 6)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Joined {Math.floor(Math.random() * 30) + 1} days ago
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-purple-300">
                          {(Math.random() * 5000 + 1000).toFixed(0)} 5PT
                        </div>
                        <div className="text-xs text-muted-foreground">Total deposits</div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground ml-2" />
                    </div>
                  ))}

                  <Button variant="outline" className="w-full border-purple-500/30 hover:bg-purple-900/20">
                    View All Referrals
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="earnings" className="space-y-6 mt-0">
            <Card className="border-purple-500/20 bg-black/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Referral Earnings</CardTitle>
                <CardDescription>Your earnings from referral commissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-purple-900/20 rounded-lg border border-purple-500/20">
                    <div className="text-sm text-muted-foreground mb-1">Total Earned</div>
                    <div className="text-2xl font-bold text-purple-300">
                      {isLoading ? (
                        <Skeleton className="h-8 w-20" />
                      ) : (
                        `${totalReferralEarnings.toLocaleString(undefined, { maximumFractionDigits: 0 })} 5PT`
                      )}
                    </div>
                  </div>

                  <div className="p-4 bg-purple-900/20 rounded-lg border border-purple-500/20">
                    <div className="text-sm text-muted-foreground mb-1">Direct Commissions</div>
                    <div className="text-2xl font-bold text-purple-300">
                      {isLoading ? (
                        <Skeleton className="h-8 w-20" />
                      ) : (
                        `${(Number(investorStats.directRefsDeposit) * 0.05).toLocaleString(undefined, { maximumFractionDigits: 0 })} 5PT`
                      )}
                    </div>
                  </div>

                  <div className="p-4 bg-purple-900/20 rounded-lg border border-purple-500/20">
                    <div className="text-sm text-muted-foreground mb-1">Downline Commissions</div>
                    <div className="text-2xl font-bold text-purple-300">
                      {isLoading ? (
                        <Skeleton className="h-8 w-20" />
                      ) : (
                        `${((Number(investorStats.downlineRefsDeposit) - Number(investorStats.directRefsDeposit)) * 0.02).toLocaleString(undefined, { maximumFractionDigits: 0 })} 5PT`
                      )}
                    </div>
                  </div>
                </div>

                <div className="h-[300px] mb-6">
                  <ChartContainer
                    config={{
                      dailyEarnings: {
                        label: "Daily Earnings",
                        color: "hsl(var(--chart-1))",
                      },
                      cumulativeEarnings: {
                        label: "Cumulative Earnings",
                        color: "hsl(var(--chart-2))",
                      },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={referralEarningsData}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis
                          dataKey="date"
                          tickFormatter={(value) => {
                            const date = new Date(value)
                            return `${date.getMonth() + 1}/${date.getDate()}`
                          }}
                        />
                        <YAxis yAxisId="left" tickFormatter={(value) => `${value} 5PT`} />
                        <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `${value} 5PT`} />
                        <Tooltip
                          content={
                            <ChartTooltipContent formatter={(value) => `${Number(value).toLocaleString()} 5PT`} />
                          }
                        />
                        <Legend />
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="dailyEarnings"
                          stroke="var(--color-dailyEarnings)"
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 8, fill: "hsl(var(--chart-1))" }}
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="cumulativeEarnings"
                          stroke="var(--color-cumulativeEarnings)"
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 8, fill: "hsl(var(--chart-2))" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>

                <Card className="border-purple-500/20 bg-black/10">
                  <CardHeader className="py-3">
                    <CardTitle className="text-base">Rank Benefits</CardTitle>
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

                      <Button variant="outline" className="w-full border-purple-500/30 hover:bg-purple-900/20">
                        View All Ranks
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-6 mt-0">
            <Card className="border-purple-500/20 bg-black/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Referral Leaderboard</CardTitle>
                <CardDescription>Top referrers in the 5PT ecosystem</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center p-3 bg-purple-900/10 rounded-lg border border-purple-500/10"
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
                          <span className="font-bold">{i}</span>
                        </div>
                        <div>
                          <div className="font-medium">
                            0x{Math.random().toString(16).substring(2, 10)}...
                            {Math.random().toString(16).substring(2, 6)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            <Badge
                              className={`bg-gradient-to-r ${i === 1 ? "from-purple-600 to-pink-600" : i === 2 ? "from-cyan-500 to-blue-600" : i === 3 ? "from-slate-400 to-slate-600" : "from-amber-400 to-amber-600"} text-white mr-1`}
                            >
                              {i === 1 ? "Royal" : i === 2 ? "Diamond" : i === 3 ? "Platinum" : "Gold"}
                            </Badge>
                            Rank
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-purple-300">{(Math.random() * 100 + 50).toFixed(0)}</div>
                        <div className="text-xs text-muted-foreground">Referrals</div>
                      </div>
                      <div className="text-right ml-6">
                        <div className="font-medium text-purple-300">
                          {(Math.random() * 50000 + 10000).toFixed(0)} 5PT
                        </div>
                        <div className="text-xs text-muted-foreground">Volume</div>
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-between items-center p-3 bg-purple-900/20 rounded-lg border border-purple-500/20">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-purple-600/30 flex items-center justify-center mr-3">
                        <span className="font-bold">?</span>
                      </div>
                      <div>
                        <div className="font-medium">Your Ranking</div>
                        <div className="text-xs text-muted-foreground">
                          <Badge className={`bg-gradient-to-r ${referralRank.color} text-white mr-1`}>
                            {referralRank.name}
                          </Badge>
                          Rank
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-purple-300">{investorStats.directRefsCount}</div>
                      <div className="text-xs text-muted-foreground">Referrals</div>
                    </div>
                    <div className="text-right ml-6">
                      <div className="font-medium text-purple-300">
                        {Number(investorStats.directRefsDeposit).toLocaleString(undefined, {
                          maximumFractionDigits: 0,
                        })}{" "}
                        5PT
                      </div>
                      <div className="text-xs text-muted-foreground">Volume</div>
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Improve Your Ranking
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-500/20 bg-black/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Monthly Rewards</CardTitle>
                <CardDescription>Special rewards for top referrers each month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg border border-purple-500/20">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium flex items-center">
                        <Award className="h-4 w-4 mr-2 text-purple-400" />
                        Top Referrer Bonus
                      </h4>
                      <Badge variant="outline" className="bg-purple-500/10 text-purple-300 border-purple-500/30">
                        Monthly
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3">
                      Each month, the top 3 referrers receive special bonuses from the platform treasury!
                    </p>

                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="p-2 bg-purple-900/30 rounded-lg text-center">
                        <div className="text-xs text-muted-foreground">1st Place</div>
                        <div className="font-medium text-purple-300">10,000 5PT</div>
                      </div>

                      <div className="p-2 bg-purple-900/30 rounded-lg text-center">
                        <div className="text-xs text-muted-foreground">2nd Place</div>
                        <div className="font-medium text-purple-300">5,000 5PT</div>
                      </div>

                      <div className="p-2 bg-purple-900/30 rounded-lg text-center">
                        <div className="text-xs text-muted-foreground">3rd Place</div>
                        <div className="font-medium text-purple-300">2,500 5PT</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">Current Period Ends In</div>
                        <div className="text-xs text-muted-foreground">14 days, 6 hours</div>
                      </div>

                      <Button variant="outline" className="border-purple-500/30 hover:bg-purple-900/20">
                        <Coins className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
