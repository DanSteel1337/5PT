"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Gift, ChevronRight, ChevronLeft } from "lucide-react"
import { AnimatedCard } from "@/components/ui/animated-card"
import { formatCrypto } from "@/lib/utils"
import { useMounted } from "@/hooks/use-mounted"

interface RewardItem {
  id: number
  name: string
  amount: number
  status: "pending" | "claimed" | "available"
  timestamp: number
}

interface AnimatedRewardsCardProps {
  rewards: RewardItem[]
  totalRewards: number
  isLoading?: boolean
}

export function AnimatedRewardsCard({ rewards = [], totalRewards = 0, isLoading = false }: AnimatedRewardsCardProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const [activeReward, setActiveReward] = useState<RewardItem | null>(null)
  const [particles, setParticles] = useState<Array<{ x: number; y: number; size: number; speed: number }>>([])
  const cardRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)
  const mounted = useMounted()

  // Items per page
  const itemsPerPage = 3
  const totalPages = Math.ceil(rewards.length / itemsPerPage)

  // Get current page items
  const currentRewards = rewards.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)

  // Initialize particles for animation
  useEffect(() => {
    if (!mounted || !cardRef.current) return

    // Generate particles
    const newParticles = Array.from({ length: 20 }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 3,
      speed: 0.2 + Math.random() * 0.5,
    }))

    setParticles(newParticles)

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [mounted])

  // Animate particles
  useEffect(() => {
    if (!mounted || particles.length === 0 || !cardRef.current) return

    const animate = () => {
      setParticles((prevParticles) =>
        prevParticles.map((particle) => {
          // Move particles upward
          const newY = particle.y - particle.speed

          // Reset particles that go off screen
          return newY < -10 ? { ...particle, y: 110, x: Math.random() * 100 } : { ...particle, y: newY }
        }),
      )

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [particles, mounted])

  // Navigation functions
  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1)
    }
  }

  // Set active reward
  const handleRewardClick = (reward: RewardItem) => {
    setActiveReward(reward === activeReward ? null : reward)
  }

  if (!mounted) return null

  return (
    <AnimatedCard
      ref={cardRef}
      variant="glass"
      className="border-purple-500/30 h-full overflow-hidden"
      intensity="subtle"
    >
      <div className="p-6 relative">
        {/* Animated particles in background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map((particle, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-purple-500/20"
              style={{
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                opacity: 0.2 + Math.random() * 0.3,
              }}
            />
          ))}
        </div>

        <div className="relative z-10">
          <div className="flex justify-between items-center mb-4">
            <motion.h3
              className="text-xl font-bold flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Gift className="h-5 w-5 mr-2 text-purple-400" />
              Rewards
            </motion.h3>

            <motion.div
              className="text-sm text-gray-400"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              Total: {formatCrypto(totalRewards)}
            </motion.div>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-gray-800 rounded animate-pulse" />
              ))}
            </div>
          ) : rewards.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No rewards available yet</div>
          ) : (
            <>
              <div className="space-y-3">
                <AnimatePresence mode="wait">
                  {currentRewards.map((reward) => (
                    <motion.div
                      key={reward.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      onClick={() => handleRewardClick(reward)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        activeReward?.id === reward.id
                          ? "border-purple-500/50 bg-purple-500/10"
                          : "border-gray-700 hover:border-purple-500/30"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{reward.name}</div>
                          <div className="text-sm text-gray-400">{new Date(reward.timestamp).toLocaleDateString()}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{formatCrypto(reward.amount)}</div>
                          <div
                            className={`text-xs ${
                              reward.status === "available"
                                ? "text-green-400"
                                : reward.status === "pending"
                                  ? "text-yellow-400"
                                  : "text-gray-400"
                            }`}
                          >
                            {reward.status.charAt(0).toUpperCase() + reward.status.slice(1)}
                          </div>
                        </div>
                      </div>

                      {activeReward?.id === reward.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 pt-3 border-t border-gray-700 text-sm text-gray-400"
                        >
                          {reward.status === "available" ? (
                            <button className="px-3 py-1 bg-purple-500/20 hover:bg-purple-500/30 rounded text-purple-300 transition-colors">
                              Claim Reward
                            </button>
                          ) : reward.status === "pending" ? (
                            "This reward will be available soon"
                          ) : (
                            "This reward has been claimed"
                          )}
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center mt-4 space-x-2">
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 0}
                    className={`p-1 rounded-full ${
                      currentPage === 0 ? "text-gray-600 cursor-not-allowed" : "text-purple-400 hover:bg-purple-500/20"
                    }`}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  <span className="text-sm text-gray-400">
                    {currentPage + 1} / {totalPages}
                  </span>

                  <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages - 1}
                    className={`p-1 rounded-full ${
                      currentPage === totalPages - 1
                        ? "text-gray-600 cursor-not-allowed"
                        : "text-purple-400 hover:bg-purple-500/20"
                    }`}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AnimatedCard>
  )
}
