import React, { Fragment, useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import MarketCardListItem from '@/views/v2/home/MarketCardListItem.tsx'
import { PredictionMarket } from '@/types'
import { useMarketsContext } from '@/contexts/MarketsContext.tsx'

const MarketSearchDrawer: React.FC = () => {
    const { polyMarkets } = useMarketsContext()
    const [filteredPolyMarkets, setFilteredPolyMarkets] = useState<
        PredictionMarket[]
    >([])
    const [searchTerm, setSearchTerm] = useState<string>('')
    useEffect(() => {
        if (searchTerm !== '') {
            // TODO: fetch the poly markets
            setFilteredPolyMarkets(
                polyMarkets?.filter((p) =>
                    p.title.toLowerCase().includes(searchTerm.toLowerCase())
                ) ?? []
            )
        } else {
            setFilteredPolyMarkets([])
        }
    }, [searchTerm])

    const onClickCancelButton = () => {
        setSearchTerm('')
    }

    return (
        <div className='p-4 bg-color-neutral-alpha-90 h-full'>
            <div className='flex flex-wrap items-center justify-between gap-2 mb-4 relative'>
                <input
                    className='ps-10 flex-1 w-full bg-color-neutral-50 p-2.5 rounded-lg'
                    placeholder='Search market...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search size={20} className='absolute ms-3' />
                <div className='h-4 pb-0.5 rounded-lg flex-col justify-center items-start inline-flex'>
                    <div
                        className='self-stretch text-center text-color-brand-500 text-sm font-normal leading-tight cursor-pointer'
                        onClick={onClickCancelButton}
                    >
                        Cancel
                    </div>
                </div>
            </div>
            <div className='w-full h-[calc(100vh-124px)] overflow-y-scroll scrollbar-hidden flex flex-col gap-2'>
                {filteredPolyMarkets.map((market, index) => (
                    <Fragment key={`market-${index}`}>
                        <MarketCardListItem data={market} />
                    </Fragment>
                ))}
            </div>
        </div>
    )
}

export default MarketSearchDrawer
