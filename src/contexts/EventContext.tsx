import React, {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useState
} from 'react'
import {
    EBetOption,
    EFormType,
    EMarketDepth,
    ESide,
    Market,
    MarketDetail,
    MarketTrade,
    Order,
    OrderFormValues,
    PolyMarketDetail
} from '@/types'
import RequestFactory from '@/services/RequestFactory.ts'
import { FieldErrors, Resolver } from 'react-hook-form'
import { useAuthContext } from '@/contexts/AuthContext.tsx'
import { useToast } from '@/components/ui/use-toast.ts'

interface EventContextType {
    formStatus: ESide
    changeForm: (status: ESide) => void
    formType: EFormType
    changeType: (type: EFormType) => void
    marketDepth: EMarketDepth
    changeMarketDepth: (type: EMarketDepth) => void
    betOption: EBetOption
    changeBetOption: (option: EBetOption) => void
    selectedEvent: Market | null
    setSelectedEvent: (event: Market) => void
    market: PolyMarketDetail | null
    loading: boolean
    handleSelectMarket: (id: string) => void
    currentMarket: MarketDetail | null
    selectedMarketId: string
    selectedOrder: Order | null
    handleSelectOrder: (order: Order | null) => void
    handleOrder: (data: OrderFormValues) => Promise<void>
    resolver: Resolver<OrderFormValues>
    tradeYes: MarketTrade[] | null
    tradeNo: MarketTrade[] | null
    handleCancelMarketTrade: (orderIds: string[]) => Promise<void>
    reloadEvent: () => void
}

const EventContext = createContext<EventContextType | undefined>(undefined)

const useEventContext = () => {
    const context = useContext(EventContext)
    if (context === undefined) {
        throw new Error('useEventContext must be used within an EventProvider')
    }
    return context
}

