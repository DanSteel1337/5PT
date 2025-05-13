"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ParallaxSection } from "@/components/parallax/parallax-section"
import { ParallaxLayer } from "@/components/parallax/parallax-layer"
import { TiltCard } from "@/components/parallax/tilt-card"
import { Shield, Award, Users, TrendingUp, Check } from "lucide-react"

export function SocialProof() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const testimonials = [
    {
      quote:
        "I started with just 500 5PT and now I'm earning over 40 5PT daily. The compound interest is truly game-changing!",
      author: "Michael T.",
      location: "United States",
      investment: "4,500 5PT",
      earnings: "12,800 5PT",
      days: 45,
    },
    {
      quote:
        "The referral program helped me boost my earnings by 35%. I've referred 8 friends and we're all growing our investments together.",
      author: "Sarah L.",
      location: "United Kingdom",
      investment: "2,800 5PT",
      earnings: "5,600 5PT",
      days: 30,
    },
    {
      quote:
        "As a Premium Pool investor, I'm getting 15% daily returns. The platform is secure and withdrawals are always processed quickly.",
      author: "David K.",
      location: "Australia",
      investment: "10,000 5PT",
      earnings: "45,000 5PT",
      days: 60,
    },
  ]

  const stats = [
    { label: "Total Investors", value: "12,847+", icon: <Users className="h-5 w-5" /> },
    { label: "Total Value Locked", value: "$4.5M+", icon: <TrendingUp className="h-5 w-5" /> },
    { label: "Audited & Verified", value: "100%", icon: <Shield className="h-5 w-5" /> },
    { label: "Avg. Daily Return", value: "8.7%", icon: <Award className="h-5 w-5" /> },
  ]

  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
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
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                SUCCESS
              </span>
              <span className="text-white"> STORIES</span>
            </motion.h2>

            <motion.div
              className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mx-auto mb-8"
              initial={{ width: 0 }}
              whileInView={{ width: "6rem" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            ></motion.div>
          </motion.div>
        </ParallaxSection>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <ParallaxLayer key={index} speed={0.2 + index * 0.1} direction="up">
              <motion.div
                className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, borderColor: "rgba(139, 92, 246, 0.5)" }}
              >
                <div className="w-12 h-12 rounded-full bg-purple-900/30 flex items-center justify-center mx-auto mb-4 text-purple-400">
                  {stat.icon}
                </div>
                <p className="text-3xl font-bold text-gradient mb-2">{stat.value}</p>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </motion.div>
            </ParallaxLayer>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <ParallaxLayer key={index} speed={0.3} direction="up" offset={index * 10}>
              <TiltCard>
                <motion.div
                  className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 h-full flex flex-col"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  {/* Quote */}
                  <div className="mb-6 flex-1">
                    <div className="text-purple-400 text-4xl font-serif mb-4">"</div>
                    <p className="text-gray-300 italic">{testimonial.quote}</p>
                  </div>

                  {/* Author Info */}
                  <div className="mt-auto">
                    <div className="flex justify-between items-end mb-4">
                      <div>
                        <p className="font-bold text-white">{testimonial.author}</p>
                        <p className="text-gray-400 text-sm">{testimonial.location}</p>
                      </div>
                      <div className="bg-purple-900/30 px-3 py-1 rounded-full text-xs text-purple-400">
                        Verified Investor
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="bg-black/30 rounded-lg p-3 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Initial Investment:</span>
                        <span className="font-medium">{testimonial.investment}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Total Earnings:</span>
                        <span className="font-medium text-green-400">{testimonial.earnings}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Investment Period:</span>
                        <span className="font-medium">{testimonial.days} days</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </TiltCard>
            </ParallaxLayer>
          ))}
        </div>

        {/* Trust Signals */}
        <motion.div
          className="mt-16 bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-xl font-bold mb-6 text-center text-gradient">Why Investors Trust 5PT Finance</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="h-3 w-3 text-purple-400" />
                </div>
                <div>
                  <h4 className="font-medium text-white mb-1">Audited Smart Contracts</h4>
                  <p className="text-sm text-gray-400">
                    Our contracts have been audited by leading blockchain security firms to ensure maximum safety.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="h-3 w-3 text-purple-400" />
                </div>
                <div>
                  <h4 className="font-medium text-white mb-1">Transparent Operations</h4>
                  <p className="text-sm text-gray-400">
                    All transactions are publicly verifiable on the Binance Smart Chain, ensuring complete transparency.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="h-3 w-3 text-purple-400" />
                </div>
                <div>
                  <h4 className="font-medium text-white mb-1">Sustainable Yield Generation</h4>
                  <p className="text-sm text-gray-400">
                    Our AI-optimized strategies ensure sustainable returns without relying on new investors.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="h-3 w-3 text-purple-400" />
                </div>
                <div>
                  <h4 className="font-medium text-white mb-1">Instant Withdrawals</h4>
                  <p className="text-sm text-gray-400">
                    Withdraw your earnings at any time with no delays or hidden fees.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="h-3 w-3 text-purple-400" />
                </div>
                <div>
                  <h4 className="font-medium text-white mb-1">Community Governance</h4>
                  <p className="text-sm text-gray-400">
                    Token holders can participate in platform decisions through our governance system.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="h-3 w-3 text-purple-400" />
                </div>
                <div>
                  <h4 className="font-medium text-white mb-1">24/7 Support</h4>
                  <p className="text-sm text-gray-400">
                    Our dedicated support team is available around the clock to assist with any questions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default SocialProof
