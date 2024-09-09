import BaseRequest from '@/services/BaseRequest.ts'
import { UserProfile } from '@/types'

export default class UserRequest extends BaseRequest {
    async getUserProfile() {
        const url = `/users/profile`
        return await this.get<UserProfile>(url)
    }
}
