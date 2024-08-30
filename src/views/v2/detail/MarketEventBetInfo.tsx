import React, { useMemo } from 'react'
import { Banknote, Calendar } from 'lucide-react'
import { formatDate } from '@/lib/utils.ts'
import { useEventContext } from '@/contexts/EventContext.tsx'

const MarketEventBetInfo: React.FC = () => {
    const { currentMarket } = useEventContext()

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
        <div className='bg-color-neutral-50 rounded-xl border border-color-neutral-50 flex-col justify-start items-start flex'>
            <div className='self-stretch px-3 py-4 border-b border-color-neutral-50 justify-start items-start gap-3 inline-flex'>
                <div className='grow shrink basis-0 h-5 rounded-lg justify-start items-center gap-2 flex'>
                    <div className='rounded-md justify-center items-center flex'>
                        <Banknote size={16} />
                    </div>
                    <div className='grow shrink basis-0 rounded-lg flex-col justify-center items-start inline-flex'>
                        <div className='self-stretch text-color-neutral-900 text-sm font-normal leading-tight'>
                            Amount Bet
                        </div>
                    </div>
                </div>
                <div className='grow shrink basis-0 rounded-lg flex-col justify-center items-start inline-flex'>
                    <div className='self-stretch text-right'>
                        <span className='text-color-neutral-500 text-sm font-light leading-tight'>
                            USDC{' '}
                        </span>
                        <span className='text-color-neutral-900 text-sm font-light leading-tight'>
                            {formatterUSD
                                .format(Number(currentMarket?.volume ?? 0))
                                .replace('$', '')}
                        </span>
                    </div>
                </div>
            </div>
            <div className='self-stretch px-3 py-4 border-b border-color-neutral-alpha-500 justify-start items-start gap-3 inline-flex'>
                <div className='grow shrink basis-0 h-5 rounded-lg justify-start items-center gap-2 flex'>
                    <div className='rounded-md justify-center items-center flex'>
                        <Calendar size={16} />
                    </div>
                    <div className='grow shrink basis-0 rounded-lg flex-col justify-center items-start inline-flex'>
                        <div className='self-stretch text-color-neutral-900 text-sm font-normal leading-tight'>
                            Expire Time
                        </div>
                    </div>
                </div>
                <div className='grow shrink basis-0 rounded-lg flex-col justify-center items-start inline-flex'>
                    <div className='self-stretch text-right text-color-neutral-900 text-sm font-light leading-tight'>
                        {currentMarket?.endDate
                            ? formatDate(currentMarket?.endDate)
                            : ''}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MarketEventBetInfo
