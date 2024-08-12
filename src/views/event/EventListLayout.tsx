import React, { useMemo, useState } from 'react'
import { Tooltip } from '@/components/ui/tooltip.tsx'
import { UpdateIcon } from '@radix-ui/react-icons'
import OutcomeEventList from '@/views/event/OutcomeEventList.tsx'
import { useEventContext } from '@/contexts/EventContext.tsx'
import { ChevronDown, ChevronUp, Clock4, Gavel } from 'lucide-react'
import { Button } from '@/components/ui/button.tsx'
import MarketDescription from '@/views/event/MarketDescription.tsx'
import { formatDate } from '@/lib/utils.ts'

const EventListLayout: React.FC = () => {
    const { market } = useEventContext()
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

    const formatterUSD = useMemo(
        () =>
            new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }),
        []
    )

    return (
        <div className={`flex flex-col gap-3 pb-3`}>
            <div
                className={`grid grid-cols-4 lg:grid-cols-7 border-b-[1px] border-grey-200 dark:border-slate-700 p-1 items-center text-[10px] uppercase text-gray-500`}
            >
                <div className='col-span-3'>Outcome</div>
                <div
                    className={`inline-flex justify-center items-center gap-2`}
                >
                    <p className='text-nowrap'>% Chance</p>
                    <Tooltip
                        trigger={
                            <Button size={`icon`} variant={`outline`}>
                                <UpdateIcon width='10' height='10' />
                            </Button>
                        }
                        content={`Refresh`}
                    />
                </div>
            </div>
            <OutcomeEventList events={sortedMarkets.slice(0, 3)} />
            <div className={`flex`}>
                <Button
                    variant={`secondary`}
                    size={`sm`}
                    className={`flex items-center gap-1`}
                    onClick={onClickViewMore}
                >
                    View more{' '}
                    {viewMore ? (
                        <ChevronUp height={18} width={18} />
                    ) : (
                        <ChevronDown height={18} width={18} />
                    )}
                </Button>
            </div>
            {viewMore && <OutcomeEventList events={sortedMarkets.slice(3)} />}
            <div>
                <div className='text-xl font-semibold border-b-[1px] border-gray-100 dark:border-b-slate-700'>
                    Rules
                </div>
                <MarketDescription content={market?.description || ''} />
            </div>
            <div className='flex flex-col gap-2'>
                <div className='text-xl font-semibold border-b-[1px] border-gray-100 dark:border-b-slate-700'>
                    About
                </div>
                <div className='flex justify-between items-center py-1'>
                    <div className='flex items-center gap-2'>
                        <svg
                            color={`#1d4ed8`}
                            xmlns='http://www.w3.org/2000/svg'
                            width='20'
                            height='20'
                            viewBox='0 0 24 24'
                            fill='none'
                            stroke='currentColor'
                            strokeWidth='2'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            className='lucide lucide-chart-no-axes-combined'
                        >
                            <path d='M12 16v5' />
                            <path d='M16 14v7' />
                            <path d='M20 10v11' />
                            <path d='m22 3-8.646 8.646a.5.5 0 0 1-.708 0L9.354 8.354a.5.5 0 0 0-.707 0L2 15' />
                            <path d='M4 18v3' />
                            <path d='M8 14v7' />
                        </svg>
                        <div className='font-semibold'>Amount Bet</div>
                    </div>
                    <div>{formatterUSD.format(Number(market?.volume))}</div>
                </div>
                <div className='flex justify-between items-center py-1'>
                    <div className='flex items-center gap-2'>
                        <Clock4 color={`#1d4ed8`} width={20} height={20} />
                        <div className='font-semibold'>End Date</div>
                    </div>
                    <div>
                        {formatDate(market?.endDate || '2024-01-01T00:00:00')}
                    </div>
                </div>
                <div className='flex items-center gap-4 border-[1px] border-gray-200 dark:border-slate-700 rounded-xl py-2 px-4'>
                    <Button variant={`secondary`} className='rounded-full p-3'>
                        <Gavel
                            width={20}
                            height={20}
                            className='dark:text-white'
                        />
                    </Button>
                    <div>
                        <div className='text-[16px] text-gray-500'>
                            Resolver
                        </div>
                        <div className='text-[16px] text-blue-700'>
                            {`${market?.negRiskMarketID.substr(0, 12)}...` ||
                                ''}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EventListLayout
