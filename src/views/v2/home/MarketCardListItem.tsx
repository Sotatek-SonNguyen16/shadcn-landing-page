import React from 'react'
import { clsx } from 'clsx'
import { PredictionMarket } from '@/types'
import { formatCurrency } from '@/lib/utils.ts'
import { useNavigate } from 'react-router-dom'

const MarketCardListItem: React.FC<{ data: PredictionMarket }> = ({ data }) => {
    const { id, icon, title, volume } = data
    const navigate = useNavigate()

    return (
        <div
            className={clsx(
                'w-full min-h-20 rounded-lg justify-start items-center gap-3 inline-flex'
            )}
        >
            <div className='relative'>
                <div className='size-12 rounded-[0.375rem] opacity-100'>
                    <img
                        src={icon}
                        alt={title}
                        className='absolute inset-0 h-full w-full object-cover text-transparent rounded-[0.375rem]'
                    />
                </div>
            </div>
            <div className='grow shrink basis-0 py-4 border-b border-white/5 flex-col justify-start items-start gap-1 inline-flex'>
                <div className='self-stretch min-h-6 rounded-lg flex-col justify-center items-start flex '>
                    <div
                        onClick={() => navigate(`/event/${id}`)}
                        className='self-stretch text-color-neutral-900 text-sm font-normal leading-tight cursor-pointer hover:underline'
                    >
                        {title}
                    </div>
                </div>
                <div className='rounded-lg justify-start items-center gap-1 inline-flex'>
                    <div className='text-[#d8e881] text-sm font-normal leading-tight'>
                        {formatCurrency(Number(volume))} Bet
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MarketCardListItem
