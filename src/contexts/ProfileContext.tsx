import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState
} from 'react'
import RequestFactory from '@/services/RequestFactory.ts'
import { ITrade, MarketDetail } from '@/types'
import { filterParams } from '@/lib/utils.ts'
import { useAuthContext } from '@/contexts/AuthContext.tsx'

interface ProfileContextType {
    tradesHistory: ITrade[]
    fetchMoreData: () => void
    totalPages: number
    limit: number
    page: number
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

export const ProfileProvider: React.FC<{ children: ReactNode }> = ({
    children
}) => {
    const { isLogin } = useAuthContext()
    const [tradesHistory, setTradesHistory] = useState<ITrade[]>([])
    const [params] = useState<any>({})
    const [page] = useState<number>(1)
    const [limit, setLimit] = useState<number>(10)
    const [totalPages, setTotalPages] = useState<number>(
        Number.MAX_SAFE_INTEGER
    )

    const requestTrade = RequestFactory.getRequest('TradeRequest')
    const requestMarkets = RequestFactory.getRequest('MarketRequest')

    const getTradesHistory = async () => {
        try {
            const dataTrade = (await requestTrade.getTradesHistory(
                filterParams({
                    page,
                    limit,
                    ...params
                })
            )) as any

            const marketIds =
                dataTrade?.docs?.map((trade: ITrade) => trade.marketId) ?? []

            const dataMarket = (await requestMarkets.getMarketsByListId({
                id: marketIds
            })) as any

            const data = dataTrade?.docs?.map((trade: ITrade) => {
                const market = dataMarket?.docs?.find(
                    (mk: MarketDetail) => mk.id === trade.marketId
                )
                return {
                    ...trade,
                    eventId: market?.eventId || '',
                    name: market?.question || '',
                    image: market?.image || '',
                    positionType:
                        market?.clobTokenIds.findIndex(
                            (mk: string) => mk === trade.assetId
                        ) === 0
                            ? 'YES'
                            : 'NO'
                }
            })

            setTradesHistory(data || [])
            setTotalPages(dataTrade?.totalPages)
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        if (isLogin) {
            getTradesHistory().then()
        }
    }, [isLogin, limit, params])

    const fetchMoreData = () => {
        setTimeout(() => {
            setLimit((prevState) => prevState + 10)
        }, 1000)
    }

    return (
        <ProfileContext.Provider
            value={{ tradesHistory, fetchMoreData, limit, page, totalPages }}
        >
            {children}
        </ProfileContext.Provider>
    )
}

export const useProfileContext = (): ProfileContextType => {
    const context = useContext(ProfileContext)

    if (!context) {
        throw new Error(
            'useProfileContext must be used within a ProfileProvider'
        )
    }

    return context
}
