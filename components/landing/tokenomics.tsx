import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Pie, PieChart, ResponsiveContainer, Cell } from "recharts"

const tokenomicsData = [
  { name: "Liquidity Pool", value: 30 },
  { name: "Treasury", value: 25 },
  { name: "Team", value: 15 },
  { name: "Marketing", value: 10 },
  { name: "Development", value: 10 },
  { name: "Community Rewards", value: 10 },
]

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-6))",
]

export function Tokenomics() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Tokenomics</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Understanding the 5PT token distribution and economics
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Token Distribution</CardTitle>
              <CardDescription>Allocation of 5PT tokens</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ChartContainer
                  config={{
                    tokenomics: {
                      label: "Tokenomics",
                    },
                    ...tokenomicsData.reduce(
                      (acc, item, index) => {
                        acc[item.name.toLowerCase().replace(" ", "_")] = {
                          label: item.name,
                          color: COLORS[index % COLORS.length],
                        }
                        return acc
                      },
                      {} as Record<string, { label: string; color: string }>,
                    ),
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={tokenomicsData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                      >
                        {tokenomicsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Token Details</CardTitle>
              <CardDescription>Key information about 5PT token</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Token Name</h3>
                    <p className="text-xl font-bold">Five Pillars Token</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Symbol</h3>
                    <p className="text-xl font-bold">5PT</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Total Supply</h3>
                    <p className="text-xl font-bold">1,000,000,000</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Blockchain</h3>
                    <p className="text-xl font-bold">BSC</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Token Type</h3>
                    <p className="text-xl font-bold">BEP-20</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Decimals</h3>
                    <p className="text-xl font-bold">18</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
