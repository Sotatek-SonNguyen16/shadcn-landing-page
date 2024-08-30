import React from 'react'
import * as AvatarPrimitive from '@radix-ui/react-avatar'
import { clsx } from 'clsx'
import { useEventContext } from '@/contexts/EventContext.tsx'
import EventHeaderSkeleton from '@/components/skeleton/EventHeaderSkeleton.tsx'
import { formatCurrency, formatDate } from '@/lib/utils.ts'

const MarketEventHeader: React.FC = () => {
    const { market } = useEventContext()

    if (!market) return <EventHeaderSkeleton />

    return (
        <div className='rounded-lg flex-col justify-start items-center gap-2 inline-flex w-full pb-6 border-b border-color-neutral-50'>
            <div className={`flex items-center justify-center`}>
                <AvatarPrimitive.Root className='relative inline-flex h-20 w-20 lg:h-22 lg:w-22'>
                    <AvatarPrimitive.Image
                        src={market?.icon}
                        alt='Avatar'
                        className={clsx(
                            'h-full w-full object-cover',
                            'rounded-full'
                        )}
                    />
                    <AvatarPrimitive.Fallback
                        className={clsx(
                            'flex h-full w-full items-center justify-center bg-white dark:bg-gray-800',
                            'rounded-full'
                        )}
                        delayMs={600}
                    >
                        <span className='text-sm font-medium uppercase text-gray-700 dark:text-gray-400'>
                            Icon
                        </span>
                    </AvatarPrimitive.Fallback>
                </AvatarPrimitive.Root>
            </div>
            <div className='rounded-lg flex-col justify-center items-center w-full'>
                <div className='self-stretch text-center text-Neutral-900 text-xl font-semibold leading-7'>
                    {market?.title}
                </div>
            </div>
            <div
                className={`rounded-lg justify-center items-center gap-1 inline-flex`}
            >
                <div className='font-small-slim-12 font-[number:var(--small-slim-12-font-weight)] text-color-neutral-500 text-[length:var(--small-slim-12-font-size)] tracking-[var(--small-slim-12-letter-spacing)] leading-[var(--small-slim-12-line-height)] whitespace-nowrap [font-style:var(--small-slim-12-font-style)]'>
                    Amount
                </div>
                <div className='font-small-slim-12 font-[number:var(--small-slim-12-font-weight)] text-color-neutral-800 text-[length:var(--small-slim-12-font-size)] tracking-[var(--small-slim-12-letter-spacing)] leading-[var(--small-slim-12-line-height)] whitespace-nowrap [font-style:var(--small-slim-12-font-style)]'>
                    {formatCurrency(Number(market?.volume))} Bet
                </div>
                <div className='font-small-slim-12 font-[number:var(--small-slim-12-font-weight)] text-color-neutral-500 text-[length:var(--small-slim-12-font-size)] tracking-[var(--small-slim-12-letter-spacing)] leading-[var(--small-slim-12-line-height)] whitespace-nowrap [font-style:var(--small-slim-12-font-style)]'>
                    •
                </div>
                <div className='font-small-slim-12 font-[number:var(--small-slim-12-font-weight)] text-color-neutral-500 text-[length:var(--small-slim-12-font-size)] tracking-[var(--small-slim-12-letter-spacing)] leading-[var(--small-slim-12-line-height)] whitespace-nowrap [font-style:var(--small-slim-12-font-style)]'>
                    End at
                </div>
                <div className='font-small-slim-12 font-[number:var(--small-slim-12-font-weight)] text-color-neutral-800 text-[length:var(--small-slim-12-font-size)] tracking-[var(--small-slim-12-letter-spacing)] leading-[var(--small-slim-12-line-height)] whitespace-nowrap [font-style:var(--small-slim-12-font-style)]'>
                    {formatDate(market?.endDate || '2024-01-01T00:00:00')}
                </div>
            </div>
        </div>
    )
}

export default MarketEventHeader
