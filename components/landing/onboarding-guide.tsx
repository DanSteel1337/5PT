"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ParallaxSection } from "@/components/parallax/parallax-section"
import { CyberButton } from "@/components/ui/cyber-button"
import { Wallet, ArrowRight, Coins, LayoutGrid, TrendingUp, Users } from "lucide-react"

export function OnboardingGuide() {
  const [mounted, setMounted] = useState(false)
  const [activeStep, setActiveStep] = useState(1)

  useEffect(() => {
    setMounted(true)

    // Auto-cycle through steps
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev % 5) + 1)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  if (!mounted) return null

  const steps = [
    {
      number: 1,
      title: "Create Wallet",
      description: "Set up a BSC-compatible wallet like MetaMask or Trust Wallet",
      icon: <Wallet className="h-6 w-6" />,
      details: [
        "Download MetaMask or Trust Wallet from official sources",
        "Create a new wallet and securely store your recovery phrase",
        "Never share your private keys or recovery phrase with anyone",
      ],
    },
    {
      number: 2,
      title: "Add BSC Network",
      description: "Configure your wallet to connect to Binance Smart Chain",
      icon: <Coins className="h-6 w-6" />,
      details: [
        "Open your wallet settings and add a new network",
        "Enter Binance Smart Chain details (RPC URL, Chain ID: 56)",
        "Ensure you're connected to BSC Mainnet, not Testnet",
      ],
    },
    {
      number: 3,
      title: "Get 5PT Tokens",
      description: "Purchase 5PT tokens on PancakeSwap or other exchanges",
      icon: <LayoutGrid className="h-6 w-6" />,
      details: [
        "Buy BNB from an exchange and transfer to your wallet",
        "Visit PancakeSwap and connect your wallet",
        "Swap BNB for 5PT tokens using our contract address",
      ],
    },
    {
      number: 4,
      title: "Choose Investment Pool",
      description: "Select the investment pool that matches your goals",
      icon: <TrendingUp className="h-6 w-6" />,
      details: [
        "Connect your wallet to our dApp",
        "Review the different pool options and their returns",
        "Choose a pool based on your investment amount and risk tolerance",
      ],
    },
    {
      number: 5,
      title: "Grow Your Network",
      description: "Refer friends to earn additional commission rewards",
      icon: <Users className="h-6 w-6" />,
      details: [
        "Get your unique referral link from the dashboard",
        "Share with friends and on social media",
        "Earn up to 15% commission on your referrals' investments",
      ],
    },
  ]

  return (
    <section id="getting-started" className="py-20 md:py-32 relative overflow-hidden">
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
              <span className="text-white">HOW TO </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                GET STARTED
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
              Follow these simple steps to start earning with 5PT Finance
            </motion.p>
          </motion.div>
        </ParallaxSection>

        {/* Steps */}
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gray-800 hidden md:block"></div>

          {/* Steps */}
          <div className="space-y-12 relative">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                className={`relative ${index % 2 === 0 ? "md:pr-12 md:text-right md:ml-auto md:mr-0" : "md:pl-12"} md:w-1/2 w-full`}
                initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Step Number Circle - Desktop */}
                <div
                  className={`absolute top-0 hidden md:flex items-center justify-center w-12 h-12 rounded-full border-4 transition-all duration-300 ${
                    activeStep === step.number
                      ? "border-purple-500 bg-purple-900/50 text-white"
                      : "border-gray-700 bg-black text-gray-400"
                  } ${index % 2 === 0 ? "-right-18" : "-left-18"}`}
                  style={{ [index % 2 === 0 ? "right" : "left"]: "-3rem" }}
                >
                  <span className="text-lg font-bold">{step.number}</span>
                </div>

                {/* Content Card */}
                <div
                  className={`bg-black/40 backdrop-blur-sm border rounded-xl p-6 transition-all duration-300 ${
                    activeStep === step.number
                      ? "border-purple-500/50 shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                      : "border-purple-500/20"
                  }`}
                  onClick={() => setActiveStep(step.number)}
                >
                  {/* Mobile Step Number */}
                  <div className="flex items-center gap-3 md:hidden mb-4">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                        activeStep === step.number
                          ? "border-purple-500 bg-purple-900/50 text-white"
                          : "border-gray-700 bg-black text-gray-400"
                      }`}
                    >
                      <span className="text-sm font-bold">{step.number}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white">{step.title}</h3>
                  </div>

                  {/* Desktop Title */}
                  <h3 className="text-lg font-bold text-white mb-3 hidden md:block">{step.title}</h3>

                  {/* Icon and Description */}
                  <div className={`flex items-start gap-4 ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}>
                    <div className="w-12 h-12 rounded-xl bg-purple-900/30 flex items-center justify-center flex-shrink-0 text-purple-400">
                      {step.icon}
                    </div>
                    <div>
                      <p className="text-gray-300 mb-4">{step.description}</p>

                      {/* Expanded Details (only visible for active step) */}
                      {activeStep === step.number && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-4 space-y-2"
                        >
                          {step.details.map((detail, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <div className="w-5 h-5 rounded-full bg-purple-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <ArrowRight className="h-3 w-3 text-purple-400" />
                              </div>
                              <p className="text-sm text-gray-400">{detail}</p>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Link href="/dashboard">
            <CyberButton variant="primary" size="lg">
              Start Your Investment Journey
            </CyberButton>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default OnboardingGuide
