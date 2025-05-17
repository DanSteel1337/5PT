"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { CyberButton } from "@/components/ui/cyber-button"
import { Wallet, Coins, LayoutGrid, TrendingUp, Users, ChevronRight } from "lucide-react"
import { SectionContainer } from "@/components/ui/section-container"
import { ContentCard } from "@/components/ui/content-card"

export function OnboardingGuide() {
  const [mounted, setMounted] = useState(false)
  const [activeStep, setActiveStep] = useState(1)
  const [isManualSelection, setIsManualSelection] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Auto-cycle through steps only if not manually selected
    const interval = setInterval(() => {
      if (!isManualSelection) {
        setActiveStep((prev) => (prev % 5) + 1)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [isManualSelection])

  // Reset manual selection flag after some time of inactivity
  useEffect(() => {
    if (isManualSelection) {
      const timeout = setTimeout(() => {
        setIsManualSelection(false)
      }, 15000) // Reset to auto-cycle after 15 seconds of inactivity

      return () => clearTimeout(timeout)
    }
  }, [activeStep, isManualSelection])

  if (!mounted) return null

  const handleStepClick = (stepNumber: number) => {
    setActiveStep(stepNumber)
    setIsManualSelection(true)
  }

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
      color: "from-purple-500 to-blue-500",
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
      color: "from-blue-500 to-cyan-500",
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
      color: "from-cyan-500 to-teal-500",
    },
    {
      number: 4,
      title: "Choose Investment Pool",
      description: "Select the investment pool that matches your goals",
      icon: <TrendingUp className="h-6 w-6" />,
      details: [
        "Connect your wallet to our dApp",
        "Review the different pool options and their returns",
        "Choose a pool based on your investment amount and referral network",
      ],
      color: "from-teal-500 to-green-500",
    },
    {
      number: 5,
      title: "Grow Your Network",
      description: "Refer friends to earn additional commission rewards",
      icon: <Users className="h-6 w-6" />,
      details: [
        "Get your unique referral link from the dashboard",
        "Share with friends and on social media",
        "Build your network to qualify for higher pools",
      ],
      color: "from-green-500 to-purple-500",
    },
  ]

  // Animation variants for smooth transitions
  const cardVariants = {
    inactive: {
      scale: 1,
      transition: { duration: 0.5, ease: [0.19, 1.0, 0.22, 1.0] },
    },
    active: {
      scale: 1.05,
      transition: { duration: 0.5, ease: [0.19, 1.0, 0.22, 1.0] },
    },
  }

  const detailsVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: [0.19, 1.0, 0.22, 1.0],
        opacity: { duration: 0.2 },
      },
    },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.5,
        ease: [0.19, 1.0, 0.22, 1.0],
        opacity: { delay: 0.1, duration: 0.3 },
      },
    },
  }

  const iconVariants = {
    inactive: {
      scale: 1,
      transition: { duration: 0.3 },
    },
    active: {
      scale: 1.1,
      transition: {
        duration: 0.5,
        type: "spring",
        stiffness: 300,
        damping: 15,
      },
    },
  }

  return (
    <SectionContainer
      id="getting-started"
      title="HOW TO GET STARTED"
      subtitle="Follow these simple steps to start earning with 5PT Finance"
    >
      {/* Steps */}
      <div className="relative mb-24">
        {/* Progress Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-900/50 via-blue-900/50 to-purple-900/50 hidden md:block"></div>

        {/* Progress Indicator - Animated dot that moves along the line */}
        <motion.div
          className="absolute left-1/2 w-4 h-4 rounded-full bg-purple-500 hidden md:block z-10"
          style={{ marginLeft: "-0.5rem" }}
          animate={{
            top: `${(activeStep - 1) * 25}%`,
            backgroundColor:
              activeStep === 1
                ? "#8B5CF6"
                : activeStep === 2
                  ? "#3B82F6"
                  : activeStep === 3
                    ? "#06B6D4"
                    : activeStep === 4
                      ? "#10B981"
                      : "#8B5CF6",
          }}
          transition={{ duration: 0.8, ease: [0.19, 1.0, 0.22, 1.0] }}
        />

        {/* Steps */}
        <div className="space-y-16 relative">
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
              <motion.div
                className={`absolute top-0 hidden md:flex items-center justify-center w-14 h-14 rounded-full border-4 z-20 cursor-pointer
                  ${activeStep === step.number ? "border-purple-500 shadow-lg shadow-purple-500/20" : "border-gray-700 bg-black text-gray-400"}`}
                style={{
                  [index % 2 === 0 ? "right" : "left"]: "-3.5rem",
                }}
                animate={{
                  background:
                    activeStep === step.number
                      ? `linear-gradient(to right, var(--tw-gradient-from), var(--tw-gradient-to))`
                      : "#000",
                  "--tw-gradient-from": activeStep === step.number ? step.color.split(" ")[0].replace("from-", "") : "",
                  "--tw-gradient-to": activeStep === step.number ? step.color.split(" ")[1].replace("to-", "") : "",
                }}
                transition={{ duration: 0.5 }}
                onClick={() => handleStepClick(step.number)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className={`text-lg font-bold ${activeStep === step.number ? "text-white" : "text-gray-400"}`}>
                  {step.number}
                </span>
              </motion.div>

              {/* Content Card */}
              <motion.div
                variants={cardVariants}
                animate={activeStep === step.number ? "active" : "inactive"}
                onClick={() => handleStepClick(step.number)}
                className="cursor-pointer"
              >
                <ContentCard
                  className={`transition-all duration-500 ${
                    activeStep === step.number
                      ? "border-purple-500/50 shadow-[0_0_25px_rgba(139,92,246,0.3)]"
                      : "border-purple-500/20"
                  }`}
                >
                  {/* Mobile Step Number */}
                  <div className="flex items-center gap-3 md:hidden mb-4">
                    <motion.div
                      className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                        activeStep === step.number
                          ? "border-purple-500 bg-purple-900/50 text-white"
                          : "border-gray-700 bg-black text-gray-400"
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="text-sm font-bold">{step.number}</span>
                    </motion.div>
                    <h3 className="text-lg font-bold text-white">{step.title}</h3>
                  </div>

                  {/* Desktop Title */}
                  <h3 className="text-xl font-bold text-white mb-3 hidden md:block">{step.title}</h3>

                  {/* Icon and Description */}
                  <div className={`flex items-start gap-4 ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}>
                    <motion.div
                      className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                        activeStep === step.number
                          ? "bg-gradient-to-r " + step.color + " text-white shadow-lg"
                          : "bg-purple-900/30 text-purple-400"
                      }`}
                      variants={iconVariants}
                      animate={activeStep === step.number ? "active" : "inactive"}
                    >
                      {step.icon}
                    </motion.div>
                    <div>
                      <p className="text-gray-300 mb-4 text-lg">{step.description}</p>

                      {/* Expanded Details (only visible for active step) */}
                      <AnimatePresence>
                        {activeStep === step.number && (
                          <motion.div
                            key={`details-${step.number}`}
                            variants={detailsVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            className="mt-4 space-y-3 overflow-hidden"
                          >
                            {step.details.map((detail, i) => (
                              <motion.div
                                key={i}
                                className="flex items-start gap-3"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + i * 0.1 }}
                              >
                                <div
                                  className={`w-6 h-6 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center flex-shrink-0 mt-0.5`}
                                >
                                  <ChevronRight className="h-4 w-4 text-white" />
                                </div>
                                <p className="text-gray-300">{detail}</p>
                              </motion.div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </ContentCard>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Step Indicators - Mobile and Tablet */}
      <div className="flex justify-center gap-2 mb-8 md:hidden">
        {steps.map((step) => (
          <motion.button
            key={`indicator-${step.number}`}
            className={`w-3 h-3 rounded-full ${activeStep === step.number ? "bg-purple-500" : "bg-gray-700"}`}
            onClick={() => handleStepClick(step.number)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            animate={{
              backgroundColor:
                activeStep === step.number
                  ? step.number === 1
                    ? "#8B5CF6"
                    : step.number === 2
                      ? "#3B82F6"
                      : step.number === 3
                        ? "#06B6D4"
                        : step.number === 4
                          ? "#10B981"
                          : "#8B5CF6"
                  : "#374151",
            }}
          />
        ))}
      </div>

      {/* CTA Button */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <Link href="/dashboard">
          <CyberButton variant="primary" size="lg" className="animate-pulse">
            Start Your Investment Journey
          </CyberButton>
        </Link>
        <p className="text-gray-400 mt-4">Join now and be among the first investors</p>
      </motion.div>
    </SectionContainer>
  )
}

export default OnboardingGuide
