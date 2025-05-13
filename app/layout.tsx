import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
// ✅ CRITICAL: Import RainbowKit styles at the root level
// This ensures proper styling of the RainbowKit modal and components
import "@rainbow-me/rainbowkit/styles.css"
import { Suspense } from "react"

// Import the Providers component directly, but render it with Suspense
import Providers from "@/components/providers/Providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "5PT Investment Manager | BSC DeFi Platform",
  description:
    "Maximize your crypto investments with 5PT Investment Manager. Earn passive income through our innovative BSC DeFi platform with referral bonuses and pool rewards.",
  keywords: "BSC, DeFi, investment, crypto, blockchain, passive income, staking, rewards",
  authors: [{ name: "5PT Finance Team" }],
  openGraph: {
    title: "5PT Investment Manager | BSC DeFi Platform",
    description: "Earn up to 15% daily returns with our revolutionary BSC investment platform",
    images: ["/images/5pt-logo.png"],
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* 
        IMPORTANT: 
        1. suppressHydrationWarning is required to prevent hydration errors with RainbowKit
        2. The body must have position:relative for proper modal positioning
        3. RainbowKit styles MUST be imported in this file, not in client components
      */}
      <body className={inter.className}>
        <Suspense fallback={<div className="min-h-screen bg-black"></div>}>
          <Providers>{children}</Providers>
        </Suspense>
      </body>
    </html>
  )
}
