import { PoolsGrid } from "@/components/dashboard/pools-grid"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PoolsPage() {
  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight gold-text">Investment Pools</h2>
          <p className="text-muted-foreground">Choose the best investment option for your goals</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Pools</CardTitle>
          <CardDescription>Compare and select from our range of investment pools</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="grid" className="space-y-4">
            <TabsList className="grid w-full max-w-[400px] grid-cols-2">
              <TabsTrigger value="grid" className="data-[state=active]:bg-gold-500 data-[state=active]:text-black">
                Grid View
              </TabsTrigger>
              <TabsTrigger value="table" className="data-[state=active]:bg-gold-500 data-[state=active]:text-black">
                Table View
              </TabsTrigger>
            </TabsList>

            <TabsContent value="grid">
              <PoolsGrid />
            </TabsContent>

            <TabsContent value="table">
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="h-12 px-4 text-left align-middle font-medium">Pool</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Min. Deposit</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Reward Rate</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Lock Period</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Annual Yield</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                        <th className="h-12 px-4 text-right align-middle font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* This will be populated dynamically with the same data as the grid view */}
                      <tr className="border-b">
                        <td className="p-4 align-middle font-medium">Pool 1</td>
                        <td className="p-4 align-middle">1,000 5PT</td>
                        <td className="p-4 align-middle text-green-500">2.5%</td>
                        <td className="p-4 align-middle">30 days</td>
                        <td className="p-4 align-middle text-green-500">30.4%</td>
                        <td className="p-4 align-middle">
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                            Active
                          </span>
                        </td>
                        <td className="p-4 align-middle text-right">
                          <button className="inline-flex items-center justify-center rounded-md bg-gold-500 px-3 py-1.5 text-sm font-medium text-black hover:bg-gold-600">
                            Invest
                          </button>
                        </td>
                      </tr>
                      {/* More rows would be generated dynamically */}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
