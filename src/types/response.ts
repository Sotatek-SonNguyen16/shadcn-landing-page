type DocsResponse<T> = {
    totalDocs: number
    totalPages: number
    limit: number
    page: number
    docs: T[]
}

type OrderResponse = {
    result: string
}

export type { DocsResponse, OrderResponse }
