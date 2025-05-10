"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PoolsGrid } from "./pools-grid"

interface PoolsFilterProps {
  className?: string
}

export function PoolsFilter({ className }: PoolsFilterProps) {
  return (
    <Tabs defaultValue="all" className={`w-full ${className}`}>
      <TabsList className="bg-black/20 border border-gold/30 mb-6">
        <TabsTrigger value="all" className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold-light">
          All Pools
        </TabsTrigger>
        <TabsTrigger value="active" className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold-light">
          Active
        </TabsTrigger>
        <TabsTrigger value="eligible" className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold-light">
          Eligible
        </TabsTrigger>
      </TabsList>

      <TabsContent value="all">
        <PoolsGrid />
      </TabsContent>

      <TabsContent value="active">
        <PoolsGrid filterActive />
      </TabsContent>

      <TabsContent value="eligible">
        <PoolsGrid filterEligible />
      </TabsContent>
    </Tabs>
  )
}
