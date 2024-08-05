import React, {useEffect} from 'react';
import EventTradeBar from "@/views/event/order/EventTradeBar.tsx";
import {clsx} from "clsx";
import {useEventWebSocket} from "@/contexts/WebSocketContext.tsx";
import {useEventContext} from "@/contexts/EventContext.tsx";
import {EBetOption} from "@/types";

const EventOrderBook: React.FC = () => {
    const {betOption} = useEventContext()
    const {orderBookEvent, subscribe} = useEventWebSocket()

    useEffect(() => {
        console.log('subscribe for event order')
        subscribe([
            // "21742633143463906290569050155826241533067272736897614950488156847949938836455",
            "48331043336612883890938759509493159234755048973500640148014422747788308965732"]
        )
    }, []);

    useEffect(() => {
        console.log(orderBookEvent)
    }, [orderBookEvent]);

    const formatterEuro = new Intl.NumberFormat('default', {
        style: 'currency',
        currency: 'EUR',
    });

    return (
        <div className="w-full">
            <div className={clsx(
                "grid grid-cols-5",
                "text-gray-500 uppercase text-[12px] font-semibold my-3",
            )}>
                <div className={clsx(
                    'col-span-2',
                )}>
                    Trade {betOption === EBetOption.YES ? "Yes" : "No"}
                </div>
                <div className="text-center">Price</div>
                <div className="text-center">Shares</div>
                <div className="text-center">Total</div>
            </div>
            <div className={`max-h-[300px] overflow-y-scroll`}>
                <EventTradeBar variant="accent" data={orderBookEvent?.asks} />
                <div className={clsx(
                    "grid grid-cols-5",
                    "border-t-[1px] border-b-[1px] border-gray-200 py-2",
                    "hover:bg-gray-200"
                )}>
                    <div className={clsx(
                        'col-span-2',
                        "font-semibold text-gray-500"
                    )}>
                        Last: {formatterEuro.format(orderBookEvent ? +orderBookEvent.asks[orderBookEvent.asks.length - 1].price : 0)}
                    </div>
                    <div className="text-center font-semibold text-gray-500">
                        Spread: {formatterEuro.format(orderBookEvent ? +orderBookEvent.asks[orderBookEvent.asks.length - 1].price - +orderBookEvent.bids[orderBookEvent.bids.length - 1].price : 0)}
                    </div>
                    <div className="text-center font-semibold text-gray-600">

                    </div>
                    <div className="text-center font-semibold text-gray-600">

                    </div>
                </div>
                <EventTradeBar variant="success" data={orderBookEvent?.bids} />
            </div>
        </div>
    );
};

export default EventOrderBook;