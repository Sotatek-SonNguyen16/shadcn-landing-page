import React, { useEffect, useMemo, useRef } from 'react'
import EventTradeBar from '@/views/event/order/EventTradeBar.tsx'
import { clsx } from 'clsx'
import { useEventWebSocket } from '@/contexts/WebSocketContext.tsx'
import { useEventContext } from '@/contexts/EventContext.tsx'
import { EBetOption } from '@/types'
import EventOrderBookSkeleton from '@/components/skeleton/EventOrderBookSkeleton.tsx'

const EventOrderBook: React.FC = () => {
    const { betOption, currentMarket, selectedMarketId } = useEventContext()
    const { orderBookEvent } = useEventWebSocket()
    const containerRef = useRef<HTMLDivElement>(null)
    const centerRef = useRef<HTMLDivElement>(null)

    const formatterEuro = useMemo(
        () =>
            new Intl.NumberFormat('default', {
                style: 'currency',
                currency: 'EUR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            }),
        []
    )

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

    useEffect(() => {
        if (containerRef.current && centerRef.current) {
            const container = containerRef.current
            const centerElement = centerRef.current

            const containerHeight = container.clientHeight
            const elementHeight = centerElement.clientHeight
            const containerOffsetTop = container.offsetTop
            const elementOffsetTop = centerElement.offsetTop
            const scrollTop =
                elementOffsetTop -
                containerOffsetTop -
                containerHeight / 2 +
                elementHeight / 2

            container.scrollTo({
                top: scrollTop,
                behavior: 'instant'
            })
        }
    }, [orderBookEvent])

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
                ref={containerRef}
                className={`max-h-[300px] overflow-y-scroll scrollbar-hidden duration-200 animate-fadeIn`}
            >
                {asks && asks?.length > 0 ? (
                    <EventTradeBar variant='accent' data={asks} />
                ) : (
                    <div className='text-center p-2'>
                        <span className='text-gray-300'>No asks</span>
                    </div>
                )}
                <div
                    ref={centerRef}
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
                        Last: {formatterEuro.format(lastPrice * 100)}
                    </div>
                    <div className='text-center font-semibold text-gray-500 text-nowrap'>
                        Spread: {formatterEuro.format(spread * 100)}
                    </div>
                    <div className='text-center font-semibold text-gray-600'></div>
                    <div className='text-center font-semibold text-gray-600'></div>
                </div>
                {bids && bids?.length > 0 ? (
                    <EventTradeBar variant='success' data={bids} />
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
