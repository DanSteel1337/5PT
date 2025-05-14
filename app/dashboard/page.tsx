import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { ClientWrapper } from "./client-wrapper"

export default function DashboardPage() {
  return (
    <>
      <DashboardHeader title="Investment Dashboard" />
      <ClientWrapper />
    </>
  )
}
