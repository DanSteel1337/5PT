"use client"

import Link from "next/link"
import { SimpleWalletConnect } from "@/components/simple-wallet-connect"

export function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-black/20 backdrop-blur-md">
      <div className="flex items-center">
        <Link href="/" className="text-xl font-bold text-white">
          5PT Platform
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="px-4 py-2 text-sm text-purple-200 hover:text-white transition-colors">
          Dashboard
        </Link>
        <SimpleWalletConnect />
      </div>
    </nav>
  )
}
