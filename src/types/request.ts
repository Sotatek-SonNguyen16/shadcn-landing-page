import {
    ESide,
    OrderStatus,
    SortByType,
    SortOrderType,
    TradeType
} from '@/types/index.ts'

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

type OrdersRequestParam = {
    marketId?: string
    assetId?: string
    side?: ESide
    status?: OrderStatus
    page?: number
    limit?: number
}

type TradesRequestParam = {
    fromTs?: number
    toTs?: number
    type?: TradeType
    sortBy?: SortByType
    sortOrder?: SortOrderType
    page?: number
    limit?: number
}

type PortfolioRequestParam = {
    status?: string
    page?: number
    limit?: number
    sortParams?: string
    order?: string
}

export type {
    OrderRequestBody,
    ActiveOrdersRequestParams,
    DeleteOrdersRequestBody,
    PositionRequestParams,
    OrdersRequestParam,
    TradesRequestParam,
    PortfolioRequestParam
}
