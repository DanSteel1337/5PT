"use client"

import { useAccount } from "wagmi"
import { Button } from "@/components/ui/button"
import { ConnectKitButton } from "connectkit"

interface PoolsHeaderProps {
  className?: string
}

export function PoolsHeader({ className }: PoolsHeaderProps) {
  const { isConnected } = useAccount()

  return (
    <div className={`flex justify-between items-center ${className}`}>
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gold-light via-gold to-gold-dark bg-clip-text text-transparent">
          Investment Pools
        </h1>
        <p className="text-gray-400 mt-1">Join investment pools to earn rewards based on your stake</p>
      </div>

      {!isConnected && (
        <ConnectKitButton.Custom>
          {({ show }) => (
            <Button
              onClick={show}
              className="bg-gradient-to-r from-gold-dark to-gold-light hover:from-gold hover:to-gold-light text-black font-bold"
            >
              Connect Wallet
            </Button>
          )}
        </ConnectKitButton.Custom>
      )}
    </div>
  )
}
