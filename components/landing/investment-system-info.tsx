import { GradientBorder } from "@/components/ui/gradient-border"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Award, BarChart3, Coins, DollarSign, Percent, Repeat, Shield, Zap } from "lucide-react"

export function InvestmentSystemInfo() {
  return (
    <div className="max-w-4xl mx-auto">
      <GradientBorder className="w-full" gradientFrom="from-gold-light" gradientTo="to-gold-dark">
        <div className="bg-black/80 p-8 rounded-xl">
          <h2 className="text-4xl font-bold text-center text-gold mb-8">Investment System</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Left Column - Key Benefits */}
            <div>
              <h3 className="text-2xl font-bold mb-6 text-gold flex items-center">
                <Award className="w-6 h-6 mr-2" /> Key Benefits
              </h3>

              <div className="space-y-5">
                <div className="flex items-start">
                  <div className="bg-gold rounded-full p-1 mr-3 mt-0.5">
                    <Zap className="w-4 h-4 text-black" />
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-gold-light">127.75% APR</p>
                    <p className="text-gray-300">Fixed 0.35% daily rewards</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-gold rounded-full p-1 mr-3 mt-0.5">
                    <Coins className="w-4 h-4 text-black" />
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-gold-light">5% Direct Referrals</p>
                    <p className="text-gray-300">Earn from your direct referrals' deposits</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-gold rounded-full p-1 mr-3 mt-0.5">
                    <BarChart3 className="w-4 h-4 text-black" />
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-gold-light">Auto-Compound</p>
                    <p className="text-gray-300">50% of rewards automatically reinvested</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-gold rounded-full p-1 mr-3 mt-0.5">
                    <Shield className="w-4 h-4 text-black" />
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-gold-light">Token Burn</p>
                    <p className="text-gray-300">Increasing scarcity & value over time</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Pool Highlights */}
            <div>
              <h3 className="text-2xl font-bold mb-6 text-gold flex items-center">
                <Repeat className="w-6 h-6 mr-2" /> Multi-Level System
              </h3>

              <div className="space-y-5">
                <div className="flex items-start">
                  <div className="bg-gold rounded-full p-1 mr-3 mt-0.5">
                    <DollarSign className="w-4 h-4 text-black" />
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-gold-light">9 Investment Pools</p>
                    <p className="text-gray-300">Starting from just $110 minimum deposit</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-gold rounded-full p-1 mr-3 mt-0.5">
                    <Percent className="w-4 h-4 text-black" />
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-gold-light">Pool Rewards</p>
                    <p className="text-gray-300">3.5% share in pools 1-5, 2.0% in pools 6-9</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-gold rounded-full p-1 mr-3 mt-0.5">
                    <Zap className="w-4 h-4 text-black" />
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-gold-light">Network Rewards</p>
                    <p className="text-gray-300">1.35% from downline (Pool 3+ only)</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-gold rounded-full p-1 mr-3 mt-0.5">
                    <Shield className="w-4 h-4 text-black" />
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-gold-light">Configurable Taxes</p>
                    <p className="text-gray-300">0-10% deposit & claim taxes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-8 pt-6 border-t border-gold/30 flex flex-col sm:flex-row items-center justify-between">
            <div className="flex items-center gap-6 mb-4 sm:mb-0">
              <div className="flex items-center">
                <DollarSign className="w-5 h-5 text-gold mr-2" />
                <span className="text-xl font-semibold text-gold-light">1 5PT = $0.20</span>
              </div>
              <div className="flex items-center">
                <Percent className="w-5 h-5 text-gold mr-2" />
                <span className="text-xl font-semibold text-gold-light">0.35% Daily</span>
              </div>
            </div>

            <Button
              asChild
              className="w-full sm:w-auto bg-gradient-to-r from-gold-dark to-gold-light hover:from-gold hover:to-gold-light text-black font-bold py-3 px-6"
            >
              <Link href="/calculator" className="flex items-center justify-center gap-2">
                Try Our Calculator
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </GradientBorder>
    </div>
  )
}
