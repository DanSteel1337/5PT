"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { getTokenHolders } from "@/lib/moralis"
import { CONTRACT_ADDRESSES } from "@/lib/contracts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

export function TokenHolders() {
  const { data: holders, isLoading } = useQuery({
    queryKey: ["tokenHolders", CONTRACT_ADDRESSES.token],
    queryFn: () => getTokenHolders(CONTRACT_ADDRESSES.token, 10),
    refetchInterval: 300000, // Refetch every 5 minutes
  })

  return (
    <Card className="col-span-4 md:col-span-2">
      <CardHeader>
        <CardTitle>Top Token Holders</CardTitle>
        <CardDescription>Addresses with the largest 5PT balances</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Address</TableHead>
              <TableHead className="text-right">Balance</TableHead>
              <TableHead className="text-right">Percentage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-[180px]" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-4 w-[80px] ml-auto" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-4 w-[50px] ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : holders?.length ? (
              holders.map((holder) => (
                <TableRow key={holder.owner_address}>
                  <TableCell className="font-mono text-xs">
                    {holder.owner_address.substring(0, 6)}...{holder.owner_address.substring(38)}
                  </TableCell>
                  <TableCell className="text-right">
                    {Number(holder.balance_formatted).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </TableCell>
                  <TableCell className="text-right">
                    {Number(holder.percentage_relative_to_total_supply).toFixed(2)}%
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  No holder data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
