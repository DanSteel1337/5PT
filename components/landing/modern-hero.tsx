"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function ModernHero() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-black to-gray-900 pb-16 pt-12 text-white md:pb-24 md:pt-20">
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(34,197,94,0.2),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(34,197,94,0.2),transparent_50%)]"></div>
      </div>
      <div className="container relative z-10 mx-auto px-4">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
          <div className="flex flex-col items-start space-y-6">
            <div className="inline-flex items-center rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-sm text-green-400">
              <span className="mr-1 h-2 w-2 rounded-full bg-green-400"></span>
              BSC Investment Platform
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Invest in the <span className="text-green-400">Future</span> of Blockchain
            </h1>
            <p className="text-lg text-gray-300">
              Secure, transparent, and profitable investment opportunities on the Binance Smart Chain.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/dashboard" passHref>
                <Button size="lg" className="bg-green-600 hover:bg-green-700">
                  Launch App
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="border-green-500/30 text-green-400 hover:bg-green-500/10">
                Learn More
              </Button>
            </div>
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-md">
            <div className="absolute inset-0 rounded-full bg-green-500/20 blur-3xl"></div>
            <div className="relative h-full w-full">
              <Image
                src="/images/5pt-logo.png"
                alt="5PT Token"
                width={500}
                height={500}
                className="h-full w-full object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
