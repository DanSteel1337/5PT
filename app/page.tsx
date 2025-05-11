import { SimpleV0WalletConnect } from "@/components/simple-v0-wallet-connect"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <div className="w-full max-w-5xl">
        <h1 className="text-4xl font-bold text-center mb-8">5PT Dashboard</h1>
        <SimpleV0WalletConnect />
      </div>
    </main>
  )
}
