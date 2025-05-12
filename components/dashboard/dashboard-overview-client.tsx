"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EnhancedTokenChart } from "./enhanced-token-chart"
import { EnhancedReferralSystem } from "./enhanced-referral-system"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import { shouldUseMockData } from "@/lib/environment"
import { QueryClientProvider } from "../providers/query-client-provider"

// The component content
function DashboardOverviewClientContent() {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  // Dynamically import the component to prevent errors during SSR
  const [InvestmentAnalyticsComponent, setInvestmentAnalyticsComponent] = useState<any>(null)

  useEffect(() => {
    // Safely import the component factory
    const loadComponentFactory = async () => {
      try {
        const { getInvestmentAnalyticsComponent } = await import("../component-factory")
        setInvestmentAnalyticsComponent(getInvestmentAnalyticsComponent())
      } catch (error) {
        console.error("Failed to load component factory:", error)
      }
    }

    loadComponentFactory()
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="min-h-screen">Loading...</div>
  }

  return (
    <div className="space-y-6">
      {shouldUseMockData() && (
        <Alert className="bg-yellow-900/20 border-yellow-500/50 text-yellow-300">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Preview Mode</AlertTitle>
          <AlertDescription>
            Running in preview mode with mock data. Wallet connection and blockchain interactions are disabled.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="overview" className="text-sm md:text-base">
            Overview
          </TabsTrigger>
          <TabsTrigger value="analytics" className="text-sm md:text-base">
            Analytics
          </TabsTrigger>
          <TabsTrigger value="referrals" className="text-sm md:text-base">
            Referrals
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <EnhancedTokenChart />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {InvestmentAnalyticsComponent && <InvestmentAnalyticsComponent />}
        </TabsContent>

        <TabsContent value="referrals" className="space-y-6">
          <EnhancedReferralSystem />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Export the wrapped component
export function DashboardOverviewClient() {
  return (
    <QueryClientProvider>
      <DashboardOverviewClientContent />
    </QueryClientProvider>
  )
}
