import React, { useMemo } from 'react'
import { clsx } from 'clsx'
import { Badge } from '@/components/ui/badge.tsx'
import { Order } from '@/types'

interface EventTradeBarProps {
    variant: 'success' | 'accent'
    data: Order[] | undefined
}

interface OrderWithTotal extends Order {
    total: number
}

const EventTradeBar: React.FC<EventTradeBarProps> = React.memo((props) => {
    const { variant, data } = props
    const formatterEuro = useMemo(
        () =>
            new Intl.NumberFormat('default', {
                style: 'currency',
                currency: 'EUR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 5
            }),
        []
    )

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

    return (
        <div
            className={clsx('flex', {
                'flex-col': variant === 'accent',
                'flex-col-reverse': variant === 'success'
            })}
        >
            {calculatedOrders &&
                calculatedOrders
                    // .filter((_, index) => index >= calculatedOrders.length - 10)
                    .map(({ size, price, total }, index) => {
                        const width = Math.round(
                            (Number(total) / maxTotal) * 100
                        )
                        return (
                            <div
                                key={`${price}-${index}`}
                                className={clsx('group grid grid-cols-5', {
                                    'hover:bg-green-100': variant === 'success',
                                    'hover:bg-red-100': variant === 'accent'
                                })}
                            >
                                <div
                                    style={{
                                        minWidth: '1px',
                                        width: `${width}%`
                                    }}
                                    className={clsx(
                                        'col-span-2',
                                        `flex items-center`,
                                        {
                                            'duration-300 animate-fadeIn':
                                                index ===
                                                calculatedOrders.length - 1
                                        },
                                        {
                                            'bg-green-100 group-hover:bg-green-200':
                                                variant === 'success',
                                            'bg-red-100 group-hover:bg-red-200':
                                                variant === 'accent'
                                        }
                                    )}
                                >
                                    {index === calculatedOrders.length - 1 && (
                                        <Badge variant={`${variant}Solid`}>
                                            {variant === 'accent'
                                                ? 'Asks'
                                                : 'Bids'}
                                        </Badge>
                                    )}
                                </div>
                                <div
                                    className={clsx(
                                        'text-center font-semibold py-2 text-[14px] lg:text-[16px]',
                                        {
                                            'text-green-500':
                                                variant === 'success',
                                            'text-orange-500':
                                                variant === 'accent'
                                        }
                                    )}
                                >
                                    {formatterEuro.format(Number(price) * 100)}
                                </div>
                                <div className='text-center font-semibold text-gray-600 py-2 text-[12px] lg:text-[16px]'>
                                    {formatterDecimal.format(Number(size))}
                                </div>
                                <div className='text-center font-semibold text-gray-600 py-2 text-[12px] lg:text-[16px]'>
                                    {formatterUSD.format(total)}
                                </div>
                            </div>
                        )
                    })}
        </div>
    )
})

export default EventTradeBar
