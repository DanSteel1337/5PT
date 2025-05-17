/**
 * @file app/dashboard/analytics/loading.tsx
 * @description Loading component for the analytics page
 *
 * IMPORTANT ARCHITECTURE NOTE:
 * - This component does NOT include the DashboardHeader
 * - The header is included in the page component
 * - This component only shows a loading skeleton
 */

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="h-10 w-64 bg-gradient-to-r from-purple-900/10 via-transparent to-purple-900/10 animate-pulse rounded-xl" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-xl">
              <div className="h-full w-full bg-gradient-to-r from-purple-900/10 via-transparent to-purple-900/10 animate-pulse rounded-xl" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-96 bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-xl">
            <div className="h-full w-full bg-gradient-to-r from-purple-900/10 via-transparent to-purple-900/10 animate-pulse rounded-xl" />
          </div>

          <div className="h-96 bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-xl">
            <div className="h-full w-full bg-gradient-to-r from-purple-900/10 via-transparent to-purple-900/10 animate-pulse rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  )
}
