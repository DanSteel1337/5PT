import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Web3Providers } from "@/components/web3-providers"

export const metadata: Metadata = {
  title: "5PT - Five Pillars Token",
  description: "Investment platform for the Five Pillars Token (5PT)",
  icons: {
    icon: "/images/5pt-logo.png",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <Web3Providers>{children}</Web3Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
