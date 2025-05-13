"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Check, ChevronDown, ChevronUp, Flame, TrendingUp, Users } from "lucide-react"
import { CyberButton } from "@/components/ui/cyber-button"
import { CyberCard } from "@/components/ui/cyber-card"
import { ClientOnly } from "@/components/ClientOnly"
import { cn } from "@/lib/utils"
import { CONTRACT_CONSTANTS, CONTRACT_ADDRESSES } from "@/lib/contracts"

// FAQ Item type
type FAQItem = {
  question: string
  answer: string
}

export function ConversionSection() {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  // FAQ data based on actual contract mechanics
  const faqs: FAQItem[] = [
    {
      question: "What is the minimum investment to get started?",
      answer: `The minimum investment to join 5PT is just ${CONTRACT_CONSTANTS.MIN_DEPOSIT / 10 ** 18} token. This gives you access to the basic daily rewards of 0.3%. To qualify for higher pools and increased rewards, you'll need to meet the specific requirements for each pool tier.`,
    },
    {
      question: "How does the deflationary mechanism work?",
      answer: `Every deposit is fully burned (100%), permanently removing tokens from circulation. Additionally, when rewards are claimed, a ${CONTRACT_CONSTANTS.CLAIM_TAX_PERCENT}% tax is applied. This aggressive burning mechanism creates strong deflationary pressure that can benefit early investors as token value potentially increases over time.`,
    },
    {
      question: "How do I qualify for investment pools?",
      answer:
        "Pool qualification is based on three factors: your personal investment amount, the total investment of your direct referrals, and the number of direct referrals you have. Early adopters can meet these requirements more easily as they can acquire more tokens at lower prices.",
    },
    {
      question: "What are the advantages of being an early investor?",
      answer:
        "Early investors can acquire tokens at lower prices, making it easier to meet pool qualification requirements. As the token supply decreases through the burning mechanism, early adopters may benefit from potential price appreciation. Additionally, early investors can build their referral networks sooner, potentially increasing their passive income.",
    },
  ]

  // Intersection observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  // Toggle FAQ expansion
  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index)
  }

  return (
    <section id="join-now" ref={sectionRef} className="relative py-20 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/20 to-black z-0"></div>
      <div className="cyber-grid absolute inset-0 opacity-20 z-0"></div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        {/* Main heading with animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 enhanced-heading">
            Join the <span className="text-gradient">5PT Investment Ecosystem</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto enhanced-text">
            Early adopters benefit from lower entry prices, easier pool qualification, and the deflationary tokenomics.
          </p>
        </motion.div>

        {/* Main conversion card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mb-16"
        >
          <CyberCard variant="panel" glowing={true} scanline={true} className="enhanced-card p-8 md:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Left column - Value proposition */}
              <div>
                <h3 className="text-2xl md:text-3xl font-bold mb-6 text-gradient">Early Adoption Advantages</h3>

                <ul className="space-y-4 mb-8">
                  {[
                    "Lower entry price means more tokens for your investment",
                    "Easier qualification for higher-tier investment pools",
                    "Benefit from the deflationary token burning mechanism",
                    "Build your referral network before mainstream adoption",
                    "Position yourself at the top of the referral structure",
                  ].map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-6 w-6 text-purple-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="enhanced-text">{benefit}</span>
                    </li>
                  ))}
                </ul>

                {/* Tokenomics highlights */}
                <div className="grid grid-cols-1 gap-4 mb-8">
                  <div className="bg-black/30 border border-purple-500/30 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Flame className="h-5 w-5 text-purple-400 mr-2" />
                      <h4 className="font-semibold">Deflationary Tokenomics</h4>
                    </div>
                    <p className="text-sm text-gray-300">
                      Every deposit is fully burned (100%), creating a powerful deflationary effect. Additionally, every
                      reward claim incurs a {CONTRACT_CONSTANTS.CLAIM_TAX_PERCENT}% tax. These mechanisms continuously
                      reduce the total supply over time.
                    </p>
                  </div>

                  <div className="bg-black/30 border border-purple-500/30 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <TrendingUp className="h-5 w-5 text-purple-400 mr-2" />
                      <h4 className="font-semibold">Pool Qualification Advantage</h4>
                    </div>
                    <p className="text-sm text-gray-300">
                      Pool 1 requires 550,000 tokens personally invested. Early adopters can acquire these tokens at
                      lower prices, making qualification significantly easier.
                    </p>
                  </div>
                </div>

                {/* Contract verification */}
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="flex items-center bg-purple-900/30 px-3 py-1.5 rounded-md">
                    <Users className="h-4 w-4 text-purple-400 mr-2" />
                    <span className="text-sm">Verified Smart Contract</span>
                  </div>
                  <a
                    href={`https://bscscan.com/address/${CONTRACT_ADDRESSES.mainnet.investmentManager}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    View on BscScan →
                  </a>
                </div>
              </div>

              {/* Right column - Deflationary mechanism visualization */}
              <div className="flex flex-col justify-between">
                <div className="mb-8">
                  <h4 className="text-lg font-semibold mb-4 text-center">Deflationary Token Mechanism</h4>

                  <div className="relative h-64 mb-6 bg-black/30 rounded-lg border border-purple-500/30 p-4">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-32 h-32 rounded-full bg-purple-900/30 border border-purple-500 flex items-center justify-center relative overflow-hidden">
                        <div
                          className="absolute inset-0 bg-gradient-to-t from-purple-600/80 to-transparent"
                          style={{ height: "70%" }}
                        ></div>
                        <div className="relative z-10 text-center">
                          <Flame className="h-8 w-8 text-purple-400 mx-auto mb-1" />
                          <p className="text-xs">Token Burning</p>
                        </div>
                      </div>

                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-purple-500/30 rounded-full"></div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-purple-500/20 rounded-full"></div>

                      {/* Animated particles representing burned tokens */}
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-2 h-2 bg-purple-500 rounded-full animate-float-to-center"
                          style={{
                            left: `calc(50% + ${Math.cos((i * Math.PI) / 4) * 120}px)`,
                            top: `calc(50% + ${Math.sin((i * Math.PI) / 4) * 120}px)`,
                            animationDelay: `${i * 0.5}s`,
                          }}
                        ></div>
                      ))}
                    </div>

                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="text-center text-sm">
                        <p className="text-gray-400 mb-1">As tokens are burned, scarcity increases</p>
                        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-purple-600 to-blue-500 rounded-full w-3/4"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-sm text-gray-300">
                    <p className="mb-2">
                      <strong>Initial Supply:</strong> 10,000,000,000 tokens
                    </p>
                    <p>
                      <strong>Burning Mechanism:</strong> Every deposit is fully burned, creating a powerful
                      deflationary effect that can benefit early investors.
                    </p>
                  </div>
                </div>

                {/* Main CTA */}
                <ClientOnly>
                  <div className="space-y-4">
                    <CyberButton variant="primary" size="lg" className="w-full text-center py-5 group">
                      <span className="flex items-center justify-center">
                        Connect Wallet & Start Investing
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </CyberButton>

                    <div className="flex gap-3">
                      <a
                        href="https://bscscan.com/address/0x7CcFFB3Dc39b50f4EEB8aA2D9aCF667d6ef8D0bc#code"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1"
                      >
                        <CyberButton variant="outline" size="md" className="w-full text-center">
                          View Contract
                        </CyberButton>
                      </a>
                      <a
                        href="https://bscscan.com/token/0x8FafdFB035C9426a50D842873D5d401C933bE09F"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1"
                      >
                        <CyberButton variant="outline" size="md" className="w-full text-center">
                          View Token
                        </CyberButton>
                      </a>
                    </div>
                  </div>
                </ClientOnly>
              </div>
            </div>
          </CyberCard>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          <h3 className="text-2xl font-bold mb-8 text-center enhanced-heading">Frequently Asked Questions</h3>

          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={cn(
                  "border border-purple-500/30 mb-4 rounded-lg overflow-hidden transition-all",
                  expandedFAQ === index ? "cyber-glow" : "",
                )}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full p-5 text-left flex justify-between items-center"
                >
                  <span
                    className={cn(
                      "font-semibold transition-colors",
                      expandedFAQ === index ? "text-gradient" : "text-white",
                    )}
                  >
                    {faq.question}
                  </span>
                  {expandedFAQ === index ? (
                    <ChevronUp className="h-5 w-5 text-purple-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-purple-400" />
                  )}
                </button>

                <div
                  className={cn(
                    "overflow-hidden transition-all duration-300 ease-in-out",
                    expandedFAQ === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
                  )}
                >
                  <div className="p-5 pt-0 text-gray-300 enhanced-text">{faq.answer}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Final CTA */}
          <div className="text-center mt-12">
            <p className="text-xl mb-6 enhanced-text">Ready to benefit from early adoption advantages?</p>
            <ClientOnly>
              <CyberButton variant="primary" size="lg" className="mx-auto">
                Connect Wallet & Invest Now
              </CyberButton>
            </ClientOnly>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
