import { ESide } from '@/types/index.ts'

type OrderRequestBody = {
    marketId: string
    assetId: string
    side: ESide
    size: number
    price: number
}

type ActiveOrdersRequestBody = {
    assetId: string
    side: ESide
    page: number
    limit: number
}

export type { OrderRequestBody, ActiveOrdersRequestBody }
