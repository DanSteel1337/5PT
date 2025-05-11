"use client"

import { Button } from "@/components/ui/button"
import { GradientBorder } from "@/components/ui/gradient-border"
import { Filter, CheckCircle } from "lucide-react"

interface PoolsFilterProps {
  filterActive: boolean
  setFilterActive: (value: boolean) => void
  filterEligible: boolean
  setFilterEligible: (value: boolean) => void
}

export function PoolsFilter({ filterActive, setFilterActive, filterEligible, setFilterEligible }: PoolsFilterProps) {
  return (
    <GradientBorder className="w-full" gradientFrom="from-gold-light" gradientTo="to-gold-dark">
      <div className="bg-black/80 p-4 rounded-xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center">
            <Filter className="w-5 h-5 text-gold mr-2" />
            <h3 className="text-lg font-medium">Filter Pools</h3>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              variant={filterActive ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterActive(!filterActive)}
              className={
                filterActive ? "bg-gold hover:bg-gold-dark text-black" : "border-gold/30 hover:bg-gold/10 text-gold"
              }
            >
              {filterActive && <CheckCircle className="w-4 h-4 mr-1" />}
              Active Pools
            </Button>

            <Button
              variant={filterEligible ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterEligible(!filterEligible)}
              className={
                filterEligible ? "bg-gold hover:bg-gold-dark text-black" : "border-gold/30 hover:bg-gold/10 text-gold"
              }
            >
              {filterEligible && <CheckCircle className="w-4 h-4 mr-1" />}
              Eligible Pools
            </Button>
          </div>
        </div>
      </div>
    </GradientBorder>
  )
}
