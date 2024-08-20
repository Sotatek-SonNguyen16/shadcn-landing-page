import BaseRequest from '@/services/BaseRequest.ts'
import { Account, TonProofItemReplySuccess } from '@tonconnect/ui-react'

const CHAIN = {
    '-239': 'MAINNET',
    '-3': 'TESTNET'
}

export default class AuthRequest extends BaseRequest {
    async generatePayload(): Promise<{ payload: string }> {
        const url = `/auth/generate-payload`
        return this.post(url, {}) as unknown as { payload: string }
    }

    async login(
        proof: TonProofItemReplySuccess['proof'],
        account: Account
    ): Promise<{ accessToken: string }> {
        const url = `/auth/check-proof`

        const reqBody = {
            address: account.address,
            network: CHAIN[account.chain],
            public_key: account.publicKey as string,
            proof: {
                ...proof,
                state_init: account.walletStateInit as string
            }
        }
        return this.post(url, reqBody) as unknown as {
            accessToken: string
        }
    }
}
