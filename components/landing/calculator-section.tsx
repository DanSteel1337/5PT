"use client"

import { useState, useEffect } from "react"
import { InvestmentCalculator } from "@/components/calculators/investment-calculator"
import { SectionContainer } from "@/components/ui/section-container"

export function CalculatorSection() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <SectionContainer
      id="calculator"
      title="INVESTMENT CALCULATOR"
      subtitle="See how your investment can grow with our revolutionary DeFi protocol"
    >
      <InvestmentCalculator />
    </SectionContainer>
  )
}

export default CalculatorSection
