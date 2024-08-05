import BaseRequest from '@/services/BaseRequest.ts'
import { PolyMarket } from '@/types'

export default class MarketRequest extends BaseRequest {
    async getTopEvents() {
        const url = `/polymarket/top-events`
        return await this.get<PolyMarket[]>(url)
    }

    async getMarketById(id: string | number) {
        const url = `/polymarket/markets/${id}`
        return await this.get(url)
    }
}
