import React, { useMemo, useState } from 'react'
import { useEventContext } from '@/contexts/EventContext.tsx'
import { ArrowDown, RefreshCcw } from 'lucide-react'
import { clsx } from 'clsx'
import MarketEventList from '@/views/v2/detail/MarketEventList.tsx'

const EventListLayout: React.FC = () => {
    const { market, reloadEvent } = useEventContext()
    const [viewMore, setViewMore] = useState<boolean>(false)
    const onClickViewMore = () => {
        setViewMore((prevState) => !prevState)
    }

    const sortedMarkets = useMemo(
        () =>
            market?.markets.sort(
                (a, b) =>
                    Number(b.outcomePrices[0]) - Number(a.outcomePrices[0])
            ) || [],
        [market?.markets]
    )

    return (
        <div className='w-full pb-6 border-b border-color-neutral-50 flex-col justify-start items-start gap-4 inline-flex'>
            <div
                className={clsx(
                    'w-full justify-start items-center inline-flex',
                    'text-color-neutral-500 text-xs font-light leading-none'
                )}
            >
                <div className='grow shrink basis-0 rounded-lg flex-col justify-center items-start inline-flex'>
                    OUTCOME
                </div>
                <div className='rounded-lg justify-end items-center gap-2 flex'>
                    <div>%</div>
                    <div>Chance</div>
                    <RefreshCcw
                        size={16}
                        className='cursor-pointer'
                        onClick={reloadEvent}
                    />
                </div>
            </div>
            <MarketEventList events={sortedMarkets.slice(0, 3)} />
            <div className='w-full flex justify-center items-center'>
                <div
                    className='justify-center items-center gap-1 inline-flex'
                    onClick={onClickViewMore}
                >
                    <div className='self-stretch text-center text-color-neutral-900 text-sm font-normal leading-tight'>
                        View All
                    </div>
                    <ArrowDown
                        size={16}
                        className={clsx({ 'rotate-180': viewMore })}
                    />
                </div>
            </div>
            {viewMore && <MarketEventList events={sortedMarkets.slice(3)} />}
        </div>
    )
}

export default EventListLayout
