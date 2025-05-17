"use client"

import { useState, useEffect } from "react"
import { motion, useAnimation, AnimatePresence } from "framer-motion"
import { Check, X, Info, ChevronRight, ChevronLeft } from "lucide-react"
import { AnimatedCard } from "@/components/ui/animated-card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { POOL_CRITERIA } from "@/lib/contracts"
import { formatCrypto } from "@/lib/utils"
import { useMounted } from "@/hooks/use-mounted"

interface PoolQualification3DProps {
  data: {
    totalInvested: number
    referralCount: number
    directInvestment: number
    qualifiedPools: number[]
  }
}

export function PoolQualification3D({ data }: PoolQualification3DProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const [hoveredPool, setHoveredPool] = useState<number | null>(null)
  const controls = useAnimation()
  const mounted = useMounted()

  // Only show 3 pools per page for a cleaner UI
  const poolsPerPage = 3
  const totalPages = Math.ceil(POOL_CRITERIA.length / poolsPerPage)

  // FIX: Move state update out of render body into useEffect
  useEffect(() => {
    if (mounted && currentPage >= totalPages) {
      setCurrentPage(0)
    }
  }, [currentPage, totalPages, mounted])

  const visiblePools = POOL_CRITERIA.slice(
    currentPage * poolsPerPage,
    Math.min((currentPage + 1) * poolsPerPage, POOL_CRITERIA.length),
  )

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      controls.start({ x: "-100%", opacity: 0 }).then(() => {
        setCurrentPage(currentPage + 1)
        controls.set({ x: "100%" })
        controls.start({ x: "0%", opacity: 1 })
      })
    }
  }

  const prevPage = () => {
    if (currentPage > 0) {
      controls.start({ x: "100%", opacity: 0 }).then(() => {
        setCurrentPage(currentPage - 1)
        controls.set({ x: "-100%" })
        controls.start({ x: "0%", opacity: 1 })
      })
    }
  }

  useEffect(() => {
    controls.set({ x: "0%", opacity: 1 })
  }, [controls])

  if (!mounted) return null

  return (
    <AnimatedCard variant="glass" className="border-purple-500/30 h-full" intensity="subtle">
      <div className="p-6">
        <motion.div
          className="flex justify-between items-center mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h3
            className="text-xl font-bold"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Pool Qualification
          </motion.h3>

          <div className="flex items-center space-x-2">
            <motion.button
              className={`p-1 rounded-full ${
                currentPage === 0 ? "text-gray-600 cursor-not-allowed" : "text-purple-400 hover:bg-purple-500/20"
              }`}
              onClick={prevPage}
              disabled={currentPage === 0}
              whileHover={currentPage > 0 ? { scale: 1.1 } : {}}
              whileTap={currentPage > 0 ? { scale: 0.9 } : {}}
            >
              <ChevronLeft className="h-5 w-5" />
            </motion.button>

            <span className="text-sm text-gray-400">
              {currentPage + 1} / {totalPages}
            </span>

            <motion.button
              className={`p-1 rounded-full ${
                currentPage === totalPages - 1
                  ? "text-gray-600 cursor-not-allowed"
                  : "text-purple-400 hover:bg-purple-500/20"
              }`}
              onClick={nextPage}
              disabled={currentPage === totalPages - 1}
              whileHover={currentPage < totalPages - 1 ? { scale: 1.1 } : {}}
              whileTap={currentPage < totalPages - 1 ? { scale: 0.9 } : {}}
            >
              <ChevronRight className="h-5 w-5" />
            </motion.button>
          </div>
        </motion.div>

        <motion.div className="space-y-4" animate={controls} initial={{ opacity: 1, x: "0%" }}>
          {visiblePools.map((pool) => {
            const isQualified = data.qualifiedPools.includes(pool.id)
            const isHovered = hoveredPool === pool.id

            return (
              <motion.div
                key={pool.id}
                className={`relative rounded-xl p-5 border transition-all duration-300 overflow-hidden ${
                  isQualified
                    ? "border-green-500/30 bg-gradient-to-br from-green-500/10 to-green-900/10"
                    : "border-gray-700 bg-gradient-to-br from-gray-800/30 to-gray-900/30"
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: pool.id * 0.1 }}
                onHoverStart={() => setHoveredPool(pool.id)}
                onHoverEnd={() => setHoveredPool(null)}
                style={{
                  transform: isHovered ? "translateZ(20px)" : "translateZ(0px)",
                  transition: "transform 0.3s ease-out",
                }}
              >
                {/* Glow effect */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      className={`absolute inset-0 ${isQualified ? "bg-green-500/5" : "bg-purple-500/5"}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </AnimatePresence>

                <div className="absolute top-4 right-4">
                  {isQualified ? (
                    <motion.div
                      className="bg-green-500/20 p-1 rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 15 }}
                    >
                      <Check className="h-4 w-4 text-green-400" />
                    </motion.div>
                  ) : (
                    <motion.div
                      className="bg-gray-800 p-1 rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 15 }}
                    >
                      <X className="h-4 w-4 text-gray-500" />
                    </motion.div>
                  )}
                </div>

                <motion.h3
                  className="font-medium mb-3 text-lg"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Pool {pool.id + 1}
                </motion.h3>

                <div className="grid grid-cols-3 gap-3 text-sm">
                  <PoolRequirement
                    label="Investment"
                    value={
                      typeof pool.personalInvestment === "string"
                        ? pool.personalInvestment
                        : formatCrypto(Number(pool.personalInvestment) / 10 ** 18)
                    }
                    isMet={data.totalInvested >= Number(pool.personalInvestment) / 10 ** 18}
                    tooltip="Required personal investment"
                  />

                  <PoolRequirement
                    label="Referrals"
                    value={pool.directRefs.toString()}
                    isMet={data.referralCount >= Number(pool.directRefs)}
                    tooltip="Required direct referrals"
                  />

                  <PoolRequirement
                    label="Direct Vol."
                    value={
                      typeof pool.directInvestment === "string"
                        ? pool.directInvestment
                        : formatCrypto(Number(pool.directInvestment) / 10 ** 18)
                    }
                    isMet={data.directInvestment >= Number(pool.directInvestment) / 10 ** 18}
                    tooltip="Required direct investment volume"
                  />
                </div>

                {!isQualified && (
                  <motion.div
                    className="mt-3 pt-3 border-t border-gray-800 text-xs text-gray-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    Qualify to earn an additional {pool.share / 10000}% daily from this pool
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </AnimatedCard>
  )
}

function PoolRequirement({ label, value, isMet, tooltip }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
      <div className="flex items-center text-gray-400 mb-1">
        <span>{label}</span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-3 w-3 ml-1 text-gray-500" />
            </TooltipTrigger>
            <TooltipContent>
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className={`font-medium ${isMet ? "text-green-400" : "text-gray-300"}`}>{value}</div>
    </motion.div>
  )
}
