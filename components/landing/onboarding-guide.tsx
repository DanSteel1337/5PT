"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { CyberButton } from "@/components/ui/cyber-button"
import { Wallet, Coins, LayoutGrid, TrendingUp, Users, ArrowRight, ChevronRight, Check } from "lucide-react"
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
  // Determine if this step should show details
  const showDetails = isActive

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      style={{ willChange: "transform, opacity" }}
    >
      {/* Connection line between steps */}
      {index < totalSteps - 1 && (
        <div className="absolute top-[40px] left-[calc(100%-10px)] w-[calc(100%-60px)] h-[2px] z-0 overflow-hidden">
          {/* Base line */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/70 via-indigo-500/40 to-blue-500/70"></div>

          {/* Animated pulse effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 opacity-70"
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        </div>
      )}

      <div className="flex flex-col items-center">
        {/* Step indicator with futuristic design */}
        <div className="relative mb-6">
          {/* Outer glow ring */}
          <motion.div
            className={`absolute inset-[-15px] rounded-full ${
              isActive
                ? "bg-purple-500/10 shadow-[0_0_30px_rgba(139,92,246,0.6)]"
                : isCompleted
                  ? "bg-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,0.4)]"
                  : "bg-purple-900/10"
            }`}
            animate={{
              scale: isActive ? [1, 1.1, 1] : 1,
              opacity: isActive ? [0.6, 1, 0.6] : 0.6,
            }}
            transition={{
              duration: 3,
              repeat: isActive ? Number.POSITIVE_INFINITY : 0,
              repeatType: "reverse",
            }}
          />

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

              {/* Animated shine effect */}
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                  background: "linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.8) 50%, transparent 60%)",
                  backgroundSize: "200% 200%",
                  animation: isActive ? "shine 3s infinite linear" : "none",
                }}
              />

              {/* Icon */}
              <div className="relative z-10">{React.cloneElement(step.icon, { size: 32 })}</div>

              {/* Completion indicator */}
              {isCompleted && !isActive && (
                <motion.div
                  className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full p-1 z-20 shadow-lg"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                >
                  <Check className="h-3 w-3" />
                </motion.div>
              )}

              {/* Step number */}
              <motion.div
                className={`absolute -top-3 -left-3 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  isActive
                    ? "bg-purple-500 text-white"
                    : isCompleted
                      ? "bg-blue-500 text-white"
                      : "bg-gray-800 text-gray-400"
                }`}
              >
                {index + 1}
              </motion.div>
            </div>

            {/* Animated scanner effect */}
            {isActive && (
              <motion.div
                className="absolute inset-0 overflow-hidden"
                style={{
                  clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/30 to-transparent"
                  animate={{
                    top: ["-100%", "200%"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                />
              </motion.div>
            )}

            {/* Corner accents for active state */}
            {isActive && (
              <>
                <div className="absolute top-0 left-[10px] w-2 h-2 bg-purple-500 rounded-full shadow-[0_0_10px_rgba(139,92,246,0.8)]" />
                <div className="absolute bottom-0 right-[10px] w-2 h-2 bg-purple-500 rounded-full shadow-[0_0_10px_rgba(139,92,246,0.8)]" />
              </>
            )}
          </div>
        </div>

        {/* Title */}
        <h3
          className={`text-xl font-bold mb-2 text-center transition-colors duration-300 ${
            isActive ? "text-white text-shadow-sm" : "text-gray-200"
          }`}
        >
          {step.title}
        </h3>

        {/* Description */}
        <p className="text-gray-400 text-center mb-4 max-w-[250px]">{step.description}</p>

        {/* Expandable details */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              className="w-full space-y-3 border-t border-purple-500/30 pt-4"
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

              {/* Action button */}
              {step.action && (
                <motion.div
                  className="mt-4 pt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <Link
                    href={step.action.link}
                    className="inline-flex items-center px-4 py-2 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-colors border border-purple-500/40 cyber-glow"
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
      </div>
    </SectionContainer>
  )
}

// Add keyframes for the shine effect
const styles = `
@keyframes shine {
  0% {
    background-position: -100% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.text-shadow-sm {
  text-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
}
`

export default function OnboardingGuideWithStyles() {
  return (
    <>
      <style jsx global>
        {styles}
      </style>
      <OnboardingGuide />
    </>
  )
}
