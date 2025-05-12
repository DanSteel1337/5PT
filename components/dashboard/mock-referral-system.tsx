"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Copy, Share2, Check } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { mockReferrals } from "@/lib/mock-data"

export function MockReferralSystem() {
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const referralLink = "https://5pt.finance/ref/preview-mode"

  const copyToClipboard = () => {
    setCopied(true)
    navigator.clipboard.writeText(referralLink)
    toast({
      title: "Copied!",
      description: "Referral link copied to clipboard",
    })
    setTimeout(() => setCopied(false), 2000)
  }

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

  return (
    <Card className="border-purple-500/20 bg-black/40 backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/20 pointer-events-none" />

      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Referral Program</CardTitle>
            <CardDescription>Earn rewards by referring new investors</CardDescription>
          </div>
          <Badge className="bg-gradient-to-r from-amber-400 to-amber-600 text-white self-start md:self-auto">
            Gold Rank
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
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
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
          </TabsContent>

          <TabsContent value="network" className="space-y-6 mt-0">
            <div className="p-4 bg-purple-900/20 rounded-lg border border-purple-500/20">
              <h4 className="text-sm font-medium mb-3">Network Statistics</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground">Direct Referrals</div>
                  <div className="text-xl font-bold text-purple-300">24</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Total Network</div>
                  <div className="text-xl font-bold text-purple-300">87</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Network Volume</div>
                  <div className="text-xl font-bold text-purple-300">125,000 5PT</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Earnings</div>
                  <div className="text-xl font-bold text-purple-300">6,250 5PT</div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="earnings" className="space-y-6 mt-0">
            <div className="p-4 bg-purple-900/20 rounded-lg border border-purple-500/20">
              <h4 className="text-sm font-medium mb-3">Earnings Summary</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground">Total Earned</div>
                  <div className="text-xl font-bold text-purple-300">6,250 5PT</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">This Month</div>
                  <div className="text-xl font-bold text-purple-300">1,250 5PT</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Direct Commissions</div>
                  <div className="text-xl font-bold text-purple-300">5,000 5PT</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Downline Commissions</div>
                  <div className="text-xl font-bold text-purple-300">1,250 5PT</div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-6 mt-0">
            <div className="p-4 bg-purple-900/20 rounded-lg border border-purple-500/20">
              <h4 className="text-sm font-medium mb-3">Top Referrers</h4>
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center p-2 rounded-md bg-black/20 border border-purple-500/10"
                  >
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center mr-2">
                        <span className="text-xs">{i}</span>
                      </div>
                      <div className="text-sm">0x{Math.random().toString(16).substring(2, 10)}...</div>
                    </div>
                    <div className="text-sm font-medium text-purple-300">{50 - i * 10} referrals</div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
