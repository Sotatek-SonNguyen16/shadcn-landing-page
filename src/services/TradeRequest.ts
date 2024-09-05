import BaseRequest from '@/services/BaseRequest.ts'
import { TradesRequestParam } from '@/types/request.ts'
import { DocsResponse } from '@/types/response.ts'
import { ITrade } from '@/types'

export default class TradeRequest extends BaseRequest {
    async getTradesHistory(params: TradesRequestParam) {
        const url = `/trades`
        return await this.get<DocsResponse<ITrade>>(url, params)
    }
}
