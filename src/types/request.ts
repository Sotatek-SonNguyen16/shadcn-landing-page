import { ESide, OrderStatus } from '@/types/index.ts'

type OrderRequestBody = {
    marketId: string
    assetId: string
    side: ESide
    size: number
    price: number
}

type ActiveOrdersRequestParams = {
    marketId?: string
    assetId?: string
    side?: ESide
    page?: number
    limit?: number
}

type PositionRequestParams = {
    page?: number
    limit?: number
}

type DeleteOrdersRequestBody = {
    orderIds: string[]
}

export type OrdersRequestParam = {
    marketId?: string
    assetId?: string
    side?: ESide
    status?: OrderStatus
    page?: number
    limit?: number
}

export type {
    OrderRequestBody,
    ActiveOrdersRequestParams,
    DeleteOrdersRequestBody,
    PositionRequestParams
}
