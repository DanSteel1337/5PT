import type React from "react"
import { Providers } from "@/components/providers/Providers"
import { InvestmentDataProvider } from "@/providers/InvestmentDataProvider"
import "./globals.css"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <InvestmentDataProvider>{children}</InvestmentDataProvider>
        </Providers>
      </body>
    </html>
  )
}
// This file might be setting global context with token symbols
export const metadata = {
      generator: 'v0.dev'
    };
