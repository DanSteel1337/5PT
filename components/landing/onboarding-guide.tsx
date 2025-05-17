"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { CyberButton } from "@/components/ui/cyber-button"
import { Wallet, Coins, LayoutGrid, TrendingUp, Users, ArrowRight, ChevronRight } from "lucide-react"
import { SectionContainer } from "@/components/ui/section-container"
import { useMounted } from "@/hooks/use-mounted"
import React from "react"

// Memoized step component for better performance
const OnboardingStation = React.memo(function OnboardingStation({
  step,
  isActive,
  onClick,
  index,
  totalSteps,
  isCompleted,
}) {
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      style={{ willChange: "transform, opacity" }}
    >
      {/* Connection lines removed as requested */}

      <div className="flex flex-col items-center">
        {/* Step indicator with futuristic design */}
        <div className="relative mb-6">
          {/* Outer glow ring - only for active step */}
          {isActive && (
            <div className="absolute inset-[-15px] rounded-full bg-purple-500/10 shadow-[0_0_30px_rgba(139,92,246,0.6)]" />
          )}

          {/* Hexagonal container */}
          <div className="relative cursor-pointer" onClick={onClick}>
            {/* Hexagon background with gradient */}
            <div
              className={`relative w-20 h-20 flex items-center justify-center ${
                isActive ? "text-white" : isCompleted ? "text-blue-200" : "text-gray-400"
              }`}
              style={{
                clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                background: isActive
                  ? "linear-gradient(135deg, rgba(139, 92, 246, 0.8), rgba(59, 130, 246, 0.5))"
                  : isCompleted
                    ? "linear-gradient(135deg, rgba(59, 130, 246, 0.6), rgba(99, 102, 241, 0.4))"
                    : "linear-gradient(135deg, rgba(91, 33, 182, 0.3), rgba(67, 56, 202, 0.1))",
                boxShadow: isActive
                  ? "0 0 20px rgba(139, 92, 246, 0.6), inset 0 0 10px rgba(139, 92, 246, 0.4)"
                  : isCompleted
                    ? "0 0 15px rgba(59, 130, 246, 0.4), inset 0 0 8px rgba(59, 130, 246, 0.3)"
                    : "none",
              }}
            >
              {/* Inner hexagon border */}
              <div
                className="absolute inset-[3px] opacity-50"
                style={{
                  clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                }}
              />

              {/* Icon */}
              <div className="relative z-10">{React.cloneElement(step.icon, { size: 32 })}</div>
            </div>

            {/* Corner dots for active state - matching the screenshot */}
            {isActive && (
              <>
                <div className="absolute top-0 left-[10px] w-2 h-2 bg-purple-500 rounded-full" />
                <div className="absolute bottom-0 right-[10px] w-2 h-2 bg-purple-500 rounded-full" />
              </>
            )}
          </div>
        </div>

        {/* Title */}
        <h3
          className={`text-xl font-bold mb-2 text-center transition-colors duration-300 ${
            isActive ? "text-white" : "text-gray-200"
          }`}
        >
          {step.title}
        </h3>

        {/* Description */}
        <p className="text-gray-400 text-center mb-4 max-w-[250px]">{step.description}</p>

        {/* Expandable details - only for active step */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              className="w-full space-y-3"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {step.details.map((detail, i) => (
                <motion.div
                  key={i}
                  className="flex items-start"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                >
                  <ChevronRight className="h-5 w-5 text-purple-400 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-400 text-sm">{detail}</p>
                </motion.div>
              ))}

              {/* Action button - styled to match the screenshot */}
              {step.action && (
                <motion.div
                  className="mt-4 pt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <Link
                    href={step.action.link}
                    className="inline-flex items-center px-4 py-2 rounded-md bg-purple-900/80 text-purple-100 hover:bg-purple-800 transition-colors"
                  >
                    {step.action.text} <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
})

export function OnboardingGuide() {
  const mounted = useMounted()
  const [activeStep, setActiveStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [isAutoAdvancing, setIsAutoAdvancing] = useState(true)

  // Define steps with useMemo to prevent recreation on each render
  const steps = useMemo(
    () => [
      {
        title: "Create Wallet",
        description: "Set up a BSC-compatible wallet like MetaMask or Trust Wallet",
        icon: <Wallet className="h-6 w-6" />,
        details: [
          "Download MetaMask or Trust Wallet from official sources",
          "Create a new wallet and securely store your recovery phrase",
          "Never share your private keys or recovery phrase with anyone",
        ],
        action: {
          text: "Learn more about wallet security",
          link: "/security",
        },
      },
      {
        title: "Add BSC Network",
        description: "Configure your wallet to connect to Binance Smart Chain",
        icon: <Coins className="h-6 w-6" />,
        details: [
          "Open your wallet settings and add a new network",
          "Enter Binance Smart Chain details (RPC URL, Chain ID: 56)",
          "Ensure you're connected to BSC Mainnet, not Testnet",
        ],
        action: {
          text: "View BSC network details",
          link: "/network",
        },
      },
      {
        title: "Get 5PT Tokens",
        description: "Purchase 5PT tokens on PancakeSwap or other exchanges",
        icon: <LayoutGrid className="h-6 w-6" />,
        details: [
          "Buy BNB from an exchange and transfer to your wallet",
          "Visit PancakeSwap and connect your wallet",
          "Swap BNB for 5PT tokens using our contract address",
        ],
        action: {
          text: "Buy 5PT tokens now",
          link: "/buy",
        },
      },
      {
        title: "Choose Investment Pool",
        description: "Select the investment pool that matches your goals",
        icon: <TrendingUp className="h-6 w-6" />,
        details: [
          "Connect your wallet to our dApp",
          "Review the different pool options and their returns",
          "Choose a pool based on your investment amount and referral network",
        ],
        action: {
          text: "Explore investment pools",
          link: "/pools",
        },
      },
      {
        title: "Grow Your Network",
        description: "Refer friends to earn additional commission rewards",
        icon: <Users className="h-6 w-6" />,
        details: [
          "Get your unique referral link from the dashboard",
          "Share with friends and on social media",
          "Build your network to qualify for higher pools",
        ],
        action: {
          text: "Get your referral link",
          link: "/referrals",
        },
      },
    ],
    [],
  )

  // Handle step click with useCallback to maintain referential stability
  const handleStepClick = useCallback(
    (index: number) => {
      setActiveStep(index)
      setIsAutoAdvancing(false)

      // Mark previous steps as completed
      if (!completedSteps.includes(index - 1) && index > 0) {
        setCompletedSteps((prev) => [...prev, index - 1])
      }
    },
    [completedSteps],
  )

  // Auto-advance steps
  useEffect(() => {
    if (!isAutoAdvancing) return

    const interval = setInterval(() => {
      setActiveStep((prev) => {
        const next = (prev + 1) % steps.length
        // Mark previous step as completed when auto-advancing
        if (!completedSteps.includes(prev)) {
          setCompletedSteps((prevCompleted) => [...prevCompleted, prev])
        }
        return next
      })
    }, 8000)

    return () => clearInterval(interval)
  }, [isAutoAdvancing, steps.length, completedSteps])

  // Reset auto-advancing after inactivity
  useEffect(() => {
    if (!isAutoAdvancing) {
      const timeout = setTimeout(() => {
        setIsAutoAdvancing(true)
      }, 30000) // Reset to auto-cycle after 30 seconds of inactivity

      return () => clearTimeout(timeout)
    }
  }, [isAutoAdvancing, activeStep])

  // Mobile step indicator component
  const StepIndicator = React.memo(({ index, isActive, isCompleted, onClick }) => (
    <motion.button
      className={`w-3 h-3 rounded-full transition-all duration-300 ${
        isActive ? "bg-purple-500 w-6" : isCompleted ? "bg-blue-500" : "bg-gray-700"
      }`}
      onClick={() => onClick(index)}
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.9 }}
      aria-label={`Go to step ${index + 1}`}
    />
  ))

  if (!mounted) return null

  return (
    <SectionContainer
      id="getting-started"
      title="HOW TO GET STARTED"
      subtitle="Follow these simple steps to start earning with 5PT Finance"
      className="relative overflow-hidden"
    >
      {/* Main content */}
      <div className="relative z-10">
        {/* Desktop view - Horizontal steps */}
        <div className="hidden lg:block mb-16">
          <div className="grid grid-cols-5 gap-6">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`cursor-pointer transition-all duration-300 ${activeStep === index ? "scale-105" : ""}`}
                onClick={() => handleStepClick(index)}
              >
                <OnboardingStation
                  step={step}
                  isActive={activeStep === index}
                  isCompleted={completedSteps.includes(index)}
                  onClick={() => handleStepClick(index)}
                  index={index}
                  totalSteps={steps.length}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Tablet view - Grid layout */}
        <div className="hidden md:block lg:hidden mb-16">
          <div className="grid grid-cols-3 gap-6">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`cursor-pointer transition-all duration-300 ${activeStep === index ? "scale-105" : ""}`}
                onClick={() => handleStepClick(index)}
              >
                <OnboardingStation
                  step={step}
                  isActive={activeStep === index}
                  isCompleted={completedSteps.includes(index)}
                  onClick={() => handleStepClick(index)}
                  index={index}
                  totalSteps={steps.length}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile view - Single active card with indicators */}
        <div className="md:hidden space-y-6 mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <OnboardingStation
                step={steps[activeStep]}
                isActive={true}
                isCompleted={completedSteps.includes(activeStep)}
                onClick={() => {}}
                index={activeStep}
                totalSteps={steps.length}
              />
            </motion.div>
          </AnimatePresence>

          {/* Mobile step indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {steps.map((_, index) => (
              <StepIndicator
                key={index}
                index={index}
                isActive={activeStep === index}
                isCompleted={completedSteps.includes(index)}
                onClick={handleStepClick}
              />
            ))}
          </div>
        </div>

        {/* Navigation buttons for mobile/tablet */}
        <div className="flex justify-center gap-4 mb-8 md:hidden">
          <motion.button
            className="p-2 rounded-full bg-purple-900/50 text-white disabled:opacity-50 disabled:cursor-not-allowed border border-purple-500/30"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleStepClick((activeStep - 1 + steps.length) % steps.length)}
            disabled={activeStep === 0}
          >
            <ChevronRight className="h-5 w-5 rotate-180" />
          </motion.button>
          <motion.button
            className="p-2 rounded-full bg-purple-900/50 text-white border border-purple-500/30"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleStepClick((activeStep + 1) % steps.length)}
          >
            <ChevronRight className="h-5 w-5" />
          </motion.button>
        </div>

        {/* CTA Button - styled to match the screenshot */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Link href="/dashboard">
            <CyberButton variant="primary" size="lg" className="uppercase">
              Start Your Investment Journey
            </CyberButton>
          </Link>
          <p className="text-gray-400 mt-4">Join now and be among the first investors</p>
        </motion.div>
      </div>
    </SectionContainer>
  )
}

export default function OnboardingGuideWithStyles() {
  return <OnboardingGuide />
}