const EventProvider: React.FC<{ children: ReactNode; id: string }> = ({
    children,
    id
}) => {
    const request = RequestFactory.getRequest('MarketRequest')
    const [market, setMarket] = useState<PolyMarketDetail | null>(null)
    const [loading, setLoading] = useState<boolean>(true)

    const [currentMarket, setCurrentMarket] = useState<MarketDetail | null>(
        null
    )
    const [selectedMarketId, setSelectedMarketId] = useState<string>('')
    const [selectedEvent, setSelectedEvent] = useState<Market | null>(null)
    const [formStatus, setFormStatus] = useState<ESide>(ESide.BUY)
    const [formType, setFormType] = useState<EFormType>(EFormType.LIMIT)
    const [marketDepth, setMarketDepth] = useState<EMarketDepth>(
        EMarketDepth.ORDER_BOOK
    )
    const [betOption, setBetOption] = useState<EBetOption>(EBetOption.YES)

    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
    const [tradeYes, setTradeYes] = useState<MarketTrade[] | null>(null)
    const [tradeNo, setTradeNo] = useState<MarketTrade[] | null>(null)

    const { userAddress, isLogin } = useAuthContext()
    const { toast } = useToast()

    const changeForm = (status: ESide) => {
        setFormStatus(status)
    }

    const changeType = (type: EFormType) => {
        setFormType(type)
    }

    const changeMarketDepth = (type: EMarketDepth) => {
        setMarketDepth(type)
    }

    const changeBetOption = (option: EBetOption) => {
        setBetOption(option)
    }

    const handleSelectMarket = (id: string) => {
        if (id === '') return
        setSelectedMarketId(id)
    }

    const handleSelectOrder = (order: Order | null) => {
        setSelectedOrder(order)
    }

    const reloadEvent = () => {
        const fetchPolyMarket = async (eId: string) => {
            setLoading(true)
            try {
                const response = await request.getEventsById(eId)
                if (response) {
                    setMarket(response)
                    const maxPriceItem = response.markets.reduce(
                        (max, item) => {
                            return Number(item.outcomePrices[0]) >
                                Number(max.outcomePrices[0])
                                ? item
                                : max
                        },
                        response.markets[0]
                    )
                    setSelectedMarketId(maxPriceItem.id)
                }
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        if (id) fetchPolyMarket(id)
    }

    useEffect(() => {
        const fetchPolyMarket = async (eId: string) => {
            setLoading(true)
            try {
                const response = await request.getEventsById(eId)
                if (response) {
                    setMarket(response)
                    const maxPriceItem = response.markets.reduce(
                        (max, item) => {
                            return Number(item.outcomePrices[0]) >
                                Number(max.outcomePrices[0])
                                ? item
                                : max
                        },
                        response.markets[0]
                    )
                    setSelectedMarketId(maxPriceItem.id)
                }
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        if (id) fetchPolyMarket(id)
    }, [id, request])

    useEffect(() => {
        const fetchMarket = async (mId: string) => {
            setCurrentMarket(null)
            try {
                const response = await request.getMarketById(mId)
                if (response) {
                    setCurrentMarket(response)
                }
            } catch (err) {
                console.error(err)
            }
        }

        if (selectedMarketId) fetchMarket(selectedMarketId)
    }, [request, selectedMarketId])

    const fetchActiveOrder = useCallback(
        async (marketId: string) => {
            try {
                const response = await request.getActiveTrades(marketId)
                if (response) {
                    setTradeYes(response.tradeYes)
                    setTradeNo(response.tradeNo)
                }
            } catch (err) {
                console.error(err)
            }
        },
        [request]
    )

    useEffect(() => {
        if (currentMarket) {
            if (isLogin) {
                fetchActiveOrder(currentMarket.id)
            } else {
                setTradeNo(null)
                setTradeYes(null)
            }
        }
    }, [currentMarket, fetchActiveOrder, userAddress, isLogin])

    const resolver: Resolver<OrderFormValues> = async (values) => {
        const errors: FieldErrors<OrderFormValues> = {}

        if (!values.amount || isNaN(values.amount) || values.amount <= 0) {
            errors.amount = {
                type: 'required',
                message: 'Amount is required and must be a positive number.'
            }
        }

        if (!values.size || isNaN(values.size) || values.size < 5) {
            errors.size = {
                type: 'required',
                message: 'Size is required and must be larger 5.'
            }
        }

        return {
            values: Object.keys(errors).length ? {} : values,
            errors
        }
    }

    const handleOrder = async (data: OrderFormValues) => {
        const payload = {
            marketId: currentMarket?.id ?? '',
            assetId:
                betOption === EBetOption.YES
                    ? (currentMarket?.clobTokenIds[0] ?? '')
                    : (currentMarket?.clobTokenIds[1] ?? ''),
            side: formStatus,
            price: Number(data.amount / 100),
            size: Number(data.size)
        }

        try {
            const response = await request.order(payload)
            if (response) {
                toast({
                    variant: 'success',
                    title: 'Successful purchase!'
                })
                if (currentMarket?.id) {
                    await fetchActiveOrder(currentMarket?.id)
                }
            }
        } catch (err: any) {
            toast({
                variant: 'destructive',
                title: 'Purchase failed!',
                description: JSON.parse(err.message)
                    .map((item: string | { message: string }) => {
                        if (typeof item === 'string') {
                            return item
                        } else if (typeof item === 'object' && item !== null) {
                            const parsedMessage = JSON.parse(item['message'])
                            return Object.values(parsedMessage).join(', ')
                        }
                        return ''
                    })
                    .join(', ')
            })
        }
    }

    const handleCancelMarketTrade = async (orderIds: string[]) => {
        try {
            await request.deleteOrders({ orderIds: orderIds })
            toast({
                variant: 'success',
                title: 'Delete order success!'
            })
            if (currentMarket?.id) {
                await fetchActiveOrder(currentMarket?.id)
            }
        } catch (err: any) {
            toast({
                variant: 'destructive',
                title: 'Delete order failure!',
                description: JSON.parse(err.message)
                    .map((item: string | { message: string }) => {
                        if (typeof item === 'string') {
                            return item
                        } else if (typeof item === 'object' && item !== null) {
                            const parsedMessage = JSON.parse(item['message'])
                            return Object.values(parsedMessage).join(', ')
                        }
                        return ''
                    })
                    .join(', ')
            })
        }
    }

    return (
        <EventContext.Provider
            value={{
                formStatus,
                changeForm,
                formType,
                changeType,
                betOption,
                changeBetOption,
                selectedEvent,
                setSelectedEvent,
                marketDepth,
                changeMarketDepth,
                market,
                loading,
                handleSelectMarket,
                currentMarket,
                selectedMarketId,
                selectedOrder,
                handleSelectOrder,
                handleOrder,
                resolver,
                tradeNo,
                tradeYes,
                handleCancelMarketTrade,
                reloadEvent
            }}
        >
            {children}
        </EventContext.Provider>
    )
}

export { useEventContext }
export default EventProvider
