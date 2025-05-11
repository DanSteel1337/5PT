"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { getTokenTransfers } from "@/lib/moralis"
import { CONTRACT_ADDRESSES } from "@/lib/contracts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDistanceToNow } from "date-fns"
import { useReadContract } from "wagmi"
import { TOKEN_ABI } from "@/lib/contracts"
import { formatUnits } from "viem"

export function TokenTransactions() {
  const { data: decimals } = useReadContract({
    address: CONTRACT_ADDRESSES.token,
    abi: TOKEN_ABI,
    functionName: "decimals",
  })

  const { data: transfers, isLoading } = useQuery({
    queryKey: ["tokenTransfers", CONTRACT_ADDRESSES.token],
    queryFn: () => getTokenTransfers(CONTRACT_ADDRESSES.token, 10),
    refetchInterval: 60000, // Refetch every minute
  })

  return (
    <Card className="col-span-4 md:col-span-2">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Latest 5PT token transfers</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Time</TableHead>
              <TableHead className="text-right">Tx Hash</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-[60px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[80px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[100px]" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-4 w-[80px] ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : transfers?.length ? (
              transfers.map((transfer) => (
                <TableRow key={transfer.transaction_hash}>
                  <TableCell>
                    <div className="flex items-center">
                      <div
                        className={`mr-2 h-2 w-2 rounded-full ${
                          transfer.from_address === "0x0000000000000000000000000000000000000000"
                            ? "bg-green-500"
                            : transfer.to_address === "0x0000000000000000000000000000000000000000"
                              ? "bg-red-500"
                              : "bg-blue-500"
                        }`}
                      />
                      {transfer.from_address === "0x0000000000000000000000000000000000000000"
                        ? "Mint"
                        : transfer.to_address === "0x0000000000000000000000000000000000000000"
                          ? "Burn"
                          : "Transfer"}
                    </div>
                  </TableCell>
                  <TableCell>
                    {decimals
                      ? Number(formatUnits(BigInt(transfer.value), decimals)).toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })
                      : transfer.value_decimal}
                  </TableCell>
                  <TableCell>{formatDistanceToNow(new Date(transfer.block_timestamp), { addSuffix: true })}</TableCell>
                  <TableCell className="font-mono text-xs text-right">
                    <a
                      href={`https://bscscan.com/tx/${transfer.transaction_hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {transfer.transaction_hash.substring(0, 6)}...{transfer.transaction_hash.substring(62)}
                    </a>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No transaction data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
