import dynamic from "next/dynamic"
import { shouldUseMockData } from "@/lib/environment"
import { MockInvestmentAnalytics } from "./dashboard/mock-investment-analytics"

// Dynamically import the real component with SSR disabled
const RealInvestmentAnalytics = dynamic(
  () => import("./dashboard/investment-analytics").then((mod) => ({ default: mod.InvestmentAnalytics })),
  { ssr: false },
)

export function getInvestmentAnalyticsComponent() {
  // In preview environments, use the mock component
  if (shouldUseMockData()) {
    return MockInvestmentAnalytics
  }

  // In production, use the real component
  return RealInvestmentAnalytics
}
