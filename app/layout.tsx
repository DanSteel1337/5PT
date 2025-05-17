import type React from "react"
import type { Metadata } from "next"
import { Providers } from "@/components/providers/Providers"
import "./globals.css"

export const metadata: Metadata = {
  title: "5PT Investment Platform",
  description: "Decentralized investment platform for 5PT token",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {/* Add inline styles for RainbowKit to ensure they load correctly */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          :root {
            --rk-colors-accentColor: #8A2BE2;
            --rk-colors-accentColorForeground: white;
            --rk-colors-actionButtonBorder: rgba(255, 255, 255, 0.04);
            --rk-colors-actionButtonBorderMobile: rgba(255, 255, 255, 0.08);
            --rk-colors-actionButtonSecondaryBackground: rgba(255, 255, 255, 0.08);
            --rk-colors-closeButton: rgba(224, 232, 255, 0.6);
            --rk-colors-closeButtonBackground: rgba(0, 0, 0, 0.1);
            --rk-colors-connectButtonBackground: #1A1B1F;
            --rk-colors-connectButtonBackgroundError: #FF494A;
            --rk-colors-connectButtonInnerBackground: linear-gradient(0deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.12));
            --rk-colors-connectButtonText: #FFF;
            --rk-colors-connectButtonTextError: #FFF;
            --rk-colors-connectionIndicator: #30E000;
            --rk-colors-error: #FF494A;
            --rk-colors-generalBorder: rgba(255, 255, 255, 0.08);
            --rk-colors-generalBorderDim: rgba(255, 255, 255, 0.04);
            --rk-colors-menuItemBackground: rgba(224, 232, 255, 0.1);
            --rk-colors-modalBackdrop: rgba(0, 0, 0, 0.5);
            --rk-colors-modalBackground: #1A1B1F;
            --rk-colors-modalBorder: rgba(255, 255, 255, 0.08);
            --rk-colors-modalText: #FFF;
            --rk-colors-modalTextDim: rgba(224, 232, 255, 0.5);
            --rk-colors-modalTextSecondary: rgba(255, 255, 255, 0.6);
            --rk-colors-profileAction: rgba(224, 232, 255, 0.1);
            --rk-colors-profileActionHover: rgba(224, 232, 255, 0.2);
            --rk-colors-profileForeground: rgba(224, 232, 255, 0.05);
            --rk-colors-selectedOptionBorder: rgba(224, 232, 255, 0.1);
            --rk-colors-standby: #FFD641;
          }
        `,
          }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
