import React, {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useState
} from 'react'
import RequestFactory from '@/services/RequestFactory.ts'
import { PredictionMarket } from '@/types'

interface MarketContextReturnValue {
    polyMarkets: PredictionMarket[] | null
    totalItems: number
    totalPages: number
}

const MarketContext = createContext<MarketContextReturnValue | undefined>(
    undefined
)

const useMarketsContext = () => {
    const context = useContext(MarketContext)
    if (context === undefined) {
        throw new Error(
            'useMarketContext must be used within an MarketProvider'
        )
    }
    return context
}

const MarketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const request = RequestFactory.getRequest('MarketRequest')

    const [page] = useState<number>(1)
    const [limit] = useState<number>(9)
    const [totalItems, setTotalItems] = useState<number>(-1)
    const [totalPages, setTotalPages] = useState<number>(
        Number.MAX_SAFE_INTEGER
    )
    const [polyMarkets, setPolyMarkets] = useState<PredictionMarket[] | null>(
        null
    )

    const fetchMarkets = useCallback(
        async (params: { page: number; limit: number }) => {
            try {
                const response = await request.getTopEvents(params)
                if (response) {
                    setTotalItems(response.totalDocs)
                    setTotalPages(response.totalPages)
                    setPolyMarkets(response.docs)
                }
            } catch (err) {
                console.error(err)
            }
        },
        [request]
    )

    useEffect(() => {
        const params = {
            page: page,
            limit: limit
        }

        fetchMarkets(params)
    }, [page, limit, fetchMarkets])

    return (
        <MarketContext.Provider
            value={{
                polyMarkets,
                totalItems,
                totalPages
            }}
        >
            {children}
        </MarketContext.Provider>
    )
}

export { useMarketsContext }
export default MarketProvider
