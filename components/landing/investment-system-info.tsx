import { GradientBorder } from "@/components/ui/gradient-border"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, DollarSign, Percent } from "lucide-react"

export function InvestmentSystemInfo() {
  return (
    <div className="max-w-4xl mx-auto">
      <GradientBorder className="w-full" gradientFrom="from-gold-light" gradientTo="to-gold-dark">
        <div className="bg-black/80 p-8 rounded-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 text-gold">Investment Pools</h3>
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {[
                  { id: 1, personal: "$110", refs: "1", refsDeposit: "$110", share: "3.5%" },
                  { id: 2, personal: "$290", refs: "3", refsDeposit: "$290", share: "3.5%" },
                  { id: 3, personal: "$600", refs: "5", refsDeposit: "$1,200", share: "3.5%" },
                  { id: 4, personal: "$1,100", refs: "10", refsDeposit: "$2,200", share: "3.5%" },
                  { id: 5, personal: "$2,850", refs: "15", refsDeposit: "$5,700", share: "3.5%" },
                  { id: 6, personal: "$5,700", refs: "20", refsDeposit: "$17,100", share: "2.0%" },
                  { id: 7, personal: "$11,400", refs: "20", refsDeposit: "$34,200", share: "2.0%" },
                  { id: 8, personal: "Whitelist", refs: "-", refsDeposit: "-", share: "2.0%" },
                  { id: 9, personal: "Whitelist", refs: "-", refsDeposit: "-", share: "2.0%" },
                ].map((pool) => (
                  <div key={pool.id} className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-gold mt-2 mr-2"></div>
                    <div className="text-gray-300">
                      <span className="text-gold font-medium">Pool {pool.id}:</span> Min. {pool.personal} personal,{" "}
                      {pool.refs} direct {pool.refs === "1" ? "ref" : "refs"}, {pool.refsDeposit} direct refs deposit,{" "}
                      {pool.share} share
                    </div>
                  </div>
                ))}
              </div>

              <h3 className="text-2xl font-bold mt-8 mb-4 text-gold">Tax & Distribution</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-gold mt-2 mr-2"></div>
                  <span className="text-gray-300">
                    <span className="text-gold font-medium">Deposit Tax:</span> 0-10% (default 10%)
                  </span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-gold mt-2 mr-2"></div>
                  <span className="text-gray-300">
                    <span className="text-gold font-medium">Claim Tax:</span> 0-10% (default 10%)
                  </span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-gold mt-2 mr-2"></div>
                  <span className="text-gray-300">
                    <span className="text-gold font-medium">Tax Split:</span> 70% Treasury 1, 30% Treasury 2
                  </span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-gold mt-2 mr-2"></div>
                  <span className="text-gray-300">
                    <span className="text-gold font-medium">After-tax Rewards:</span> 50% to wallet, 50% reinvested
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col">
              <h3 className="text-2xl font-bold mb-4 text-gold">Key Features</h3>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-gold mt-2 mr-2"></div>
                  <span className="text-gray-300">Fixed 0.35% daily rewards on your deposit (127.75% APR)</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-gold mt-2 mr-2"></div>
                  <span className="text-gray-300">Additional pool rewards from platform deposits</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-gold mt-2 mr-2"></div>
                  <span className="text-gray-300">Auto-reinvestment: 50% of claimed rewards reinvested</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-gold mt-2 mr-2"></div>
                  <span className="text-gray-300">Configurable taxes: Deposit (0-10%), Claim (0-10%)</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-gold mt-2 mr-2"></div>
                  <span className="text-gray-300">5% rewards from direct referrals' deposits</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-gold mt-2 mr-2"></div>
                  <span className="text-gray-300">1.35% rewards from downline network (Pool 3+ only)</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-gold mt-2 mr-2"></div>
                  <span className="text-gray-300">Token burn mechanism increases scarcity</span>
                </li>
              </ul>

              <div className="mt-auto">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <DollarSign className="w-5 h-5 text-gold mr-2" />
                    <span className="text-gray-300">1 5PT = $0.20</span>
                  </div>
                  <div className="flex items-center">
                    <Percent className="w-5 h-5 text-gold mr-2" />
                    <span className="text-gray-300">0.35% Daily Rate</span>
                  </div>
                </div>

                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-gold-dark to-gold-light hover:from-gold hover:to-gold-light text-black font-bold py-3"
                >
                  <Link href="/calculator" className="flex items-center justify-center gap-2">
                    Try Our Interactive Calculator
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </GradientBorder>
    </div>
  )
}
