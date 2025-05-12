import type React from "react"
import "./globals.css"
import { Providers } from "@/components/providers/Providers"
import { AppShell } from "@/components/layout/AppShell"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Five Pillars Investment Platform",
  description: "Invest in the Five Pillars ecosystem and earn rewards",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  )
}
