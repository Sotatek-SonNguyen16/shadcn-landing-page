import React, {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useState
} from 'react'
import {
    ActiveOrder,
    EBetOption,
    EFormType,
    EMarketDepth,
    ESide,
    Market,
    MarketDetail,
    Order,
    OrderFormValues,
    PolyMarketDetail
} from '@/types'
import RequestFactory from '@/services/RequestFactory.ts'
import { ActiveOrdersRequestBody, OrderRequestBody } from '@/types/request.ts'
import { useEventWebSocket } from '@/contexts/WebSocketContext.tsx'
import { FieldErrors, Resolver } from 'react-hook-form'
import { setAddressToRequest } from '@/lib/authenticate.ts'
import { useAuthContext } from '@/contexts/AuthContext.tsx'

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
    handleOrder: (payload: OrderRequestBody) => void
    resolver: Resolver<OrderFormValues>
    activeOrders: ActiveOrder[] | null
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
        EMarketDepth.GRAPH
    )
    const [betOption, setBetOption] = useState<EBetOption>(EBetOption.YES)

    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
    const [activeOrders, setActiveOrders] = useState<ActiveOrder[] | null>(null)

    const { orderBookEvent, subscribe } = useEventWebSocket()
    const { userAddress } = useAuthContext()
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

    useEffect(() => {
        const fetchActiveOrder = async (payload: ActiveOrdersRequestBody) => {
            try {
                const response = await request.getActiveOrders(payload)
                if (response) {
                    setActiveOrders(response.docs)
                }
            } catch (err) {
                console.error(err)
            }
        }

        if (currentMarket) {
            setAddressToRequest(userAddress)
            fetchActiveOrder({
                assetId:
                    formStatus === ESide.BUY
                        ? (currentMarket?.clobTokenIds[0] ?? '')
                        : (currentMarket?.clobTokenIds[1] ?? ''),
                limit: 20,
                page: 1,
                side: formStatus
            })
        }
    }, [currentMarket, formStatus, request, userAddress])

    const subscribeToMarket = useCallback(() => {
        if (currentMarket?.clobTokenIds) {
            subscribe([
                betOption === EBetOption.YES
                    ? currentMarket.clobTokenIds[0]
                    : currentMarket.clobTokenIds[1]
            ])
        }
    }, [betOption, currentMarket?.clobTokenIds])

    useEffect(() => {
        subscribeToMarket()
    }, [subscribeToMarket])

    useEffect(() => {
        if (formStatus === ESide.BUY) {
            handleSelectOrder(
                orderBookEvent?.asks.length
                    ? orderBookEvent.asks[orderBookEvent.asks.length - 1]
                    : null
            )
        } else {
            handleSelectOrder(
                orderBookEvent?.bids.length
                    ? orderBookEvent.bids[orderBookEvent.bids.length - 1]
                    : null
            )
        }
    }, [formStatus, orderBookEvent])

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

    const handleOrder = async (payload: OrderRequestBody) => {
        try {
            setAddressToRequest(userAddress)
            const response = await request.order(payload)
            if (response) {
                console.log(response)
            }
        } catch (err) {
            console.log(err)
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
                activeOrders
            }}
        >
            {children}
        </EventContext.Provider>
    )
}

export { useEventContext }
export default EventProvider
