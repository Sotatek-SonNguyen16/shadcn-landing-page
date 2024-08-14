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
    Order,
    PolyMarketDetail
} from '@/types'
import RequestFactory from '@/services/RequestFactory.ts'
import { OrderRequestBody } from '@/types/request.ts'
import { useEventWebSocket } from '@/contexts/WebSocketContext.tsx'

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
    const [formType, setFormType] = useState<EFormType>(EFormType.MARKET)
    const [marketDepth, setMarketDepth] = useState<EMarketDepth>(
        EMarketDepth.GRAPH
    )
    const [betOption, setBetOption] = useState<EBetOption>(EBetOption.YES)

    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
    const { orderBookEvent, subscribe } = useEventWebSocket()

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

    const handleOrder = async (payload: OrderRequestBody) => {
        try {
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
                handleOrder
            }}
        >
            {children}
        </EventContext.Provider>
    )
}

export { useEventContext }
export default EventProvider
