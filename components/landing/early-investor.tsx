"use client"

import { motion } from "framer-motion"
import { Rocket, TrendingUp, Clock, Award } from "lucide-react"
import { ParallaxSection } from "@/components/parallax/parallax-section"
import { ParallaxLayer } from "@/components/parallax/parallax-layer"
import { TiltCard } from "@/components/parallax/tilt-card"

export function EarlyInvestor() {
  return (
    <section id="early-investor" className="relative py-24 overflow-hidden">
      {/* Background with increased opacity */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/20 to-black z-0"></div>

      {/* Increased z-index for content */}
      <div className="container mx-auto px-4 relative z-10">
        <ParallaxSection>
          <ParallaxLayer depth={0.2}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                  BE AN EARLY INVESTOR
                </span>
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mx-auto mb-8"></div>
              <p className="text-xl text-white max-w-3xl mx-auto">
                Join the 5PT ecosystem at the ground floor and position yourself for maximum returns.
              </p>
            </motion.div>
          </ParallaxLayer>

          <ParallaxLayer depth={0.4}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Advantage 1 */}
              <TiltCard>
                <AdvantageCard
                  icon={<Rocket className="h-8 w-8 text-purple-400" />}
                  title="Ground Floor Opportunity"
                  description="Be among the first to participate in this revolutionary yield protocol."
                  delay={0}
                />
              </TiltCard>

              {/* Advantage 2 */}
              <TiltCard>
                <AdvantageCard
                  icon={<TrendingUp className="h-8 w-8 text-purple-400" />}
                  title="Maximum Growth Potential"
                  description="Early investors have the highest potential for exponential returns."
                  delay={0.1}
                />
              </TiltCard>

              {/* Advantage 3 */}
              <TiltCard>
                <AdvantageCard
                  icon={<Clock className="h-8 w-8 text-purple-400" />}
                  title="Compound Over Time"
                  description="Start earning daily rewards immediately and watch your investment grow."
                  delay={0.2}
                />
              </TiltCard>

              {/* Advantage 4 */}
              <TiltCard>
                <AdvantageCard
                  icon={<Award className="h-8 w-8 text-purple-400" />}
                  title="Exclusive Pool Access"
                  description="Build your position to qualify for higher-tier reward pools."
                  delay={0.3}
                />
              </TiltCard>
            </div>
          </ParallaxLayer>

          {/* Early Investor Bonus Section */}
          <ParallaxLayer depth={0.1}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true }}
              className="mt-20 bg-gradient-to-r from-purple-900/30 to-blue-900/30 backdrop-blur-sm border border-purple-500/30 rounded-xl p-8"
            >
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-6 md:mb-0 md:mr-8">
                  <h3 className="text-2xl font-bold text-white mb-4">Early Investor Advantage</h3>
                  <p className="text-gray-300">
                    Early investors in the 5PT ecosystem position themselves at the top of the referral network,
                    maximizing both direct and indirect rewards as the platform grows.
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl"></div>
                    <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-xl px-6 py-3 rounded-full">
                      Join Now
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </ParallaxLayer>
        </ParallaxSection>
      </div>

      {/* Decorative elements with higher opacity */}
      <div className="absolute top-1/4 right-[10%] w-32 h-32 rounded-full border border-purple-500/40 animate-rotate opacity-40 pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-[10%] w-48 h-48 rounded-full border border-blue-500/40 animate-rotate opacity-40 pointer-events-none"></div>
    </section>
  )
}

function AdvantageCard({ icon, title, description, delay = 0 }) {
  return (
    <motion.div
      className="relative bg-black/60 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6 overflow-hidden group h-full"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(139, 92, 246, 0.5)" }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors duration-300"></div>

      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded-full bg-purple-900/50 flex items-center justify-center">{icon}</div>
        <div className="w-8 h-8 flex items-center justify-center">
          <motion.div
            className="w-1 h-1 bg-purple-500 rounded-full"
            animate={{
              boxShadow: [
                "0 0 5px rgba(139, 92, 246, 0.5)",
                "0 0 20px rgba(139, 92, 246, 0.8)",
                "0 0 5px rgba(139, 92, 246, 0.5)",
              ],
            }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          />
        </div>
      </div>

      <motion.h3
        className="text-xl font-bold text-white mb-3"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: delay + 0.2 }}
        viewport={{ once: true }}
      >
        {title}
      </motion.h3>

      <motion.p
        className="text-gray-300"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: delay + 0.3 }}
        viewport={{ once: true }}
      >
        {description}
      </motion.p>

      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500/50 to-blue-500/50 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
    </motion.div>
  )
}
