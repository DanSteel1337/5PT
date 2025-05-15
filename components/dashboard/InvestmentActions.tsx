"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DepositForm } from "./DepositForm"
import { ClaimRewardsCard } from "./ClaimRewardsCard"

export default function InvestmentActions() {
  const [activeTab, setActiveTab] = useState("deposit")

  return (
    <div className="sticky top-4">
      <Tabs defaultValue="deposit" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="deposit">Deposit</TabsTrigger>
          <TabsTrigger value="claim">Claim Rewards</TabsTrigger>
        </TabsList>
        <TabsContent value="deposit">
          <DepositForm />
        </TabsContent>
        <TabsContent value="claim">
          <ClaimRewardsCard />
        </TabsContent>
      </Tabs>
    </div>
  )
}
