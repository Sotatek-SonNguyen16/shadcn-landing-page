import BaseRequest from '@/services/BaseRequest.ts'
import { MarketDetail, PolyMarketDetail, PredictionMarket } from '@/types'
import { DocsResponse, OrderResponse } from '@/types/response.ts'
import { OrderRequestBody } from '@/types/request.ts'

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
        const url = `/order`
        return await this.post<OrderResponse>(url, payload)
    }
}
