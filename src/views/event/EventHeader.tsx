import React from 'react'
import * as AvatarPrimitive from '@radix-ui/react-avatar'
import { clsx } from 'clsx'
import {
    Link2Icon,
    LinkNone2Icon,
    RocketIcon,
    StarFilledIcon,
    StarIcon
} from '@radix-ui/react-icons'
import { useEventContext } from '@/contexts/EventContext.tsx'
import { formatCurrency, formatDate } from '@/lib/utils.ts'
import EventHeaderSkeleton from '@/components/skeleton/EventHeaderSkeleton.tsx'

type IconVariant = 'cup' | 'star' | 'starFilled' | 'linkNone' | 'link'

type IconState = {
    [key in IconVariant]: JSX.Element
}

const icons: IconState = {
    cup: <RocketIcon />,
    star: <StarIcon width={20} height={20} />,
    starFilled: <StarFilledIcon width={20} height={20} />,
    linkNone: <LinkNone2Icon width={20} height={20} />,
    link: <Link2Icon width={20} height={20} />
}

const EventHeader: React.FC = () => {
    const { market } = useEventContext()
    const formatterUSD = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    })

    if (!market) return <EventHeaderSkeleton />

    return (
        <div className='flex flex-col border-b-[1px] border-gray-200 dark:border-b-slate-700 pb-3'>
            <div className={`flex gap-4 items-start`}>
                <AvatarPrimitive.Root className='relative inline-flex h-[48px] w-[48px] lg:h-[72px] lg:w-[72px]'>
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
                <div className={`flex-1 flex flex-col`}>
                    <div className={`flex`}>
                        <div
                            className={`flex-1 flex text-wrap items-center gap-4`}
                        >
                            <div>{icons['cup']}</div>
                            <div className='hidden sm:block text-gray-400'>
                                {formatterUSD.format(+(market?.volume || 0))}{' '}
                                Bet
                            </div>
                            <div className='block sm:hidden text-gray-400'>
                                {formatCurrency(Number(market?.volume))} Bet
                            </div>
                            <div className='hidden sm:block text-gray-400'>
                                {formatDate(
                                    market?.endDate || '2024-01-01T00:00:00'
                                )}
                            </div>
                        </div>
                        <div className='flex gap-2 items-center'>
                            {icons['star']}
                            {icons['linkNone']}
                        </div>
                    </div>
                    <div className='flex-1 hidden lg:flex items-end mt-3'>
                        <div className='flex-1 text-2xl font-bold'>
                            {market?.title}
                        </div>
                        <div>Logo</div>
                    </div>
                </div>
            </div>
            <div
                className={`lg:hidden items-center flex-1 text-xl font-bold mt-3 px-2`}
            >
                {market?.title}
            </div>
        </div>
    )
}

export default EventHeader
