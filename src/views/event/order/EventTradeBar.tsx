import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { clsx } from 'clsx'
import { Badge } from '@/components/ui/badge.tsx'
import { EFormType, ESide, MarketTrade, Order } from '@/types'
import { useDrawerContext } from '@/contexts/DrawerContext.tsx'
import SaleDrawer from '@/views/event/SaleDrawer.tsx'
import useScreenSize from '@/hooks/useScreenSize.ts'
import { useEventContext } from '@/contexts/EventContext.tsx'
import ActiveOrderTooltip from '@/views/event/order/ActiveOrderTooltip.tsx'
import { formatToCents } from '@/lib/utils.ts'

interface EventTradeBarProps {
    variant: 'success' | 'accent'
    trades: MarketTrade[] | undefined
    data: Order[] | null
}

interface OrderWithTotal extends Order {
    total: number
}

const EventTradeBar: React.FC<EventTradeBarProps> = React.memo((props) => {
    const { variant, data, trades } = props
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
            changeType(EFormType.LIMIT)
            if (!isLargerThan('lg')) {
                openDrawer({
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

    return (
        <div
            ref={containerRef}
            className={clsx(
                'flex h-[200px] overflow-y-scroll scrollbar-hidden',
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
                            (Number(total) / maxTotal) * 100 * 3
                        )
                        const marketTrade =
                            trades?.find(
                                (ac) => Number(ac.price) === Number(price)
                            ) ?? null

                        return (
                            <div
                                key={`${price}-${index}`}
                                className={clsx('group grid grid-cols-5', {
                                    'hover:bg-green-100 hover:dark:bg-green-500/30':
                                        variant === 'success',
                                    'hover:bg-red-100 hover:dark:bg-red-500/30':
                                        variant === 'accent'
                                })}
                                onClick={() =>
                                    handleClickEventTradeBar({ size, price })
                                }
                            >
                                <div
                                    style={{
                                        width: `${width}%`,
                                        maxWidth: `100%`
                                    }}
                                    className={clsx(
                                        'col-span-2 ps-[2px]',
                                        `flex items-center`,
                                        {
                                            'duration-100 animate-fadeIn':
                                                index ===
                                                internalOrders.length - 1
                                        },
                                        {
                                            'bg-green-100 group-hover:bg-green-200 dark:bg-green-500/30 group-hover:dark:bg-green-500/30':
                                                variant === 'success',
                                            'bg-red-100 group-hover:bg-red-200 dark:bg-red-500/30 group-hover:dark:bg-red-500/30':
                                                variant === 'accent'
                                        }
                                    )}
                                >
                                    {index === internalOrders.length - 1 && (
                                        <Badge variant={`${variant}Solid`}>
                                            {variant === 'accent'
                                                ? 'Asks'
                                                : 'Bids'}
                                        </Badge>
                                    )}
                                </div>
                                <div
                                    className={clsx(
                                        'flex justify-center gap-2 items-center',
                                        'text-center font-semibold py-2 text-[14px] lg:text-[16px]',
                                        {
                                            'text-green-500':
                                                variant === 'success',
                                            'text-orange-500':
                                                variant === 'accent'
                                        }
                                    )}
                                >
                                    <div className='h-auto'>
                                        <ActiveOrderTooltip
                                            marketTrade={marketTrade}
                                            variant={variant}
                                        />
                                    </div>
                                    {formatToCents(price)}
                                </div>
                                <div className='text-center font-semibold text-gray-600 dark:text-primary py-2 text-[12px] lg:text-[16px]'>
                                    {formatterDecimal.format(Number(size))}
                                </div>
                                <div className='text-center font-semibold text-gray-600 dark:text-primary py-2 text-[12px] lg:text-[16px]'>
                                    {formatterUSD.format(total)}
                                </div>
                            </div>
                        )
                    })}
        </div>
    )
})

export default EventTradeBar
