// components/pools/PoolList.tsx
"use client"

import { useState, useEffect } from "react"
import { PoolCard } from "@/components/pools/PoolCard"
import { useInvestmentManager } from "@/hooks/useInvestmentManager"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Search, SlidersHorizontal } from "lucide-react"

export function PoolList() {
  const [mounted, setMounted] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("apy")
  const [showFilters, setShowFilters] = useState(false)
  const [activeOnly, setActiveOnly] = useState(true)

  const { useAvailablePools } = useInvestmentManager()
  const { data: pools, isLoading, isError } = useAvailablePools()

  // Only render after client-side hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (isError || !pools) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Error loading pools. Please try again later.</p>
      </div>
    )
  }

  // Filter and sort pools
  const filteredPools = pools
    .filter((pool) => {
      // Filter by search term
      const matchesSearch =
        pool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (pool.description && pool.description.toLowerCase().includes(searchTerm.toLowerCase()))

      // Filter by active status
      const matchesActive = activeOnly ? pool.isActive : true

      return matchesSearch && matchesActive
    })
    .sort((a, b) => {
      // Sort by selected criteria
      switch (sortBy) {
        case "apy":
          return Number(b.apy) - Number(a.apy)
        case "tvl":
          return Number(b.totalValueLocked) - Number(a.totalValueLocked)
        case "lockPeriod":
          return Number(a.lockPeriod) - Number(b.lockPeriod)
        default:
          return 0
      }
    })

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search pools..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? "border-primary text-primary" : ""}
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apy">Highest APY</SelectItem>
              <SelectItem value="tvl">Highest TVL</SelectItem>
              <SelectItem value="lockPeriod">Shortest Lock Period</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {showFilters && (
        <div className="p-4 glass rounded-lg border border-border/40">
          <div className="flex items-center gap-4">
            <Button
              variant={activeOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveOnly(true)}
              className={activeOnly ? "bg-primary" : ""}
            >
              Active Pools
            </Button>
            <Button
              variant={!activeOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveOnly(false)}
              className={!activeOnly ? "bg-primary" : ""}
            >
              All Pools
            </Button>
          </div>
        </div>
      )}

      {filteredPools.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No pools match your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPools.map((pool) => (
            <PoolCard key={pool.id.toString()} pool={pool} />
          ))}
        </div>
      )}
    </div>
  )
}
