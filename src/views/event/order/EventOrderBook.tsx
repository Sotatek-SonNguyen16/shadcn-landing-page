import React from 'react'
import EventTradeBar from '@/views/event/order/EventTradeBar.tsx'
import { clsx } from 'clsx'

const EventOrderBook: React.FC = () => {
    return (
        <div className={``}>
            <EventTradeBar variant='accent' />
            <div
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
                    Last: 53#
                </div>
                <div className='text-center font-semibold text-gray-500'>
                    Spread: 1c
                </div>
                <div className='text-center font-semibold text-gray-600'></div>
                <div className='text-center font-semibold text-gray-600'></div>
            </div>
            <EventTradeBar variant='success' />
        </div>
    )
}

export default EventOrderBook
