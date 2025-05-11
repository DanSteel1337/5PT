import { BarChart3, Lock, TrendingUp, Wallet, Shield, RefreshCw } from "lucide-react"

export function CompactFeatures() {
  return (
    <section id="features" className="py-16 px-4 grid-pattern">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold gradient-text mb-4">Why Invest in 5PT?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our platform offers unique advantages that make it the future of blockchain investment
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="crypto-card">
            <div className="crypto-card-header">
              <h3 className="crypto-card-title">High ROI</h3>
              <div className="crypto-card-icon">
                <TrendingUp size={18} />
              </div>
            </div>
            <p className="text-muted-foreground">
              Earn up to 15% APY with our transparent reward mechanisms and staking pools
            </p>
          </div>

          <div className="crypto-card crypto-card-secondary">
            <div className="crypto-card-header">
              <h3 className="crypto-card-title">Secure Platform</h3>
              <div className="crypto-card-icon">
                <Lock size={18} />
              </div>
            </div>
            <p className="text-muted-foreground">
              Built on blockchain technology with audited smart contracts for maximum security
            </p>
          </div>

          <div className="crypto-card crypto-card-accent">
            <div className="crypto-card-header">
              <h3 className="crypto-card-title">Easy Deposits</h3>
              <div className="crypto-card-icon">
                <Wallet size={18} />
              </div>
            </div>
            <p className="text-muted-foreground">
              Simple deposit process with minimal fees and maximum returns on your investment
            </p>
          </div>

          <div className="crypto-card crypto-card-accent">
            <div className="crypto-card-header">
              <h3 className="crypto-card-title">Real-time Analytics</h3>
              <div className="crypto-card-icon">
                <BarChart3 size={18} />
              </div>
            </div>
            <p className="text-muted-foreground">
              Track your investments and rewards with detailed analytics and reporting
            </p>
          </div>

          <div className="crypto-card">
            <div className="crypto-card-header">
              <h3 className="crypto-card-title">Treasury Backed</h3>
              <div className="crypto-card-icon">
                <Shield size={18} />
              </div>
            </div>
            <p className="text-muted-foreground">
              Investments backed by a secure treasury for long-term stability and growth
            </p>
          </div>

          <div className="crypto-card crypto-card-secondary">
            <div className="crypto-card-header">
              <h3 className="crypto-card-title">Referral System</h3>
              <div className="crypto-card-icon">
                <RefreshCw size={18} />
              </div>
            </div>
            <p className="text-muted-foreground">Earn additional rewards by referring new investors to the platform</p>
          </div>
        </div>
      </div>
    </section>
  )
}
