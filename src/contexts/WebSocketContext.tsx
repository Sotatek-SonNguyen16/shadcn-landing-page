import React, {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState
} from 'react'
import { EventsWebSocket } from '@/services/EventsWebSocket.ts'
import config from '@/configs'
import { useEventContext } from '@/contexts/EventContext.tsx'
import {
    EBetOption,
    EEventType,
    OrderBookEvent,
    PriceChangeEvent
} from '@/types'

interface EventWebSocketContextProps {
    isConnected: boolean
    priceChangeEvent: PriceChangeEvent | null
    orderBookEvent: OrderBookEvent | null
    clearOrderBookEvent: () => void
    resetOrderBook: () => void
}

const EventWebSocketContext = createContext<
    EventWebSocketContextProps | undefined
>(undefined)

const EventWebSocketProvider: React.FC<{ children: ReactNode }> = ({
    children
}) => {
    const { currentMarket, betOption, handleSelectOrder } = useEventContext()

    const [isConnected, setIsConnected] = useState(false)
    const connector = useMemo(() => new EventsWebSocket(config.app.wws, ''), [])
    const [lastAssetIds, setLastAssetIds] = useState<string[]>([])
    const [priceChangeEvent, setPriceChangeEvent] =
        useState<PriceChangeEvent | null>(null)
    const [orderBookEvent, setOrderBookEvent] = useState<OrderBookEvent | null>(
        null
    )
    const [firstLoading, setFirstLoading] = useState<boolean>(true)
    const [reset, setReset] = useState<boolean>(false)

    function isOrderBookEvent(data: OrderBookEvent | PriceChangeEvent) {
        return data.event_type === EEventType.BOOK
    }

    const handleSubscribe = (assetsIds: string[]) => {
        connector.send('unsubscribe', { assetsIds: lastAssetIds })
        connector.send('subscribe', { assetsIds })
        setLastAssetIds(assetsIds)
        setFirstLoading(true)
    }

    const clearOrderBookEvent = () => {
        setOrderBookEvent(null)
    }

    const subscribeToMarket = useCallback(() => {
        if (currentMarket?.clobTokenIds) {
            handleSubscribe([
                betOption === EBetOption.YES
                    ? (currentMarket.clobTokenIds[0] ?? '')
                    : (currentMarket.clobTokenIds[1] ?? '')
            ])
        }
    }, [betOption, currentMarket?.clobTokenIds])

    useEffect(() => {
        subscribeToMarket()
    }, [subscribeToMarket])

    const resetOrderBook = () => {
        setReset((prevState) => !prevState)
    }

    useEffect(() => {
        subscribeToMarket()
    }, [reset])

    useEffect(() => {
        if (!firstLoading) {
            return
        }
        if (betOption === EBetOption.YES) {
            handleSelectOrder(
                orderBookEvent?.asks.length
                    ? orderBookEvent.asks[orderBookEvent.asks.length - 1]
                    : null
            )
            if (orderBookEvent?.asks.length) {
                setFirstLoading((prevState) => !prevState)
            }
        } else {
            handleSelectOrder(
                orderBookEvent?.bids.length
                    ? orderBookEvent.bids[orderBookEvent.bids.length - 1]
                    : null
            )
            if (orderBookEvent?.bids.length) {
                setFirstLoading((prevState) => !prevState)
            }
        }
    }, [betOption, orderBookEvent])

    useEffect(() => {
        connector.connect()

        const handleConnect = () => setIsConnected(true)
        const handleDisconnect = () => setIsConnected(false)

        const handleMarketUpdate = (
            data: OrderBookEvent | PriceChangeEvent
        ) => {
            if (isOrderBookEvent(data)) {
                setOrderBookEvent(data as OrderBookEvent)
            } else {
                setPriceChangeEvent(data as PriceChangeEvent)
            }
        }

        connector.on('connect', handleConnect)
        connector.on('disconnect', handleDisconnect)
        connector.on('market', handleMarketUpdate)

        return () => {
            connector.off('connect', handleConnect)
            connector.off('disconnect', handleDisconnect)
            connector.off('market', handleMarketUpdate)
            connector.close()
        }
    }, [connector])

    return (
        <EventWebSocketContext.Provider
            value={{
                isConnected,
                orderBookEvent,
                priceChangeEvent,
                clearOrderBookEvent,
                resetOrderBook
            }}
        >
            {children}
        </EventWebSocketContext.Provider>
    )
}

const useEventWebSocket = (): EventWebSocketContextProps => {
    const context = useContext(EventWebSocketContext)
    if (!context) {
        throw new Error(
            'useEventWebSocket must be used within a EventWebSocketProvider'
        )
    }
    return context
}

export { EventWebSocketProvider, useEventWebSocket }
