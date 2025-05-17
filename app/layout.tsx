import type React from "react"
/**
 * @file app/layout.tsx
 * @description Root layout component for the application
 *
 * IMPORTANT ARCHITECTURE NOTE:
 * - This is the ONLY place where the Providers component should be used
 * - This layout wraps ALL pages in the application
 * - DO NOT create additional provider wrappers elsewhere
 *
 * This component:
 * 1. Sets up the HTML and body structure
 * 2. Includes global styles
 * 3. Wraps the application with the Providers component
 */

import { Providers } from "@/components/providers/Providers"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "5PT Investment Platform",
  description: "Invest in the future of decentralized finance with 5PT",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
