import { AuthCheck } from "@/components/web3/AuthCheck"
import {
  RewardsOverviewWrapper,
  RewardsClaimerWrapper,
  RewardsHistoryWrapper,
  RewardsStatsWrapper,
} from "./client-components"

export default function RewardsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Rewards</h1>
        <p className="text-muted-foreground">Track and claim your investment rewards</p>
      </div>

      <AuthCheck>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RewardsOverviewWrapper />
          </div>
          <div>
            <RewardsClaimerWrapper />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <RewardsHistoryWrapper />
          <RewardsStatsWrapper />
        </div>
      </AuthCheck>
    </div>
  )
}
