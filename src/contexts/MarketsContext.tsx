import React, {
    ChangeEvent,
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useState
} from 'react'
import RequestFactory from '@/services/RequestFactory.ts'
import { PredictionMarket } from '@/types'

type CategoryFilter = {
    id: number
    name: string
}

type FilterState = {
    search: string
    categories: CategoryFilter[]
    sortBy: 'top' | 'newest' | 'volume' | 'liquidity' | 'ending'
    status: 'all' | 'live' | 'resolved'
}

interface MarketContextReturnValue {
    polyMarkets: PredictionMarket[] | null
    totalItems: number
    totalPages: number
    hasMore: boolean
    fetchMoreData: () => void
    handleInputChange: (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => void
    handleSelectChange: (e: ChangeEvent<HTMLSelectElement>) => void
    handleCategoryChange: (categoryId: number) => void
    filters: FilterState
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

    const [page, setPage] = useState<number>(1)
    const [limit] = useState<number>(9)
    const [totalItems, setTotalItems] = useState<number>(-1)
    const [totalPages, setTotalPages] = useState<number>(
        Number.MAX_SAFE_INTEGER
    )
    const [polyMarkets, setPolyMarkets] = useState<PredictionMarket[] | null>(
        null
    )

    const [hasMore, setHasMore] = useState<boolean>(false)

    const [filters, setFilters] = useState<FilterState>({
        search: '',
        categories: [{ id: -1, name: 'all' }],
        sortBy: 'top',
        status: 'all'
    })

    const fetchMarkets = useCallback(
        async (params: { page: number; limit: number }) => {
            try {
                const response = await request.getTopEvents(params)
                if (response) {
                    if (params.page === 1) {
                        setPolyMarkets(response.docs)
                    } else {
                        setPolyMarkets((prevState) => [
                            ...(prevState ?? []),
                            ...response.docs
                        ])
                    }
                    setTotalItems(response.totalDocs)
                    setTotalPages(response.totalPages)

                    setHasMore(page < response.totalPages)
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

    const fetchMoreData = () => {
        setTimeout(() => {
            setPage((prev) => prev + 1)
        }, 1000)
    }

    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target

        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value // Directly set `search`, `sortBy`, or `status`
        }))
    }

    const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target

        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value // Works for `sortBy` and `status`
        }))
    }

    const handleCategoryChange = (categoryId: number) => {
        setFilters((prevState) => {
            const categoryExists = prevState.categories.some(
                (category) => category.id === categoryId
            )

            return {
                ...prevState,
                categories: categoryExists
                    ? prevState.categories.filter(
                          (category) => category.id !== categoryId
                      ) // Remove
                    : [...prevState.categories, { id: categoryId, name: '' }] // Add
            }
        })
    }

    return (
        <MarketContext.Provider
            value={{
                polyMarkets,
                totalItems,
                totalPages,
                hasMore,
                fetchMoreData,
                handleInputChange,
                handleSelectChange,
                handleCategoryChange,
                filters
            }}
        >
            {children}
        </MarketContext.Provider>
    )
}

export { useMarketsContext }
export default MarketProvider
