import { MarketTrade } from '@/types/index.ts'

type DocsResponse<T> = {
    totalDocs: number
    totalPages: number
    limit: number
    page: number
    docs: T[]
}

type OrderResponse = {
    result: string
}

type MarketTradesResponse = {
    tradeYes: MarketTrade[]
    tradeNo: MarketTrade[]
}

export type { DocsResponse, OrderResponse, MarketTradesResponse }
