import React from 'react'
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

const EventTradeBar: React.FC<EventTradeBarProps> = (props) => {
    const { variant, data } = props
    const formatterEuro = new Intl.NumberFormat('default', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 5
    })

    const formatterUSD = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    })

    const findMaxPrice = (orders: Order[]): number => {
        return orders.reduce((max, order) => {
            const price = Number(order.price)
            return price > max ? price : max
        }, -Infinity)
    }

    const calculateTotals = (orders: Order[]): OrderWithTotal[] => {
        let previousTotal = 0

        return orders.map((order) => {
            const currentTotal =
                Number(order.price) * Number(order.size) + previousTotal
            previousTotal = currentTotal

            return {
                ...order,
                total: currentTotal
            }
        })
    }

    const maxPrice = findMaxPrice(data || [])

    return (
        <div
            className={clsx('flex', {
                'flex-col': variant === 'accent',
                'flex-col-reverse': variant === 'success'
            })}
        >
            {data &&
                data
                    .filter((_, index) => index >= data.length - 10)
                    .map(({ size, price }, index) => {
                        const width = Math.floor(
                            (Number(price) / maxPrice) * 100
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
                                    style={{ width: `${width}%` }}
                                    className={clsx(
                                        'col-span-2',
                                        `flex items-center ps-3`,
                                        {
                                            'bg-green-100 group-hover:bg-green-200':
                                                variant === 'success',
                                            'bg-red-100 group-hover:bg-red-200':
                                                variant === 'accent'
                                        }
                                    )}
                                >
                                    {index === data.length - 1 && (
                                        <Badge variant={`${variant}Solid`}>
                                            {variant === 'accent'
                                                ? 'Asks'
                                                : 'Bids'}
                                        </Badge>
                                    )}
                                </div>
                                <div
                                    className={clsx(
                                        'text-center font-semibold py-2',
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
                                <div className='text-center font-semibold text-gray-600 py-2'>
                                    {formatterUSD.format(Number(size))}
                                </div>
                                <div className='text-center font-semibold text-gray-600 py-2'>
                                    {formatterUSD.format(
                                        Number(price) * Number(size)
                                    )}
                                </div>
                            </div>
                        )
                    })}
        </div>
    )
}

export default EventTradeBar
