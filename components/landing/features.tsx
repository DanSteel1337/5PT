import { BarChart3, Lock, TrendingUp, Wallet, Shield, RefreshCw } from "lucide-react"

export function Features() {
  return (
    <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Key Features</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Discover why 5PT is the future of blockchain investment
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <TrendingUp className="h-12 w-12 text-primary" />
            <h3 className="text-xl font-bold">High ROI</h3>
            <p className="text-center text-muted-foreground">
              Competitive returns on your investment with transparent reward mechanisms
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <Lock className="h-12 w-12 text-primary" />
            <h3 className="text-xl font-bold">Secure Platform</h3>
            <p className="text-center text-muted-foreground">
              Built on blockchain technology with audited smart contracts
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <Wallet className="h-12 w-12 text-primary" />
            <h3 className="text-xl font-bold">Easy Deposits</h3>
            <p className="text-center text-muted-foreground">
              Simple deposit process with minimal fees and maximum returns
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <BarChart3 className="h-12 w-12 text-primary" />
            <h3 className="text-xl font-bold">Real-time Analytics</h3>
            <p className="text-center text-muted-foreground">
              Track your investments and rewards with detailed analytics
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <Shield className="h-12 w-12 text-primary" />
            <h3 className="text-xl font-bold">Treasury Backed</h3>
            <p className="text-center text-muted-foreground">
              Investments backed by a secure treasury for long-term stability
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <RefreshCw className="h-12 w-12 text-primary" />
            <h3 className="text-xl font-bold">Referral System</h3>
            <p className="text-center text-muted-foreground">
              Earn additional rewards by referring new investors to the platform
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
