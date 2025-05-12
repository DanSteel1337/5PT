"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronUp, Bug, Settings, Globe, Server } from "lucide-react"
import {
  getEnvironmentName,
  shouldUseMockData,
  getSiteUrl,
  isDevelopment,
  isProduction,
  isPreviewEnvironment,
} from "@/lib/environment"

export function EnvironmentDebugPanel() {
  const [isExpanded, setIsExpanded] = useState(false)

  // Environment information
  const envName = getEnvironmentName()
  const useMockData = shouldUseMockData()
  const siteUrl = getSiteUrl()
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Not set"
  const siteDescription = process.env.NEXT_PUBLIC_SITE_DESCRIPTION || "Not set"
  const walletConnectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ? "Set" : "Not set"

  // Environment flags
  const isDev = isDevelopment()
  const isProd = isProduction()
  const isPreview = isPreviewEnvironment()

  // Only show in development or if explicitly enabled
  if (isProd && !useMockData) return null

  return (
    <Card className="fixed bottom-4 right-4 w-80 shadow-lg z-50 bg-background/95 backdrop-blur-sm border-primary/20">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm flex items-center">
            <Bug className="h-4 w-4 mr-2" />
            Environment Debug
          </CardTitle>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </Button>
        </div>
        <CardDescription>
          Current mode:{" "}
          <Badge variant={useMockData ? "destructive" : "default"}>{useMockData ? "Mock Data" : "Live Data"}</Badge>
        </CardDescription>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pb-2 pt-0">
          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-2 gap-1">
              <div className="flex items-center">
                <Settings className="h-3 w-3 mr-2 opacity-70" />
                Environment:
              </div>
              <Badge variant="outline" className="justify-self-end">
                {envName}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-1">
              <div className="flex items-center">
                <Globe className="h-3 w-3 mr-2 opacity-70" />
                Site URL:
              </div>
              <code className="text-xs bg-muted p-1 rounded justify-self-end overflow-hidden text-ellipsis">
                {siteUrl}
              </code>
            </div>

            <div className="grid grid-cols-2 gap-1">
              <div className="flex items-center">
                <Server className="h-3 w-3 mr-2 opacity-70" />
                WalletConnect:
              </div>
              <Badge variant={walletConnectId === "Set" ? "default" : "destructive"} className="justify-self-end">
                {walletConnectId}
              </Badge>
            </div>

            <div className="mt-2 pt-2 border-t border-border">
              <div className="grid grid-cols-3 gap-1">
                <Badge variant={isDev ? "default" : "outline"} className="justify-self-start">
                  {isDev ? "DEV" : ""}
                </Badge>
                <Badge variant={isPreview ? "default" : "outline"} className="justify-self-center">
                  {isPreview ? "PREVIEW" : ""}
                </Badge>
                <Badge variant={isProd ? "default" : "outline"} className="justify-self-end">
                  {isProd ? "PROD" : ""}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      )}

      <CardFooter className="pt-2 pb-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full text-xs h-7"
          onClick={() => {
            console.log({
              environment: envName,
              useMockData,
              siteUrl,
              siteName,
              siteDescription,
              walletConnectId,
              isDev,
              isProd,
              isPreview,
              envVars: {
                NEXT_PUBLIC_USE_MOCK_DATA: process.env.NEXT_PUBLIC_USE_MOCK_DATA,
                NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
                NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME,
                NEXT_PUBLIC_SITE_DESCRIPTION: process.env.NEXT_PUBLIC_SITE_DESCRIPTION,
                NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
                  ? "Set"
                  : "Not set",
              },
            })
          }}
        >
          Log Environment Details
        </Button>
      </CardFooter>
    </Card>
  )
}
