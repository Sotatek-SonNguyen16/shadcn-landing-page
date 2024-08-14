import { ESide } from '@/types/index.ts'

type OrderRequestBody = {
    userAddress: string
    assetId: string
    side: ESide
    size: number
    price: number
}

export type { OrderRequestBody }
