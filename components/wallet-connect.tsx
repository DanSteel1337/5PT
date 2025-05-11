"use client"

import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useAccount } from "wagmi"

export function WalletConnect() {
  const { isConnected } = useAccount()

  return (
    <div className="flex items-center justify-center">
      <ConnectButton />
    </div>
  )
}
