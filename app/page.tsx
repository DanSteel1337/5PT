import { AuthCheck } from "@/components/web3/AuthCheck"
import {
  DashboardHeroWrapper,
  EarningsOverviewWrapper,
  RewardsBreakdownWrapper,
  RankVisualizerWrapper,
  ActivePoolsWrapper,
  AiInsightsWrapper,
} from "./client-components"

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight neon-text">Dashboard</h1>
        <p className="text-muted-foreground">Your Five Pillars Investment Overview</p>
      </div>

      <AuthCheck>
        <DashboardHeroWrapper />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2">
            <EarningsOverviewWrapper />
          </div>
          <RewardsBreakdownWrapper />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <RankVisualizerWrapper />
          <ActivePoolsWrapper />
        </div>

        <AiInsightsWrapper />
      </AuthCheck>
    </div>
  )
}
