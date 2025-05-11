import Link from "next/link"

export function FuturisticHero() {
  return (
    <section className="hero-section circuit-pattern py-16 md:py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="inline-block crypto-badge-secondary text-lg font-medium mb-2 shimmer">
              Next-Gen Crypto Investment
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold gradient-text leading-tight">
              Five Pillars Token
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-md">
              A revolutionary blockchain investment platform with high returns, security, and transparency.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/dashboard">
                <button className="crypto-button-secondary px-8 py-3 text-lg font-medium">Start Investing</button>
              </Link>
              <Link href="#features">
                <button className="crypto-button-outline px-8 py-3 text-lg font-medium">Learn More</button>
              </Link>
            </div>
            <div className="flex items-center gap-6 mt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary glow-text-secondary">15%</div>
                <div className="text-xs text-muted-foreground">APY</div>
              </div>
              <div className="h-10 w-px bg-border"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary glow-text-secondary">$4.5M</div>
                <div className="text-xs text-muted-foreground">TVL</div>
              </div>
              <div className="h-10 w-px bg-border"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary glow-text-secondary">3,800+</div>
                <div className="text-xs text-muted-foreground">Investors</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="token-animation">
              <div className="absolute top-0 left-0 w-full h-full bg-secondary/20 rounded-full blur-3xl"></div>
              <img
                src="/images/5pt-logo.png"
                alt="5PT Token"
                className="relative z-10 w-64 h-64 mx-auto object-contain"
              />
            </div>
            <div className="absolute -bottom-4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary to-transparent"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
