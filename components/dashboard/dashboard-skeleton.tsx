export function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-32 bg-purple-900/20 rounded-xl"></div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="h-48 bg-purple-900/20 rounded-xl"></div>
        <div className="h-48 bg-purple-900/20 rounded-xl"></div>
        <div className="h-48 bg-purple-900/20 rounded-xl"></div>
        <div className="h-48 bg-purple-900/20 rounded-xl"></div>
      </div>
      <div className="h-64 bg-purple-900/20 rounded-xl"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-80 bg-purple-900/20 rounded-xl"></div>
        <div className="h-80 bg-purple-900/20 rounded-xl"></div>
      </div>
      <div className="h-64 bg-purple-900/20 rounded-xl"></div>
      <div className="h-80 bg-purple-900/20 rounded-xl"></div>
    </div>
  )
}
