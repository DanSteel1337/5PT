"use client"
import { Activity, BarChart3, Coins, CreditCard, DollarSign, LineChart, Wallet, Zap } from "lucide-react"
import { useAccount, useBalance } from "wagmi"
import { formatUnits } from "viem"

export function FuturisticDashboard() {
  const { address, isConnected } = useAccount()
  const { data: balanceData } = useBalance({
    address,
    watch: true,
  })

  return (
    <div className="p-4 md:p-6 lg:p-8 circuit-pattern">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2 gradient-text">5PT Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your futuristic crypto dashboard</p>
      </header>

      {/* Stats Overview */}
      <div className="dashboard-layout mb-8">
        <div className="crypto-card">
          <div className="crypto-card-header">
            <h2 className="crypto-card-title">Token Price</h2>
            <div className="crypto-card-icon">
              <DollarSign size={18} />
            </div>
          </div>
          <div className="crypto-stat">
            <div className="crypto-stat-value text-primary glow-text">$0.0458</div>
            <div className="crypto-stat-label">+5.2% (24h)</div>
          </div>
          <div className="crypto-card-footer">
            <span className="crypto-badge">Live</span>
          </div>
        </div>

        <div className="crypto-card crypto-card-secondary">
          <div className="crypto-card-header">
            <h2 className="crypto-card-title">Market Cap</h2>
            <div className="crypto-card-icon">
              <BarChart3 size={18} />
            </div>
          </div>
          <div className="crypto-stat">
            <div className="crypto-stat-value text-secondary glow-text-secondary">$4.58M</div>
            <div className="crypto-stat-label">Rank #842</div>
          </div>
          <div className="crypto-card-footer">
            <span className="crypto-badge crypto-badge-secondary">Analytics</span>
          </div>
        </div>

        <div className="crypto-card crypto-card-accent">
          <div className="crypto-card-header">
            <h2 className="crypto-card-title">Total Holders</h2>
            <div className="crypto-card-icon">
              <Wallet size={18} />
            </div>
          </div>
          <div className="crypto-stat">
            <div className="crypto-stat-value text-accent glow-text-accent">3,842</div>
            <div className="crypto-stat-label">+12 today</div>
          </div>
          <div className="crypto-card-footer">
            <span className="crypto-badge crypto-badge-accent">Growing</span>
          </div>
        </div>

        <div className="crypto-card">
          <div className="crypto-card-header">
            <h2 className="crypto-card-title">Your Balance</h2>
            <div className="crypto-card-icon">
              <Coins size={18} />
            </div>
          </div>
          <div className="crypto-stat">
            <div className="crypto-stat-value text-primary glow-text">
              {isConnected && balanceData
                ? `${Number.parseFloat(formatUnits(balanceData.value, balanceData.decimals)).toFixed(4)} ${balanceData.symbol}`
                : "0.0000 ETH"}
            </div>
            <div className="crypto-stat-label">
              {isConnected
                ? `≈ $${(Number.parseFloat(formatUnits(balanceData?.value || 0n, balanceData?.decimals || 18)) * 1800).toFixed(2)}`
                : "Connect wallet"}
            </div>
          </div>
          <div className="crypto-card-footer">
            <button className="crypto-button">Transfer</button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="crypto-card h-full">
            <div className="crypto-card-header">
              <h2 className="crypto-card-title">Price History</h2>
              <div className="crypto-card-icon">
                <LineChart size={18} />
              </div>
            </div>
            <div className="crypto-card-content h-64 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl gradient-text mb-2">Chart Placeholder</div>
                <p className="text-muted-foreground">Price history visualization will appear here</p>
              </div>
            </div>
            <div className="crypto-card-footer">
              <div className="flex gap-2">
                <button className="crypto-button-outline">1D</button>
                <button className="crypto-button-outline">1W</button>
                <button className="crypto-button-outline">1M</button>
                <button className="crypto-button-outline">1Y</button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="crypto-card h-full">
            <div className="crypto-card-header">
              <h2 className="crypto-card-title">Recent Transactions</h2>
              <div className="crypto-card-icon">
                <Activity size={18} />
              </div>
            </div>
            <div className="crypto-card-content">
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-border">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${i % 2 === 0 ? "bg-primary/10" : "bg-secondary/10"}`}
                      >
                        {i % 2 === 0 ? (
                          <Zap size={14} className="text-primary" />
                        ) : (
                          <CreditCard size={14} className="text-secondary" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{i % 2 === 0 ? "Buy" : "Sell"} 5PT</div>
                        <div className="text-xs text-muted-foreground">2 hours ago</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-medium ${i % 2 === 0 ? "text-primary" : "text-secondary"}`}>
                        {i % 2 === 0 ? "+" : "-"}1,250 5PT
                      </div>
                      <div className="text-xs text-muted-foreground">$57.25</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="crypto-card-footer">
              <button className="crypto-button w-full">View All Transactions</button>
            </div>
          </div>
        </div>
      </div>

      {/* Pools Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 gradient-text">Active Pools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`crypto-card ${i === 1 ? "" : i === 2 ? "crypto-card-secondary" : "crypto-card-accent"}`}
            >
              <div className="crypto-card-header">
                <h3 className="crypto-card-title">Pool #{i}</h3>
                <div className="crypto-badge">Active</div>
              </div>
              <div className="crypto-card-content">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>APY</span>
                    <span
                      className={`font-bold ${i === 1 ? "text-primary" : i === 2 ? "text-secondary" : "text-accent"}`}
                    >
                      {12 + i * 3}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Value Locked</span>
                    <span className="font-bold">${(150000 * i).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Your Stake</span>
                    <span className="font-bold">0 5PT</span>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs">Pool Capacity</span>
                      <span className="text-xs">{40 + i * 10}%</span>
                    </div>
                    <div className="crypto-progress">
                      <div className="crypto-progress-bar" style={{ width: `${40 + i * 10}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="crypto-card-footer">
                <button className={`crypto-button ${i === 1 ? "" : i === 2 ? "crypto-button-secondary" : ""}`}>
                  Stake Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Referral Section */}
      <div>
        <div className="crypto-card">
          <div className="crypto-card-header">
            <h2 className="crypto-card-title">Referral Program</h2>
            <div className="crypto-card-icon">
              <Zap size={18} />
            </div>
          </div>
          <div className="crypto-card-content">
            <p className="mb-4">Invite friends and earn 5% of their staking rewards!</p>
            <div className="p-3 bg-background/50 rounded-lg mb-4 font-mono text-sm overflow-x-auto">
              https://5pt.io/ref/0x1234...5678
            </div>
          </div>
          <div className="crypto-card-footer">
            <button className="crypto-button">Copy Link</button>
            <button className="crypto-button-outline ml-2">Share</button>
          </div>
        </div>
      </div>
    </div>
  )
}
