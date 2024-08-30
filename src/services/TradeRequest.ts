import BaseRequest from '@/services/BaseRequest.ts'

export default class TradeRequest extends BaseRequest {
    async getTradesHistory(params: any) {
        const url = `/trades`
        return await this.get(url, params)
    }
}
