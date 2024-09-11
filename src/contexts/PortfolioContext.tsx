import React, {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useState
} from 'react'
import RequestFactory from '@/services/RequestFactory.ts'
import { useAuthContext } from '@/contexts/AuthContext.tsx'
import {
    ActiveOrdersRequestParams,
    PositionRequestParams
} from '@/types/request.ts'
import { ActiveOrder, MarketDetail, MyActiveOrder, TPosition } from '@/types'
import { useToast } from '@/components/ui/use-toast.ts'

interface PortfolioContextType {
    activeOrders: ActiveOrder[] | null
    markets: MarketDetail[] | null
    myActiveOrders: MyActiveOrder[] | undefined
    fetchMoreData: () => void
    fetchPositions: (param: PositionRequestParams) => void
    totalItems: number
    totalPages: number
    hasMore: boolean
    handleCancelActiveOrder: (orderIds: string[]) => Promise<void>
    positions: TPosition[] | null
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(
    undefined
)

export const PortfolioProvider: React.FC<{ children: ReactNode }> = ({
    children
}) => {
    const { isLogin } = useAuthContext()
    const request = RequestFactory.getRequest('MarketRequest')

    const [page, setPage] = useState<number>(1)
    const [limit] = useState<number>(9)
    const [totalItems, setTotalItems] = useState<number>(-1)
    const [totalPages, setTotalPages] = useState<number>(
        Number.MAX_SAFE_INTEGER
    )
    const [activeOrders, setActiveOrders] = useState<ActiveOrder[] | null>(null)
    const [markets, setMarkets] = useState<MarketDetail[] | null>(null)
    const [myActiveOrders, setMyActiveMarkets] = useState<
        MyActiveOrder[] | undefined
    >(undefined)
    const [positions, setPositions] = useState<TPosition[] | null>([])

    const [hasMore, setHasMore] = useState<boolean>(false)
    const { toast } = useToast()

    const fetchMoreData = useCallback(() => {
        setTimeout(() => {
            setPage((prevState) => prevState + 1)
        }, 1000)
    }, [])

    const fetchMarkets = useCallback(async () => {
        const marketIds = activeOrders?.map((ao) => ao.marketId) ?? []
        const response = await request.getMarketsByListId({
            id: marketIds
        })
        if (response) {
            setMarkets(response.docs)
            setMyActiveMarkets(
                activeOrders?.map((ao) => {
                    return {
                        activeOrder: ao,
                        marketDetail: response.docs.find(
                            (md) => md.id === ao.marketId
                        )
                    }
                })
            )
        }
    }, [activeOrders, request])

    const fetchActiveOrders = useCallback(
        async (params: ActiveOrdersRequestParams) => {
            try {
                const response = await request.getActiveOrders(params)
                if (response) {
                    if (params.page === 1) {
                        setActiveOrders(response.docs)
                    } else {
                        setActiveOrders((prevState) => [
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
        [request, page]
    )

    const fetchPositions = useCallback(
        async (params: PositionRequestParams) => {
            try {
                const response = await request.getPositions(params)
                if (response) {
                    if (params.page === 1) {
                        setPositions(response.docs)
                    } else {
                        setPositions((prevState) => [
                            ...(prevState ?? []),
                            ...response.docs
                        ])
                    }
                    // setTotalItems(response.totalDocs)
                    // setTotalPages(response.totalPages)

                    // setHasMore(page < response.totalPages)
                }
            } catch (err) {
                console.error(err)
            }
        },
        [request]
    )

    useEffect(() => {
        if (isLogin) {
            const params: ActiveOrdersRequestParams = {
                page: page,
                limit: limit
            }

            fetchActiveOrders(params)
        }
    }, [page, limit, fetchActiveOrders, isLogin])

    useEffect(() => {
        if (activeOrders?.length) {
            fetchMarkets()
        }
    }, [activeOrders])

    const handleCancelActiveOrder = useCallback(
        async (orderIds: string[]) => {
            try {
                await request.deleteOrders({ orderIds: orderIds })
                toast({
                    variant: 'success',
                    title: 'Delete order success!'
                })
                // re-fetch when deleting order successfully
                const params: ActiveOrdersRequestParams = {
                    page: page,
                    limit: limit
                }

                if (isLogin) {
                    fetchActiveOrders(params)
                }
            } catch (err: any) {
                toast({
                    variant: 'destructive',
                    title: 'Delete order failure!',
                    description: JSON.parse(err.message)
                        .map((item: string | { message: string }) => {
                            if (typeof item === 'string') {
                                return item
                            } else if (
                                typeof item === 'object' &&
                                item !== null
                            ) {
                                const parsedMessage = JSON.parse(
                                    item['message']
                                )
                                return Object.values(parsedMessage).join(', ')
                            }
                            return ''
                        })
                        .join(', ')
                })
            }
        },
        [request, toast, page, limit, isLogin, fetchActiveOrders]
    )

    return (
        <PortfolioContext.Provider
            value={{
                activeOrders,
                markets,
                fetchMoreData,
                myActiveOrders,
                totalItems,
                totalPages,
                hasMore,
                handleCancelActiveOrder,
                positions,
                fetchPositions
            }}
        >
            {children}
        </PortfolioContext.Provider>
    )
}

export const usePortfolioContext = (): PortfolioContextType => {
    const context = useContext(PortfolioContext)

    if (!context) {
        throw new Error(
            'usePortfolioContext must be used within a PortfolioProvider'
        )
    }

    return context
}
