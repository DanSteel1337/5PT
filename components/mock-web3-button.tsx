"use client"

import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"

export function MockWeb3Button() {
  return (
    <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
      <Wallet className="mr-2 h-4 w-4" />
      Preview Mode
    </Button>
  )
}
