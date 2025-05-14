export function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-pulse">
      {/* Overview Cards */}
      <div className="glass-card rounded-xl h-40"></div>
      <div className="glass-card rounded-xl h-40"></div>
      <div className="glass-card rounded-xl h-40"></div>

      {/* Main Dashboard */}
      <div className="glass-card rounded-xl h-96 md:col-span-2"></div>

      {/* Sidebar */}
      <div className="glass-card rounded-xl h-96"></div>

      {/* Bottom Sections */}
      <div className="glass-card rounded-xl h-64 md:col-span-3"></div>
    </div>
  )
}
