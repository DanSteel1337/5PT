"use client"

import { useAccount, useBalance, useNetwork } from "wagmi"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatUnits } from "viem"
import { Loader2 } from "lucide-react"

export function WalletInfo() {
  const { address, isConnected } = useAccount()
  const { chain } = useNetwork()
  const { data: balance, isLoading: isBalanceLoading } = useBalance({
    address,
  })

  if (!isConnected || !address) {
    return (
      <Card className="bg-black/20 border-white/10">
        <CardHeader>
          <CardTitle>Wallet Info</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Connect your wallet to view details</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-black/20 border-white/10">
      <CardHeader>
        <CardTitle>Wallet Info</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Address</p>
          <p className="font-mono text-xs break-all">{address}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Network</p>
          <p>{chain?.name || "Unknown"}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Balance</p>
          {isBalanceLoading ? (
            <div className="flex items-center">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Loading...
            </div>
          ) : balance ? (
            <p>
              {Number.parseFloat(formatUnits(balance.value, balance.decimals)).toFixed(4)} {balance.symbol}
            </p>
          ) : (
            <p>Unable to load balance</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
