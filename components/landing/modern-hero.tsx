"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Sparkles, TrendingUp, Users, Wallet } from "lucide-react"
import { WalletConnector } from "@/components/wallet-connector"

// Safe environment detection
const isBrowser = typeof window !== "undefined"
const isPreview =
  isBrowser &&
  (window.location.hostname.includes("vercel.app") ||
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1")

export function ModernHero() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="relative overflow-hidden bg-black circuit-pattern">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 to-pink-900/30 z-0"></div>

      {/* Preview mode banner */}
      {isPreview && (
        <div className="bg-yellow-600 text-white text-center py-1 px-4 text-sm font-medium relative z-50">
          Preview Mode - Using Mock Data
        </div>
      )}

      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="inline-block">
              <div className="flex items-center space-x-2 bg-purple-900/30 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-500/20">
                <Sparkles className="h-4 w-4 text-purple-400" />
                <span className="text-sm font-medium text-purple-300">The Future of Tokenized Investments</span>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              <span className="block purple-text">Five Pillars Token</span>
              <span className="block mt-2">Investment Platform</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-300 max-w-lg">
              Secure, transparent, and high-yield investment opportunities powered by blockchain technology and smart
              contracts.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                size="lg"
              >
                <Link href="/dashboard" className="flex items-center">
                  Explore Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <WalletConnector />
            </div>
          </div>

          <div className="relative">
            <div
              className={`relative z-10 transition-transform duration-700 ${isHovered ? "scale-105" : "scale-100"}`}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-75 animate-pulse-slow"></div>
              <div className="relative bg-black rounded-lg p-6 border border-purple-500/20">
                <div className="flex justify-center">
                  <div className="relative w-48 h-48 animate-float">
                    <Image
                      src="/images/5pt-logo.png"
                      alt="5PT Token"
                      width={200}
                      height={200}
                      className="object-contain"
                    />
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-3 gap-4">
                  <Card className="bg-purple-900/30 border-purple-500/20">
                    <CardContent className="p-4 text-center">
                      <TrendingUp className="h-6 w-6 mx-auto mb-2 text-purple-400" />
                      <div className="text-xl font-bold purple-text">26%</div>
                      <div className="text-xs text-gray-400">Annual APY</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-purple-900/30 border-purple-500/20">
                    <CardContent className="p-4 text-center">
                      <Wallet className="h-6 w-6 mx-auto mb-2 text-purple-400" />
                      <div className="text-xl font-bold purple-text">$2.5M</div>
                      <div className="text-xs text-gray-400">Total TVL</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-purple-900/30 border-purple-500/20">
                    <CardContent className="p-4 text-center">
                      <Users className="h-6 w-6 mx-auto mb-2 text-purple-400" />
                      <div className="text-xl font-bold purple-text">5.2K</div>
                      <div className="text-xs text-gray-400">Investors</div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animated background elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600/10 rounded-full filter blur-3xl animate-blob"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-pink-600/10 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-blue-600/10 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>
    </div>
  )
}
