import BaseRequest from '@/services/BaseRequest.ts'
import { Portfolio, UserProfile } from '@/types'
import { PortfolioRequestParam } from '@/types/request.ts'
import { BalanceResponse, DocsResponse } from '@/types/response.ts'

export default class UserRequest extends BaseRequest {
    async getUserProfile() {
        const url = `/users/profile`
        return await this.get<UserProfile>(url)
    }

    async getPortfolio(params: PortfolioRequestParam) {
        const url = `/users/portfolio`
        return await this.get<DocsResponse<Portfolio>>(url, params)
    }

    async getBalance() {
        const url = `/users/balance`
        return await this.get<BalanceResponse>(url)
    }
}
