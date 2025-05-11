"use client"

import { GradientBorder } from "@/components/ui/gradient-border"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  ArrowRight,
  Award,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Coins,
  DollarSign,
  Percent,
  Repeat,
  Shield,
  Zap,
} from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

export function InvestmentSystemInfo() {
  const [expandedPools, setExpandedPools] = useState(false)

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

          {/* Investment Pools Section */}
          <div className="mt-8 pt-6 border-t border-gold/30">
            <button
              onClick={() => setExpandedPools(!expandedPools)}
              className="w-full flex items-center justify-between text-2xl font-bold text-gold mb-4"
            >
              <div className="flex items-center">
                <Coins className="w-6 h-6 mr-2" /> Investment Pools
              </div>
              {expandedPools ? (
                <ChevronUp className="w-6 h-6 text-gold" />
              ) : (
                <ChevronDown className="w-6 h-6 text-gold" />
              )}
            </button>

            <AnimatePresence>
              {expandedPools && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {[
                      {
                        id: 1,
                        personal: "$110",
                        refs: 1,
                        refsDeposit: "$110",
                        share: "3.5%",
                        highlight: false,
                      },
                      {
                        id: 2,
                        personal: "$290",
                        refs: 3,
                        refsDeposit: "$290",
                        share: "3.5%",
                        highlight: false,
                      },
                      {
                        id: 3,
                        personal: "$600",
                        refs: 5,
                        refsDeposit: "$1,200",
                        share: "3.5%",
                        highlight: true,
                      },
                      {
                        id: 4,
                        personal: "$1,100",
                        refs: 10,
                        refsDeposit: "$2,200",
                        share: "3.5%",
                        highlight: false,
                      },
                      {
                        id: 5,
                        personal: "$2,850",
                        refs: 15,
                        refsDeposit: "$5,700",
                        share: "3.5%",
                        highlight: false,
                      },
                      {
                        id: 6,
                        personal: "$5,700",
                        refs: 20,
                        refsDeposit: "$17,100",
                        share: "2.0%",
                        highlight: false,
                      },
                      {
                        id: 7,
                        personal: "$11,400",
                        refs: 20,
                        refsDeposit: "$34,200",
                        share: "2.0%",
                        highlight: false,
                      },
                      {
                        id: 8,
                        personal: "Whitelist",
                        refs: "-",
                        refsDeposit: "-",
                        share: "2.0%",
                        highlight: false,
                      },
                      {
                        id: 9,
                        personal: "Whitelist",
                        refs: "-",
                        refsDeposit: "-",
                        share: "2.0%",
                        highlight: false,
                      },
                    ].map((pool) => (
                      <PoolCard key={pool.id} pool={pool} />
                    ))}
                  </div>

                  <div className="bg-gold/10 rounded-lg p-4 mb-6">
                    <h4 className="text-lg font-semibold text-gold mb-2">Pool Requirements</h4>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex items-start">
                        <div className="w-1.5 h-1.5 rounded-full bg-gold mt-2 mr-2"></div>
                        <span>Personal Investment: Minimum amount you need to deposit</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-1.5 h-1.5 rounded-full bg-gold mt-2 mr-2"></div>
                        <span>Direct Refs: Number of direct referrals required</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-1.5 h-1.5 rounded-full bg-gold mt-2 mr-2"></div>
                        <span>Direct Refs Deposit: Total amount your direct referrals need to deposit</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-1.5 h-1.5 rounded-full bg-gold mt-2 mr-2"></div>
                        <span>Pool Share: Percentage of pool rewards you receive</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gold/10 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gold mb-2">Tax & Distribution</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <ul className="space-y-2 text-gray-300">
                          <li className="flex items-start">
                            <div className="w-1.5 h-1.5 rounded-full bg-gold mt-2 mr-2"></div>
                            <span>Deposit Tax: 0-10% (default 10%)</span>
                          </li>
                          <li className="flex items-start">
                            <div className="w-1.5 h-1.5 rounded-full bg-gold mt-2 mr-2"></div>
                            <span>Claim Tax: 0-10% (default 10%)</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <ul className="space-y-2 text-gray-300">
                          <li className="flex items-start">
                            <div className="w-1.5 h-1.5 rounded-full bg-gold mt-2 mr-2"></div>
                            <span>Tax Split: 70% Treasury 1, 30% Treasury 2</span>
                          </li>
                          <li className="flex items-start">
                            <div className="w-1.5 h-1.5 rounded-full bg-gold mt-2 mr-2"></div>
                            <span>After-tax Rewards: 50% to wallet, 50% reinvested</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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

            <div className="flex gap-4">
              <Button
                asChild
                className="bg-gradient-to-r from-gold-dark to-gold-light hover:from-gold hover:to-gold-light text-black font-bold py-3 px-6"
              >
                <Link href="/calculator" className="flex items-center justify-center gap-2">
                  Try Our Calculator
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>

              <Button asChild variant="outline" className="border-gold hover:bg-gold/10 text-gold font-bold py-3 px-6">
                <Link href="/pools" className="flex items-center justify-center gap-2">
                  View Pools
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </GradientBorder>
    </div>
  )
}

function PoolCard({ pool }) {
  return (
    <div
      className={cn(
        "rounded-lg p-4 border",
        pool.highlight ? "border-gold bg-gold/20" : "border-gold/30 bg-black/50 hover:bg-gold/10 transition-colors",
      )}
    >
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-lg font-bold text-gold">Pool {pool.id}</h4>
        <span
          className={cn(
            "text-sm font-medium px-2 py-0.5 rounded",
            pool.id <= 5 ? "bg-gold/20 text-gold" : "bg-violet-500/20 text-violet-300",
          )}
        >
          {pool.share} Share
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-400">Personal:</span>
          <span className="font-medium text-white">{pool.personal}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400">Direct Refs:</span>
          <span className="font-medium text-white">{pool.refs}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400">Refs Deposit:</span>
          <span className="font-medium text-white">{pool.refsDeposit}</span>
        </div>
      </div>

      {pool.highlight && (
        <div className="mt-3 pt-2 border-t border-gold/30 text-center">
          <span className="text-xs text-gold">Includes 1.35% Network Rewards</span>
        </div>
      )}
    </div>
  )
}
