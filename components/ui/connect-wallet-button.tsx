"use client"

import { ConnectKitButton } from "connectkit"
import { Button } from "@/components/ui/button"

export function ConnectWalletButton() {
  return (
    <ConnectKitButton.Custom>
      {({ show }) => (
        <Button onClick={show} className="bg-amber-700 hover:bg-amber-600 text-white font-bold">
          Connect Wallet
        </Button>
      )}
    </ConnectKitButton.Custom>
  )
}
