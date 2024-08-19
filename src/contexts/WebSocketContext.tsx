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
    clearOrderBookEvent: () => void
}

const EventWebSocketContext = createContext<
    EventWebSocketContextProps | undefined
>(undefined)

const EventWebSocketProvider: React.FC<{ children: ReactNode }> = ({
    children
}) => {
    const [isConnected, setIsConnected] = useState(false)
    const connector = useMemo(() => new EventsWebSocket(config.app.wws, ''), [])
    const [lastAssetIds, setLastAssetIds] = useState<string[]>([])
    const [priceChangeEvent, setPriceChangeEvent] =
        useState<PriceChangeEvent | null>(null)
    const [orderBookEvent, setOrderBookEvent] = useState<OrderBookEvent | null>(
        null
    )

    function isOrderBookEvent(data: OrderBookEvent | PriceChangeEvent) {
        return data.event_type === EEventType.BOOK
    }

    const handleSubscribe = (assetsIds: string[]) => {
        connector.send('unsubscribe', { assetsIds: lastAssetIds })
        connector.send('subscribe', { assetsIds })
        setLastAssetIds(assetsIds)
    }

    const clearOrderBookEvent = () => {
        setOrderBookEvent(null)
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

        const intervalId = setInterval(() => {
            setOrderBookEvent((prevState) => {
                if (!prevState) return prevState

                return {
                    ...prevState,
                    asks: [
                        ...prevState.asks,
                        {
                            price:
                                prevState.asks[prevState.asks.length - 1]
                                    .price + 0.1,
                            size:
                                prevState.asks[prevState.asks.length - 1].size +
                                10
                        }
                    ]
                }
            })
        }, 2000)

        return () => {
            clearInterval(intervalId)
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
                subscribe: handleSubscribe,
                orderBookEvent,
                priceChangeEvent,
                clearOrderBookEvent
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
