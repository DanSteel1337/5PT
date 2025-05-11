"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAccount } from "wagmi"
import { useState, useMemo } from "react"
import { Copy, Check, Share2, Twitter, Facebook } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import QRCode from "qrcode.react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ShareCard() {
  const { address, isConnected } = useAccount()
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)

  // Format referral link
  const referralLink = useMemo(() => {
    if (!address) return "https://5pt.finance/ref/YOUR_ADDRESS"
    return `https://5pt.finance/ref/${address}`
  }, [address])

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    toast({
      title: "Copied!",
      description: "Referral link copied to clipboard",
    })

    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  const handleShare = (platform: string) => {
    let shareUrl = ""
    const text = "Join me on 5PT - The Five Pillars Token investment platform! Use my referral link to get started:"

    if (platform === "twitter") {
      shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(referralLink)}`
    } else if (platform === "facebook") {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}&quote=${encodeURIComponent(text)}`
    } else {
      shareUrl = `https://wa.me/?text=${encodeURIComponent(text + " " + referralLink)}`
    }

    window.open(shareUrl, "_blank")
  }

  return (
    <Card className="share-card overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <Share2 className="mr-2 h-5 w-5 text-gold-500" />
          Share & Earn
        </CardTitle>
        <CardDescription>Invite friends and earn 5% of their deposits</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="link" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="link" className="data-[state=active]:bg-gold-500 data-[state=active]:text-black">
              Referral Link
            </TabsTrigger>
            <TabsTrigger value="qr" className="data-[state=active]:bg-gold-500 data-[state=active]:text-black">
              QR Code
            </TabsTrigger>
          </TabsList>

          <TabsContent value="link" className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={referralLink}
                readOnly
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pr-10"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
                onClick={handleCopy}
              >
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                <span className="sr-only">Copy</span>
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 text-[#1DA1F2]"
                onClick={() => handleShare("twitter")}
              >
                <Twitter className="mr-2 h-4 w-4" />
                Twitter
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 bg-[#4267B2]/10 hover:bg-[#4267B2]/20 text-[#4267B2]"
                onClick={() => handleShare("facebook")}
              >
                <Facebook className="mr-2 h-4 w-4" />
                Facebook
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366]"
                onClick={() => handleShare("whatsapp")}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="qr" className="flex justify-center">
            <div className="bg-white p-4 rounded-lg">
              <QRCode
                value={referralLink}
                size={180}
                level="H"
                imageSettings={{
                  src: "/images/5pt-logo.png",
                  x: undefined,
                  y: undefined,
                  height: 40,
                  width: 40,
                  excavate: true,
                }}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4 text-sm text-muted-foreground">
          <p>Share your referral link and earn 5% of your friends' deposits instantly!</p>
        </div>
      </CardContent>
    </Card>
  )
}
