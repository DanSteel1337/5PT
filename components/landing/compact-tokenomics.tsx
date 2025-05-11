export function CompactTokenomics() {
  // Tokenomics data
  const tokenomicsData = [
    { name: "Liquidity Pool", value: 30, color: "var(--chart-1)" },
    { name: "Treasury", value: 25, color: "var(--chart-2)" },
    { name: "Team", value: 15, color: "var(--chart-3)" },
    { name: "Marketing", value: 10, color: "var(--chart-4)" },
    { name: "Development", value: 10, color: "var(--chart-5)" },
    { name: "Community Rewards", value: 10, color: "var(--chart-6)" },
  ]

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold gradient-text mb-4">Tokenomics</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Understanding the 5PT token distribution and economics
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="crypto-card h-full">
            <div className="crypto-card-header">
              <h3 className="crypto-card-title">Token Distribution</h3>
            </div>
            <div className="crypto-card-content">
              <div className="flex justify-center py-8">
                <div className="relative w-64 h-64">
                  {/* Simple pie chart visualization */}
                  <div className="absolute inset-0 rounded-full border-8 border-secondary/30"></div>

                  {tokenomicsData.map((segment, index) => (
                    <div
                      key={segment.name}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2"
                      style={{
                        transform: `translate(-50%, -50%) rotate(${index * 60}deg) translateY(-70px)`,
                      }}
                    >
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: segment.color }}></div>
                      <div
                        className="text-xs font-medium"
                        style={{
                          transform: `rotate(${-index * 60}deg)`,
                          color: segment.color,
                        }}
                      >
                        {segment.value}%
                      </div>
                    </div>
                  ))}

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold gradient-text">5PT</div>
                      <div className="text-xs text-muted-foreground">Total Supply</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4">
                {tokenomicsData.map((segment) => (
                  <div key={segment.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: segment.color }}></div>
                    <div className="text-xs">
                      <span className="font-medium">{segment.name}</span>
                      <span className="text-muted-foreground ml-1">({segment.value}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="crypto-card h-full">
            <div className="crypto-card-header">
              <h3 className="crypto-card-title">Token Details</h3>
            </div>
            <div className="crypto-card-content">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Token Name</div>
                    <div className="text-xl font-bold gradient-text">Five Pillars Token</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Symbol</div>
                    <div className="text-xl font-bold gradient-text">5PT</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Total Supply</div>
                    <div className="text-xl font-bold">1,000,000,000</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Blockchain</div>
                    <div className="text-xl font-bold">BSC</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Token Type</div>
                    <div className="text-xl font-bold">BEP-20</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Decimals</div>
                    <div className="text-xl font-bold">18</div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Initial Price</div>
                  <div className="text-xl font-bold text-secondary glow-text-secondary">$0.005 USD</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
