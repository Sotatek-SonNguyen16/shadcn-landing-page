import BaseRequest from '@/services/BaseRequest.ts'
import { BalanceResponse, DocsResponse } from '@/types/response.ts'
import { PortfolioRequestParam } from '@/types/request.ts'
import { Portfolio } from '@/types'

export default class UserRequest extends BaseRequest {
    async getPortfolio(params: PortfolioRequestParam) {
        const url = `/users/portfolio`
        return await this.get<DocsResponse<Portfolio>>(url, params)
    }

    async getBalance() {
        const url = `/users/balance`
        return await this.get<BalanceResponse>(url)
    }
}
