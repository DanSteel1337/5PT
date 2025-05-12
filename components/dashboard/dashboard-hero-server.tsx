import { Badge } from "@/components/ui/badge"
import { Cpu } from "lucide-react"

interface DashboardHeroServerProps {
  title?: string
  description?: string
}

export function DashboardHeroServer({
  title = "Dashboard Overview",
  description = "Welcome to the next-gen Five Pillars Token investment platform",
}: DashboardHeroServerProps) {
  return (
    <div>
      <div className="flex items-center">
        <h2 className="text-3xl font-bold tracking-tight cyber-text">{title}</h2>
        <Badge variant="outline" className="ml-2 bg-primary/10 text-primary border-primary/30">
          <Cpu className="mr-1 h-3 w-3" /> AI-Enhanced
        </Badge>
      </div>
      <p className="text-muted-foreground mt-1">{description}</p>
    </div>
  )
}
