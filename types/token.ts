export interface PriceDataPoint {
  date: string
  price: number
  volume: number
}

export interface TokenMetadata {
  address: string
  name: string
  symbol: string
  decimals: string
  logo?: string
  logo_hash?: string
  thumbnail?: string
  block_number?: string
  validated?: boolean
}

export interface TokenPrice {
  nativePrice?: {
    value: string
    decimals: number
    name: string
    symbol: string
  }
  usdPrice: number
  exchangeAddress?: string
  exchangeName?: string
}

export interface TokenPriceHistory {
  tokenAddress: string
  timeframe: string
  priceChange: number
  data: PriceDataPoint[]
}
