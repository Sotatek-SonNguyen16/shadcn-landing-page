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
        <div className='w-full'>
            <div
                className={clsx(
                    'grid grid-cols-5',
                    'text-gray-500 uppercase text-[12px] font-semibold my-3'
                )}
            >
                <div className={clsx('px-4 col-span-2')}>
                    Trade {betOption === EBetOption.YES ? 'Yes' : 'No'}
                </div>
                <div className='text-center'>Price</div>
                <div className='text-center'>Shares</div>
                <div className='text-center'>Total</div>
            </div>
            <div
                className={`flex flex-col max-h-[450px] overflow-y-scroll scrollbar-hidden duration-200`}
            >
                {' '}
                {asks && asks?.length > 0 ? (
                    <EventTradeBar
                        variant='accent'
                        data={asks}
                        trades={tradeSell}
                    />
                ) : (
                    <div className='text-center p-2'>
                        <span className='text-gray-300'>No asks</span>
                    </div>
                )}
                <div
                    className={clsx(
                        'grid grid-cols-5',
                        'border-t-[1px] border-b-[1px] border-gray-200 py-2',
                        'hover:bg-gray-200 hover:dark:bg-gray-800'
                    )}
                >
                    <div
                        className={clsx(
                            'col-span-2 px-4',
                            'font-semibold text-gray-500'
                        )}
                    >
                        Last: {formatToCents(lastPrice)}
                    </div>
                    <div className='text-center font-semibold text-gray-500 text-nowrap'>
                        Spread: {formatToCents(spread)}
                    </div>
                    <div className='text-center font-semibold text-gray-600'></div>
                    <div className='text-center font-semibold text-gray-600'></div>
                </div>
                {bids && bids?.length > 0 ? (
                    <EventTradeBar
                        variant='success'
                        data={bids}
                        trades={tradeBuy}
                    />
                ) : (
                    <div className='text-center p-2'>
                        <span className='text-gray-300'>No bids</span>
                    </div>
                )}
            </div>
        </div>
    )
}

export default EventOrderBook
