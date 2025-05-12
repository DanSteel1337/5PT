import { AuthCheck } from "@/components/web3/AuthCheck"
import { PoolListWrapper } from "./client-components"

export default function PoolsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Investment Pools</h1>
        <p className="text-muted-foreground">Browse and invest in our curated selection of yield-generating pools</p>
      </div>

      <AuthCheck>
        <PoolListWrapper />
      </AuthCheck>
    </div>
  )
}
