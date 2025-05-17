"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { motion, useInView } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import GradientText from "@/components/ui/gradient-text"

// Performance optimized ecosystem section
export function EcosystemSection() {
  const [activeCard, setActiveCard] = useState<number | null>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 })

  // Memoized card data to prevent recreation on each render
  const ecosystemCards = [
    {
      id: 1,
      title: "Investment Pools",
      description:
        "Join structured investment pools with clear qualification criteria and transparent reward distribution.",
      icon: "💰",
    },
    {
      id: 2,
      title: "Referral Network",
      description: "Grow your network and earn additional rewards through our multi-level referral program.",
      icon: "🔗",
    },
    {
      id: 3,
      title: "Token Rewards",
      description: "Earn 5PT tokens through investments, referrals, and active participation in the ecosystem.",
      icon: "🏆",
    },
    {
      id: 4,
      title: "Community Governance",
      description: "Participate in decision-making processes and help shape the future of the 5PT ecosystem.",
      icon: "🏛️",
    },
  ]

  // Intersection observer for performance optimization
  useEffect(() => {
    if (!sectionRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        // Only run animations when in viewport
        const [entry] = entries
        if (entry.isIntersecting) {
          sectionRef.current?.classList.add("animate-section")
        } else {
          sectionRef.current?.classList.remove("animate-section")
        }
      },
      { threshold: 0.1 },
    )

    observer.observe(sectionRef.current)

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  // Memoized handler to prevent recreation on each render
  const handleCardHover = useCallback((id: number | null) => {
    setActiveCard(id)
  }, [])

  return (
    <section ref={sectionRef} className="py-20 relative overflow-hidden" id="ecosystem">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Join the <GradientText>5PT Investment Ecosystem</GradientText>
          </motion.h2>

          <motion.p
            className="text-lg text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Discover the benefits of participating in our decentralized investment platform
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ecosystemCards.map((card) => (
            <motion.div
              key={card.id}
              className={cn(
                "bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 transition-all duration-300",
                activeCard === card.id ? "border border-purple-500 shadow-glow-sm" : "border border-gray-800",
              )}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.1 * card.id }}
              onMouseEnter={() => handleCardHover(card.id)}
              onMouseLeave={() => handleCardHover(null)}
              // Using transform for GPU acceleration
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.2 },
              }}
            >
              <div className="text-3xl mb-4">{card.icon}</div>
              <h3 className="text-xl font-bold mb-3">{card.title}</h3>
              <p className="text-gray-400 mb-4">{card.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg"
            // Using will-change for GPU hint
            style={{ willChange: "transform" }}
          >
            Explore Ecosystem <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}

export default EcosystemSection
