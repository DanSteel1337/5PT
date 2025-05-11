import Link from "next/link"

export function InvestmentCTA() {
  return (
    <section className="py-16 px-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-secondary/10"></div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary to-transparent"></div>

      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold gradient-text">Ready to Start Investing?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of investors already benefiting from 5PT's high returns and secure platform. Start with as
            little as 100 5PT tokens.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link href="/dashboard">
              <button className="crypto-button-secondary px-8 py-3 text-lg font-medium w-full sm:w-auto shimmer">
                Launch Dashboard
              </button>
            </Link>
            <Link href="/dashboard/pools">
              <button className="crypto-button-outline px-8 py-3 text-lg font-medium w-full sm:w-auto">
                View Investment Pools
              </button>
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary glow-text-secondary">15%</div>
              <div className="text-sm text-muted-foreground">Average APY</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary glow-text-secondary">5%</div>
              <div className="text-sm text-muted-foreground">Referral Bonus</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary glow-text-secondary">24/7</div>
              <div className="text-sm text-muted-foreground">Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
