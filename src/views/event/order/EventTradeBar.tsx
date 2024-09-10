import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { clsx } from 'clsx'
import { EFormType, ESide, MarketTrade, Order } from '@/types'
import { useDrawerContext } from '@/contexts/DrawerContext.tsx'
import SaleDrawer from '@/views/event/SaleDrawer.tsx'
import useScreenSize from '@/hooks/useScreenSize.ts'
import { useEventContext } from '@/contexts/EventContext.tsx'
import { formatToCents } from '@/lib/utils.ts'

interface EventTradeBarProps {
    variant: 'success' | 'accent'
    trades: MarketTrade[] | undefined
    data: Order[] | undefined
}

interface OrderWithTotal extends Order {
    total: number
}

const EventTradeBar: React.FC<EventTradeBarProps> = React.memo((props) => {
    const { variant, data } = props
    const { handleSelectOrder, changeType, changeForm } = useEventContext()
    const { openDrawer } = useDrawerContext()
    const { isLargerThan } = useScreenSize()

    const formatterUSD = useMemo(
        () =>
            new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }),
        []
    )

    const formatterDecimal = useMemo(
        () =>
            new Intl.NumberFormat('en-US', {
                style: 'decimal',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }),
        []
    )

    const calculateTotals = (orders: Order[]): OrderWithTotal[] => {
        let previousTotal = 0
        const result: OrderWithTotal[] = []

        for (let i = orders.length - 1; i >= 0; i--) {
            const order = orders[i]
            const currentTotal =
                Number(order.price) * Number(order.size) + previousTotal
            previousTotal = currentTotal
            result[i] = {
                ...order,
                total: currentTotal
            }
        }

        return result
    }

    const calculatedOrders = useMemo(() => {
        if (data) return calculateTotals(data)
        return []
    }, [data])

    const maxTotal = useMemo(() => {
        return calculatedOrders.reduce(
            (max, order) => Math.max(max, order.total),
            -Infinity
        )
    }, [calculatedOrders])

    const handleClickEventTradeBar = useCallback(
        (order: Order) => {
            handleSelectOrder(order)
            changeForm(variant === 'accent' ? ESide.SELL : ESide.BUY)
            changeType(EFormType.MARKET)
            if (!isLargerThan('lg')) {
                openDrawer({
                    background: 'bg-color-neutral-alpha-800',
                    content: <SaleDrawer />
                })
            }
        },
        [
            variant,
            handleSelectOrder,
            changeForm,
            changeType,
            isLargerThan,
            openDrawer
        ]
    )
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (containerRef.current) {
            const container = containerRef.current

            setTimeout(() => {
                if (variant === 'accent') {
                    container.scrollTo({
                        top: container.scrollHeight,
                        behavior: 'instant'
                    })
                } else if (variant === 'success') {
                    container.scrollTo({
                        top: -99999,
                        behavior: 'instant'
                    })
                }
            }, 0)
        }
    }, [calculatedOrders, variant])

    if (!data || !Array.isArray(data) || data.length === 0)
        return (
            <div className='text-center p-2 border-[1px] border-color-neutral-50 rounded-xl'>
                <span className='text-color-neutral-250'>
                    No {variant === 'success' ? 'bids' : 'asks'}
                </span>
            </div>
        )

    return (
        <div
            ref={containerRef}
            className={clsx(
                'flex max-h-[200px] overflow-y-scroll scrollbar-hidden',
                'border-[1px] border-color-neutral-50 rounded-xl',
                {
                    'flex-col': variant === 'accent',
                    'flex-col-reverse': variant === 'success'
                }
            )}
        >
            {calculatedOrders &&
                calculatedOrders
                    // .filter((_, index, array) => index >= array.length - 10)
                    .map(({ size, price, total }, index, internalOrders) => {
                        const width = Math.round(
                            (Number(total) / maxTotal) * 100
                        )
                        // const marketTrade =
                        //     trades?.find(
                        //         (ac) => Number(ac.price) === Number(price)
                        //     ) ?? null

                        return (
                            <div
                                key={`${price}-${index}`}
                                className='group grid grid-cols-3 relative px-2 py-1 gap-2'
                                onClick={() =>
                                    handleClickEventTradeBar({ size, price })
                                }
                            >
                                <div
                                    style={{
                                        width: `${width}%`,
                                        height: '100%',
                                        maxWidth: `100%`
                                    }}
                                    className={clsx(
                                        'absolute top-0 left-0',
                                        {
                                            'duration-100 animate-fadeIn':
                                                index ===
                                                internalOrders.length - 1
                                        },
                                        {
                                            'bg-color-accent-green-200':
                                                variant === 'success',
                                            'bg-color-accent-red-200':
                                                variant === 'accent'
                                        }
                                    )}
                                />
                                <div
                                    className={clsx(
                                        'text-start font-semibold text-[14px] lg:text-[16px]',
                                        {
                                            'text-color-accent-green-900':
                                                variant === 'success',
                                            'text-color-accent-red-900':
                                                variant === 'accent'
                                        }
                                    )}
                                >
                                    {formatToCents(price)}
                                </div>
                                <div className='text-center font-semibold text-color-neutral-500 text-[12px] lg:text-[16px]'>
                                    {formatterDecimal.format(Number(size))}
                                </div>
                                <div className='text-end font-semibold text-color-neutral-500 text-[12px] lg:text-[16px]'>
                                    {formatterUSD.format(total)}
                                </div>
                            </div>
                        )
                    })}
        </div>
    )
})

export default EventTradeBar
