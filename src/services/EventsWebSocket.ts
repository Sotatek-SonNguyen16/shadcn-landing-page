import {BaseWebSocketImpl} from "@/services/BaseWebSocket.ts";
import {OrderBookEvent, PriceChangeEvent} from "@/types";

type EventsServerToClientEvents = {
    market: (data: PriceChangeEvent | OrderBookEvent) => void;
};

type EventsClientToServerEvents = {
    subscribe: (payload: { assetsIds: string[] }) => void;
};

export class EventsWebSocket extends BaseWebSocketImpl<
    EventsServerToClientEvents,
    EventsClientToServerEvents
> {
    constructor(endpoint: string, token: string) {
        super(endpoint, token);
    }
}