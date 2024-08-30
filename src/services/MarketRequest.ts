import BaseRequest from '@/services/BaseRequest.ts'
import {
    ActiveOrder,
    MarketDetail,
    PolyMarketDetail,
    PredictionMarket
} from '@/types'
import {
    DocsResponse,
    MarketTradesResponse,
    OrderResponse
} from '@/types/response.ts'
import {
    ActiveOrdersRequestBody,
    DeleteOrdersRequestBody,
    OrderRequestBody
} from '@/types/request.ts'

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

    async order(payload: OrderRequestBody) {
        const url = `/orders`
        return await this.post<OrderResponse>(url, payload)
    }

    async getActiveOrders(payload: ActiveOrdersRequestBody) {
        const url = `/orders/active-orders`
        return await this.get<DocsResponse<ActiveOrder>>(url, payload)
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
