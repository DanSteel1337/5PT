"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { GradientBorder } from "@/components/ui/gradient-border"
import { StableParticleBackground } from "@/components/ui/stable-particle-background"
import { ChevronRight, Users, Shield, DollarSign, Gift, ArrowRight, Code } from "lucide-react"
import { InvestmentSystemInfo } from "@/components/landing/investment-system-info"

export default function Home() {
  const [scrollY, setScrollY] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Track mouse position for effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX - window.innerWidth / 2) / 25,
        y: (e.clientY - window.innerHeight / 2) / 25,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-black/95 to-black text-white overflow-x-hidden">
      <StableParticleBackground />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="container mx-auto px-4 py-16 z-10">
          <div className="flex flex-col items-center gap-12">
            <div className="text-center max-w-4xl mx-auto">
              <motion.h1
                className="text-5xl md:text-7xl font-bold mb-6 gold-gradient-text"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                The Future of <br />
                <span className="text-gold">DeFi</span> Begins Here
              </motion.h1>

              <motion.p
                className="text-xl md:text-2xl mb-8 text-gray-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                Five Pillars Token is launching a new DeFi ecosystem built on transparency, sustainability, and
                community-driven growth.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-gold-dark to-gold-light hover:from-gold hover:to-gold-light text-black font-bold text-lg py-7 px-8 gold-glow group"
                >
                  <Link href="/dashboard" className="flex items-center gap-2">
                    Preview Platform
                    <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-gold/30 hover:bg-gold/10 text-gold text-lg py-7 px-8"
                >
                  <Link href="#learn-more">Learn More</Link>
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
          >
            <div className="w-8 h-12 rounded-full border-2 border-gold/50 flex justify-center pt-2">
              <motion.div
                className="w-1 h-2 bg-gold rounded-full"
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: 0.2 }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="learn-more" className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 gold-gradient-text">The Five Pillars</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our vision is built on five fundamental pillars that will form the foundation of our ecosystem as we grow.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              {
                title: "Investment Pools",
                description: "Planned tiered investment pools with different entry requirements and reward structures.",
                icon: <DollarSign className="w-8 h-8 text-gold" />,
                delay: 0,
              },
              {
                title: "Daily Rewards",
                description: "Sustainable reward system designed to provide consistent returns as the platform grows.",
                icon: <Gift className="w-8 h-8 text-gold" />,
                delay: 0.1,
              },
              {
                title: "Referral System",
                description: "Multi-level referral program to incentivize community growth and participation.",
                icon: <Users className="w-8 h-8 text-gold" />,
                delay: 0.2,
              },
              {
                title: "Security",
                description: "Commitment to security with planned smart contract audits and transparent operations.",
                icon: <Shield className="w-8 h-8 text-gold" />,
                delay: 0.3,
              },
              {
                title: "Innovation",
                description: "Continuous development of new features and improvements based on community feedback.",
                icon: <Code className="w-8 h-8 text-gold" />,
                delay: 0.4,
              },
            ].map((pillar, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: pillar.delay }}
              >
                <GradientBorder
                  className="h-full"
                  gradientFrom={index % 2 === 0 ? "from-gold-light" : "from-gold"}
                  gradientTo={index % 2 === 0 ? "to-gold" : "to-gold-dark"}
                >
                  <div className="bg-black/60 p-6 rounded-xl h-full flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center mb-4">
                      {pillar.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-gold">{pillar.title}</h3>
                    <p className="text-gray-400">{pillar.description}</p>
                  </div>
                </GradientBorder>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Investment System Section */}
      <section className="py-20 relative bg-black/50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 gold-gradient-text">Investment System</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our smart contract implements a sophisticated reward structure with multiple investment pools and a
              multi-level referral system.
            </p>
          </motion.div>

          <InvestmentSystemInfo />
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 gold-gradient-text">Our Roadmap</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We're committed to building a sustainable platform with a clear path forward.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {[
              {
                phase: "Phase 1: Foundation",
                timeline: "Q2 2025",
                items: [
                  "Platform development and testing",
                  "Smart contract development",
                  "Website and dashboard launch",
                  "Community building initiatives",
                ],
                status: "In Progress",
              },
              {
                phase: "Phase 2: Growth",
                timeline: "Q3 2025",
                items: [
                  "Token presale and initial distribution",
                  "Launch of first investment pool",
                  "Referral system implementation",
                  "Security audit completion",
                ],
                status: "Upcoming",
              },
              {
                phase: "Phase 3: Expansion",
                timeline: "Q4 2025",
                items: [
                  "Additional investment pools",
                  "Enhanced reward mechanisms",
                  "Mobile app development",
                  "Strategic partnerships",
                ],
                status: "Planned",
              },
              {
                phase: "Phase 4: Evolution",
                timeline: "Q1 2026",
                items: [
                  "Advanced DeFi features",
                  "Cross-chain integration",
                  "Governance implementation",
                  "Ecosystem expansion",
                ],
                status: "Planned",
              },
            ].map((phase, index) => (
              <motion.div
                key={index}
                className="mb-8 last:mb-0"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <GradientBorder
                  className="w-full"
                  gradientFrom={index % 2 === 0 ? "from-gold-light" : "from-gold"}
                  gradientTo={index % 2 === 0 ? "to-gold" : "to-gold-dark"}
                >
                  <div className="bg-black/60 p-6 rounded-xl">
                    <div className="flex flex-wrap items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold text-gold">{phase.phase}</h3>
                      <div className="flex items-center mt-2 sm:mt-0">
                        <span className="text-gray-400 mr-3">{phase.timeline}</span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            phase.status === "In Progress"
                              ? "bg-green-900/50 text-green-400"
                              : phase.status === "Upcoming"
                                ? "bg-blue-900/50 text-blue-400"
                                : "bg-gray-800 text-gray-400"
                          }`}
                        >
                          {phase.status}
                        </span>
                      </div>
                    </div>

                    <ul className="space-y-2">
                      {phase.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start">
                          <div className="w-1.5 h-1.5 rounded-full bg-gold mt-2 mr-2"></div>
                          <span className="text-gray-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </GradientBorder>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Early Section */}
      <section className="py-20 relative bg-gradient-to-b from-black/0 to-black/80">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 gold-gradient-text">
              Be Part of Something Revolutionary
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Five Pillars Token is at the beginning of its journey. Join us now to be among the first to experience our
              vision for the future of DeFi.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-gold-dark to-gold-light hover:from-gold hover:to-gold-light text-black font-bold text-lg py-7 px-8 gold-glow group"
              >
                <Link href="/dashboard" className="flex items-center gap-2">
                  Preview Platform
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-gold/30 hover:bg-gold/10 text-gold text-lg py-7 px-8"
              >
                <Link href="/calculator" className="flex items-center gap-2">
                  Try Calculator
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
              <div className="flex items-center">
                <Code className="w-6 h-6 text-gold mr-2" />
                <span className="text-gray-400">Open Development</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-gold hidden sm:block"></span>
              <div className="flex items-center">
                <Shield className="w-6 h-6 text-gold mr-2" />
                <span className="text-gray-400">Security Focused</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-gold hidden sm:block"></span>
              <div className="flex items-center">
                <Users className="w-6 h-6 text-gold mr-2" />
                <span className="text-gray-400">Community Driven</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-black/80 border-t border-gold/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <span className="text-xl font-bold text-gold">Five Pillars Token</span>
            </div>

            <div className="flex flex-wrap justify-center gap-6 md:gap-8">
              <Link href="/dashboard" className="text-gray-400 hover:text-gold transition-colors">
                Preview
              </Link>
              <Link href="/calculator" className="text-gray-400 hover:text-gold transition-colors">
                Calculator
              </Link>
              <Link href="#" className="text-gray-400 hover:text-gold transition-colors">
                Whitepaper
              </Link>
              <Link href="#" className="text-gray-400 hover:text-gold transition-colors">
                Community
              </Link>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-500">
            <p>© 2025 Five Pillars Token. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
