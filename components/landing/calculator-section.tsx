"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ParallaxSection } from "@/components/parallax/parallax-section"
import { ParallaxLayer } from "@/components/parallax/parallax-layer"
import { InvestmentCalculator } from "@/components/landing/investment-calculator"
import { TrendingUp, Users, Zap } from "lucide-react"

export function CalculatorSection() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <section id="calculator" className="py-20 md:py-32 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent"></div>

      <div className="container mx-auto px-4 relative z-10">
        <ParallaxSection intensity={0.3}>
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2
              className="text-4xl md:text-6xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="text-white">CALCULATE YOUR </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                EARNINGS
              </span>
            </motion.h2>

            <motion.div
              className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mx-auto mb-8"
              initial={{ width: 0 }}
              whileInView={{ width: "6rem" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            ></motion.div>

            <motion.p
              className="text-xl text-gray-300 max-w-3xl mx-auto mb-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              See how your investment can grow with our revolutionary DeFi protocol. Adjust parameters to visualize your
              potential returns.
            </motion.p>
          </motion.div>
        </ParallaxSection>

        <ParallaxLayer speed={0.2} direction="up">
          <InvestmentCalculator />
        </ParallaxLayer>

        {/* Key Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <ParallaxLayer speed={0.3} direction="up">
            <motion.div
              className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/50 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-12 h-12 rounded-xl bg-purple-900/50 flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">Compound Growth</h3>
              <p className="text-gray-400">
                Reinvest your daily earnings to leverage the power of compound interest and maximize your returns over
                time.
              </p>
            </motion.div>
          </ParallaxLayer>

          <ParallaxLayer speed={0.4} direction="up">
            <motion.div
              className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/50 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="w-12 h-12 rounded-xl bg-purple-900/50 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">Referral Network</h3>
              <p className="text-gray-400">
                Boost your earnings by building a referral network. Earn up to 15% commission on your referrals'
                investments.
              </p>
            </motion.div>
          </ParallaxLayer>

          <ParallaxLayer speed={0.5} direction="up">
            <motion.div
              className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/50 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="w-12 h-12 rounded-xl bg-purple-900/50 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">Multiple Pools</h3>
              <p className="text-gray-400">
                Choose from different investment pools based on your risk tolerance and investment goals, with daily
                returns from 5% to 15%.
              </p>
            </motion.div>
          </ParallaxLayer>
        </div>
      </div>
    </section>
  )
}

export default CalculatorSection
