import { Suspense } from "react"
import ClientPage from "./client-page"

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black"></div>}>
      <ClientPage />
    </Suspense>
  )
}
