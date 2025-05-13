"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { TiltCard } from "@/components/parallax/tilt-card"
import { CheckCircle, Lock } from "lucide-react"
import { SectionContainer } from "@/components/ui/section-container"
import { ContentCard } from "@/components/ui/content-card"

export function PoolQualification() {
  const [mounted, setMounted] = useState(false)
  const [activePool, setActivePool] = useState(1)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Pool qualification data from the contract
  const pools = [
    {
      id: 1,
      name: "Pool 1",
      personalInvestment: "550 5PT (~$1,000)",
      directPartners: 1,
      directInvestment: "550 5PT (~$1,000)",
      poolShare: "0.035%",
      isExclusive: false,
    },
    {
      id: 2,
      name: "Pool 2",
      personalInvestment: "1,450 5PT (~$2,500)",
      directPartners: 3,
      directInvestment: "1,450 5PT (~$2,500)",
      poolShare: "0.035%",
      isExclusive: false,
    },
    {
      id: 3,
      name: "Pool 3",
      personalInvestment: "3,000 5PT (~$5,000)",
      directPartners: 5,
      directInvestment: "6,000 5PT (~$10,000)",
      poolShare: "0.035%",
      isExclusive: false,
    },
    {
      id: 4,
      name: "Pool 4",
      personalInvestment: "5,500 5PT (~$10,000)",
      directPartners: 10,
      directInvestment: "11,000 5PT (~$20,000)",
      poolShare: "0.035%",
      isExclusive: false,
    },
    {
      id: 5,
      name: "Pool 5",
      personalInvestment: "14,250 5PT (~$25,000)",
      directPartners: 15,
      directInvestment: "28,500 5PT (~$50,000)",
      poolShare: "0.035%",
      isExclusive: false,
    },
    {
      id: 6,
      name: "Pool 6",
      personalInvestment: "28,500 5PT (~$50,000)",
      directPartners: 20,
      directInvestment: "57,000 5PT (~$100,000)",
      poolShare: "0.02%",
      isExclusive: false,
    },
    {
      id: 7,
      name: "Pool 7",
      personalInvestment: "57,000 5PT (~$100,000)",
      directPartners: 25,
      directInvestment: "114,000 5PT (~$200,000)",
      poolShare: "0.02%",
      isExclusive: false,
    },
    {
      id: 8,
      name: "Pool 8",
      personalInvestment: "Whitelist Only",
      directPartners: "Whitelist Only",
      directInvestment: "Whitelist Only",
      poolShare: "0.02%",
      isExclusive: true,
    },
    {
      id: 9,
      name: "Pool 9",
      personalInvestment: "Whitelist Only",
      directPartners: "Whitelist Only",
      directInvestment: "Whitelist Only",
      poolShare: "0.02%",
      isExclusive: true,
    },
  ]

  return (
    <SectionContainer
      id="pools"
      title="POOL QUALIFICATION"
      subtitle="Each pool has specific qualification requirements based on your investment and referral performance"
    >
      {/* Pool Selection Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {pools.map((pool) => (
          <motion.button
            key={pool.id}
            className={`px-4 py-2 rounded-lg transition-all duration-300 ${
              activePool === pool.id
                ? "bg-purple-600 text-white"
                : "bg-black/40 text-gray-400 hover:bg-black/60 hover:text-gray-300"
            } ${pool.isExclusive ? "border border-purple-500/50" : ""}`}
            onClick={() => setActivePool(pool.id)}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 * pool.id }}
          >
            {pool.name}
            {pool.isExclusive && <Lock className="inline-block ml-2 h-3 w-3" />}
          </motion.button>
        ))}
      </div>

      {/* Active Pool Details */}
      <TiltCard>
        <ContentCard className="max-w-3xl mx-auto">
          {pools.map((pool) => (
            <div key={pool.id} className={activePool === pool.id ? "block" : "hidden"}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="card-title">{pool.name} Qualification</h3>
                <div className="flex items-center">
                  <span className="text-sm text-gray-400 mr-2">Daily Pool Share:</span>
                  <span className="text-lg font-bold text-purple-400">{pool.poolShare}</span>
                </div>
              </div>

              {pool.isExclusive ? (
                <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-6 mb-6">
                  <div className="flex items-center mb-4">
                    <Lock className="h-6 w-6 text-purple-400 mr-3" />
                    <h4 className="text-xl font-semibold text-white">Exclusive Whitelist Pool</h4>
                  </div>
                  <p className="text-gray-300 mb-4">
                    This is a special pool reserved for early supporters, strategic partners, and significant
                    contributors to the 5PT ecosystem.
                  </p>
                  <p className="text-purple-300 font-medium">
                    Contact the team to inquire about whitelist opportunities.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <QualificationItem title="Personal Investment Required" value={pool.personalInvestment} delay={0.1} />
                  <QualificationItem
                    title="Direct Partners Required"
                    value={pool.directPartners.toString()}
                    delay={0.2}
                  />
                  <QualificationItem
                    title="Total Direct Investment Required"
                    value={pool.directInvestment}
                    delay={0.3}
                  />
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-gray-800">
                <h4 className="text-lg font-semibold text-white mb-4">How to Qualify:</h4>
                <ul className="space-y-2">
                  {!pool.isExclusive ? (
                    <>
                      <QualificationStep
                        text={`Invest at least ${pool.personalInvestment} in the platform`}
                        delay={0.1}
                      />
                      <QualificationStep
                        text={`Refer at least ${pool.directPartners} direct partners to the platform`}
                        delay={0.2}
                      />
                      <QualificationStep
                        text={`Generate at least ${pool.directInvestment} in total direct referral volume`}
                        delay={0.3}
                      />
                      <QualificationStep
                        text="Maintain your qualification to continue receiving pool rewards"
                        delay={0.4}
                      />
                    </>
                  ) : (
                    <>
                      <QualificationStep text="Receive an invitation from the 5PT team" delay={0.1} />
                      <QualificationStep text="Complete the whitelist verification process" delay={0.2} />
                      <QualificationStep
                        text="Maintain your whitelist status to continue receiving exclusive pool rewards"
                        delay={0.3}
                      />
                    </>
                  )}
                </ul>
              </div>
            </div>
          ))}
        </ContentCard>
      </TiltCard>
    </SectionContainer>
  )
}

function QualificationItem({ title, value, delay = 0 }) {
  return (
    <motion.div
      className="bg-black/30 rounded-lg p-4"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="flex justify-between items-center">
        <span className="text-gray-400">{title}:</span>
        <span className="text-xl font-semibold text-purple-400">{value}</span>
      </div>
    </motion.div>
  )
}

function QualificationStep({ text, delay = 0 }) {
  return (
    <motion.li
      className="flex items-start"
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <CheckCircle className="h-5 w-5 text-purple-400 mr-2 mt-0.5 flex-shrink-0" />
      <span className="text-gray-300">{text}</span>
    </motion.li>
  )
}

export default PoolQualification
