import BaseRequest from '@/services/BaseRequest.ts'

export default class AuthRequest extends BaseRequest {
    async login(): Promise<void | null | undefined> {
        const url = `auth`
        return this.post(url, {})
    }
}
