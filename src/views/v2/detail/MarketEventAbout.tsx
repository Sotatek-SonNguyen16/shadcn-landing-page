import React from 'react'
import MarketEventRule from '@/views/v2/detail/MarketEventRule.tsx'
import MarketEventBetInfo from '@/views/v2/detail/MarketEventBetInfo.tsx'

const MarketEventAbout: React.FC = () => {
    return (
        <div className='w-full h-[calc(100vh-220px)] flex flex-col gap-4 py-4 overflow-y-scroll scrollbar-hidden'>
            <MarketEventBetInfo />
            <MarketEventRule />
        </div>
    )
}

export default MarketEventAbout
