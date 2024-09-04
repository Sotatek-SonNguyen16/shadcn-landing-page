import BaseRequest from '@/services/BaseRequest.ts'
import {
    ActiveOrder,
    EInterval,
    MarketDetail,
    MarketPriceHistory,
    PolyMarketDetail,
    PredictionMarket,
    TPosition
} from '@/types'
import {
    ActiveOrdersRequestParams,
    DeleteOrdersRequestBody,
    OrderRequestBody,
    OrdersRequestParam,
    PositionRequestParams
} from '@/types/request.ts'
import {
    DocsResponse,
    MarketTradesResponse,
    OrderResponse
} from '@/types/response.ts'

export default class MarketRequest extends BaseRequest {
    async getTopEvents(params: { page: number; limit: number }) {
        const url = `/polymarket/top-events`
        return await this.get<DocsResponse<PredictionMarket>>(url, params)
    }

    async getEventsById(id: string | number) {
        const url = `/polymarket/events/${id}`
        return await this.get<PolyMarketDetail>(url)
    }

    async getMarketById(id: string | number) {
        const url = `/polymarket/markets/${id}`
        return await this.get<MarketDetail>(url)
    }

    async getMarketPriceHistoryById(interval: EInterval, asset: string) {
        const url = `/polymarket/markets/prices-history?interval=${interval}&asset=${asset}`
        return await this.get<{ history: MarketPriceHistory[] }>(url)
    }

    async getMarketsByListId(params: { id: string[] }) {
        const url = `/polymarket/markets`
        return await this.get<DocsResponse<MarketDetail>>(url, params)
    }

    async order(payload: OrderRequestBody) {
        const url = `/orders`
        return await this.post<OrderResponse>(url, payload)
    }

    async getOrders(params: OrdersRequestParam) {
        const url = `/orders`
        return await this.get<OrderResponse>(url, params)
    }

    async getActiveOrders(params: ActiveOrdersRequestParams) {
        const url = `/orders/active-orders`
        return await this.get<DocsResponse<ActiveOrder>>(url, params)
    }

    async getPositions(params: PositionRequestParams) {
        const url = `/users/portfolio?status=LIVE`
        return await this.get<DocsResponse<TPosition>>(url, params)
    }

    async getActiveTrades(marketId: string) {
        const url = `/orders/market-${marketId}/my-active-trade`
        return await this.get<MarketTradesResponse>(url)
    }

    async deleteOrders(payload: DeleteOrdersRequestBody) {
        const url = `/orders`
        return await this.delete(url, payload)
    }

    async deleteOrderById(orderId: string) {
        const url = `/orders/${orderId}`
        return await this.delete(url)
    }
}
