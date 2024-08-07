import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import EventTradeBar from '@/views/event/order/EventTradeBar.tsx'
import { clsx } from 'clsx'
import { useEventWebSocket } from '@/contexts/WebSocketContext.tsx'
import { useEventContext } from '@/contexts/EventContext.tsx'
import { EBetOption } from '@/types'

const EventOrderBook: React.FC = () => {
    const { betOption, currentMarket } = useEventContext()
    const { orderBookEvent, subscribe } = useEventWebSocket()
    const containerRef = useRef<HTMLDivElement>(null)
    const centerRef = useRef<HTMLDivElement>(null)

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

    const lastPrice = orderBookEvent?.asks.length
        ? +orderBookEvent.asks[orderBookEvent.asks.length - 1].price
        : 0

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

            const elementOffsetTop = centerElement.offsetTop
            const scrollTop =
                elementOffsetTop - containerHeight / 2 + elementHeight / 2

            container.scrollTo({ top: scrollTop, behavior: 'instant' })
        }
    }, [orderBookEvent])

    return (
        <div className='w-full'>
            <div
                className={clsx(
                    'grid grid-cols-5',
                    'text-gray-500 uppercase text-[12px] font-semibold my-3'
                )}
            >
                <div className={clsx('col-span-2')}>
                    Trade {betOption === EBetOption.YES ? 'Yes' : 'No'}
                </div>
                <div className='text-center'>Price</div>
                <div className='text-center'>Shares</div>
                <div className='text-center'>Total</div>
            </div>
            <div
                ref={containerRef}
                className={`max-h-[300px] overflow-y-scroll scrollbar-hidden`}
            >
                <EventTradeBar variant='accent' data={orderBookEvent?.asks} />
                <div
                    ref={centerRef}
                    className={clsx(
                        'grid grid-cols-5',
                        'border-t-[1px] border-b-[1px] border-gray-200 py-2',
                        'hover:bg-gray-200'
                    )}
                >
                    <div
                        className={clsx(
                            'col-span-2',
                            'font-semibold text-gray-500'
                        )}
                    >
                        Last: {formatterEuro.format(lastPrice * 100)}
                    </div>
                    <div className='text-center font-semibold text-gray-500'>
                        Spread: {formatterEuro.format(spread * 100)}
                    </div>
                    <div className='text-center font-semibold text-gray-600'></div>
                    <div className='text-center font-semibold text-gray-600'></div>
                </div>
                <EventTradeBar variant='success' data={orderBookEvent?.bids} />
            </div>
        </div>
    )
}

export default EventOrderBook
