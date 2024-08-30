import React, { useMemo } from 'react'
import { clsx } from 'clsx'
import { useEventWebSocket } from '@/contexts/WebSocketContext.tsx'
import { useEventContext } from '@/contexts/EventContext.tsx'
import { EBetOption, ESide } from '@/types'
import EventOrderBookSkeleton from '@/components/skeleton/EventOrderBookSkeleton.tsx'
import { formatToCents } from '@/lib/utils.ts'
import EventTradeBar from '@/views/event/order/EventTradeBar.tsx'

const EventOrderBook: React.FC = () => {
    const { betOption, currentMarket, selectedMarketId, tradeYes, tradeNo } =
        useEventContext()
    const { orderBookEvent } = useEventWebSocket()

    const lastPrice = useMemo(
        () =>
            orderBookEvent?.asks.length
                ? +orderBookEvent.asks[orderBookEvent.asks.length - 1].price
                : 0,
        [orderBookEvent?.asks]
    )

    const lastBid = useMemo(
        () =>
            orderBookEvent?.bids.length
                ? +orderBookEvent.bids[orderBookEvent.bids.length - 1].price
                : 0,
        [orderBookEvent?.bids]
    )

    const spread = useMemo(() => lastPrice - lastBid, [lastPrice, lastBid])

    const tradeBuy = useMemo(() => {
        if (betOption === EBetOption.YES) {
            return tradeYes?.filter((trade) => trade.side === ESide.BUY)
        }
        return tradeNo?.filter((trade) => trade.side === ESide.BUY)
    }, [betOption, tradeNo, tradeYes])

    const tradeSell = useMemo(() => {
        if (betOption === EBetOption.YES) {
            return tradeYes?.filter((trade) => trade.side === ESide.SELL)
        }
        return tradeNo?.filter((trade) => trade.side === ESide.SELL)
    }, [betOption, tradeNo, tradeYes])

    const asks = useMemo(() => orderBookEvent?.asks, [orderBookEvent?.asks])
    const bids = useMemo(() => orderBookEvent?.bids, [orderBookEvent?.bids])

    if (currentMarket?.id !== selectedMarketId)
        return <EventOrderBookSkeleton />

    return (
        <div className='w-full flex flex-col gap-2'>
            <div
                className={clsx(
                    'grid grid-cols-3',
                    'uppercase text-color-neutral-250 text-xs font-light leading-3'
                )}
            >
                <div className='text-start'>PRICE (¢)</div>
                <div className='text-center'>SHARES</div>
                <div className='text-end'>TOTAL ($)</div>
            </div>

            <EventTradeBar variant='accent' data={asks} trades={tradeSell} />

            <div className='flex gap-6 items-center'>
                <div className='text-color-neutral-700 text-sm font-light leading-tight'>
                    Last: {formatToCents(lastPrice)}
                </div>
                <div className='text-color-neutral-700 text-sm font-light leading-tight'>
                    Spread: {formatToCents(spread)}
                </div>
            </div>
            <EventTradeBar variant='success' data={bids} trades={tradeBuy} />
        </div>
    )
}

export default EventOrderBook
