import Link from "next/link"
import { AuthCheck } from "@/components/web3/AuthCheck"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { PoolDetailWrapper } from "./client-components"

interface PoolDetailPageProps {
  params: {
    id: string
  }
}

export default function PoolDetailPage({ params }: PoolDetailPageProps) {
  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/pools">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Pools
          </Link>
        </Button>

        <h1 className="text-3xl font-bold tracking-tight">Pool Details</h1>
        <p className="text-muted-foreground">View detailed information and invest in this pool</p>
      </div>

      <AuthCheck>
        <PoolDetailWrapper poolId={params.id} />
      </AuthCheck>
    </div>
  )
}
