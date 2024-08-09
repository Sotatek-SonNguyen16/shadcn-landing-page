import {
    BaseWebSocketImpl,
    EventHandlerArgs
} from '@/services/BaseWebSocket.ts'
import { OrderBookEvent, PriceChangeEvent } from '@/types'

type EventsServerToClientEvents = {
    market: EventHandlerArgs<PriceChangeEvent | OrderBookEvent>
}

type EventsClientToServerEvents = {
    subscribe: EventHandlerArgs<{ assetsIds: string[] }>
}

export class EventsWebSocket extends BaseWebSocketImpl<
    EventsServerToClientEvents,
    EventsClientToServerEvents
> {
    constructor(endpoint: string, token: string) {
        super(endpoint, token)
    }
}
