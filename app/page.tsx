import { SimpleV0WalletConnect } from "@/components/simple-v0-wallet-connect"
import { FuturisticHero } from "@/components/landing/futuristic-hero"
import { CompactFeatures } from "@/components/landing/compact-features"
import { CompactTokenomics } from "@/components/landing/compact-tokenomics"
import { InvestmentCTA } from "@/components/landing/investment-cta"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <FuturisticHero />
      <section className="py-16 px-4 flex items-center justify-center bg-gradient-to-b from-background to-background/80">
        <div className="w-full max-w-5xl">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 gradient-text animate-gradient">
            5PT Dashboard
          </h1>
          <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
            Connect your wallet to access the 5PT dashboard and manage your investments, track rewards, and participate
            in the 5PT ecosystem.
          </p>
          <SimpleV0WalletConnect />
        </div>
      </section>
      <CompactFeatures />
      <CompactTokenomics />
      <InvestmentCTA />
    </main>
  )
}
