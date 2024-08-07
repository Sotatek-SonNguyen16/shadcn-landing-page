import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useMemo,
    useState
} from 'react'
import { EventsWebSocket } from '@/services/EventsWebSocket.ts'
import config from '@/configs'
import { EEventType, OrderBookEvent, PriceChangeEvent } from '@/types'

interface EventWebSocketContextProps {
    isConnected: boolean
    subscribe: (assetsIds: string[]) => void
    priceChangeEvent: PriceChangeEvent | null
    orderBookEvent: OrderBookEvent | null
}

const EventWebSocketContext = createContext<
    EventWebSocketContextProps | undefined
>(undefined)

const EventWebSocketProvider: React.FC<{ children: ReactNode }> = ({
    children
}) => {
    const [isConnected, setIsConnected] = useState(false)
    const connector = useMemo(
        () => new EventsWebSocket(config.app.wws, ''),
        [config.app.wws]
    )

    const [priceChangeEvent, setPriceChangeEvent] =
        useState<PriceChangeEvent | null>(null)
    const [orderBookEvent, setOrderBookEvent] = useState<OrderBookEvent | null>(
        null
    )

    function isOrderBookEvent(data: OrderBookEvent | PriceChangeEvent) {
        return data.event_type === EEventType.BOOK
    }

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
                subscribe: (assetsIds: string[]) =>
                    connector.send('subscribe', { assetsIds }),
                orderBookEvent,
                priceChangeEvent
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
