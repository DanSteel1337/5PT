import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Hero() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-black">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none gold-text">
                Five Pillars Token (5PT)
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                A revolutionary investment platform built on blockchain technology. Secure, transparent, and profitable.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/dashboard">
                <Button size="lg" className="bg-gold-500 hover:bg-gold-600 text-black">
                  Launch Dashboard
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="border-gold-500 text-gold-500 hover:bg-gold-500/10">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative aspect-square w-full max-w-[400px] overflow-hidden rounded-full bg-black gold-glow">
              <img src="/images/5pt-logo.png" alt="5PT Token" className="object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
