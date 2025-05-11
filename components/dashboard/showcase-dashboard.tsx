"use client"

import { useState } from "react"
import { useAccount } from "wagmi"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TokenMetricsCard } from "@/components/dashboard/token-metrics-card"
import { InvestmentPerformanceCard } from "@/components/dashboard/investment-performance-card"
import { PoolStatusGrid } from "@/components/dashboard/pool-status-grid"
import { ReferralNetworkCard } from "@/components/dashboard/referral-network-card"
import { ContractStatisticsCard } from "@/components/dashboard/contract-statistics-card"
import { ShareCard } from "@/components/dashboard/share-card"
import { Button } from "@/components/ui/button"
import { Download, RefreshCw, Share2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { captureScreenshot, isScreenshotSupported, downloadDataUrl } from "@/lib/html2canvas-util"

export function ShowcaseDashboard() {
  const { address, isConnected } = useAccount()
  const { toast } = useToast()
  const [refreshing, setRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [isCapturingScreenshot, setIsCapturingScreenshot] = useState(false)

  // Function to handle manual refresh of data
  const handleRefresh = () => {
    setRefreshing(true)
    // Simulate refresh delay
    setTimeout(() => {
      setRefreshing(false)
      toast({
        title: "Dashboard Refreshed",
        description: "All data has been updated to the latest values.",
      })
    }, 1500)
  }

  // Function to capture and download dashboard screenshot - completely rewritten
  const handleCaptureScreenshot = () => {
    // Check if screenshot functionality is supported
    if (!isScreenshotSupported()) {
      toast({
        title: "Screenshot Feature Unavailable",
        description: "This feature is not available in your current environment.",
        variant: "destructive",
      })
      return
    }

    setIsCapturingScreenshot(true)
    toast({
      title: "Preparing Screenshot",
      description: "Creating your dashboard image...",
    })

    captureScreenshot(
      "dashboard-capture",
      (dataUrl) => {
        // Success handler
        downloadDataUrl(dataUrl, "5PT-Dashboard-Showcase.png")
        setIsCapturingScreenshot(false)
        toast({
          title: "Screenshot Captured!",
          description: "Your dashboard image has been downloaded.",
        })
      },
      (error) => {
        // Error handler
        setIsCapturingScreenshot(false)
        toast({
          title: "Screenshot Failed",
          description: error.message || "There was an error creating your dashboard image.",
          variant: "destructive",
        })
      },
    )
  }

  // Function to share dashboard on social media
  const shareDashboard = () => {
    const text =
      "Check out my 5PT investment performance! Join the Five Pillars Token ecosystem and start earning today. #5PT #CryptoInvesting"
    const url = "https://5pt.finance"

    // Open share dialog
    if (navigator.share) {
      navigator
        .share({
          title: "My 5PT Dashboard",
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
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold gradient-text">5PT Investment Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Complete overview of your Five Pillars Token investment performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-purple-500/30 hover:bg-purple-900/20"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Refreshing..." : "Refresh Data"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-purple-500/30 hover:bg-purple-900/20"
            onClick={handleCaptureScreenshot}
            disabled={isCapturingScreenshot}
          >
            <Download className="h-4 w-4 mr-2" />
            {isCapturingScreenshot ? "Capturing..." : "Screenshot"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-purple-500/30 hover:bg-purple-900/20"
            onClick={shareDashboard}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-6">
          <TabsTrigger value="overview" className="data-[state=active]:bg-purple-900/50">
            Overview
          </TabsTrigger>
          <TabsTrigger value="investments" className="data-[state=active]:bg-purple-900/50">
            Investments
          </TabsTrigger>
          <TabsTrigger value="pools" className="data-[state=active]:bg-purple-900/50">
            Pools
          </TabsTrigger>
          <TabsTrigger value="referrals" className="data-[state=active]:bg-purple-900/50">
            Referrals
          </TabsTrigger>
          <TabsTrigger value="statistics" className="data-[state=active]:bg-purple-900/50">
            Statistics
          </TabsTrigger>
        </TabsList>

        <div id="dashboard-capture" className="space-y-6">
          <TabsContent value="overview" className="space-y-6 mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TokenMetricsCard />
              <InvestmentPerformanceCard />
            </div>
            <ContractStatisticsCard />
            <ShareCard />
          </TabsContent>

          <TabsContent value="investments" className="space-y-6 mt-0">
            <InvestmentPerformanceCard expanded={true} />
            <Card>
              <CardHeader>
                <CardTitle>Investment History</CardTitle>
                <CardDescription>Your deposit and reward history over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] flex items-center justify-center">
                  <p className="text-muted-foreground">Investment history chart will appear here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pools" className="mt-0">
            <PoolStatusGrid />
          </TabsContent>

          <TabsContent value="referrals" className="mt-0">
            <ReferralNetworkCard />
          </TabsContent>

          <TabsContent value="statistics" className="space-y-6 mt-0">
            <ContractStatisticsCard expanded={true} />
            <TokenMetricsCard expanded={true} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
