"use client"

import { ConnectButton } from "@rainbow-me/rainbowkit"

export function SimpleWalletConnect() {
  return <ConnectButton label="Connect Wallet" accountStatus="address" chainStatus="icon" showBalance={false} />
}
