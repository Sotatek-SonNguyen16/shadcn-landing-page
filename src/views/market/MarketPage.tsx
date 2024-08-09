import React from 'react'
import MarketProvider from '@/contexts/MarketsContext.tsx'
import MarketListLayout from '@/views/market/MarketListLayout.tsx'

const MarketPage: React.FC = () => {
    return (
        <MarketProvider>
            <div className='container px-4 md:px-8 w-full my-2 lg:my-3'>
                <div className='mb-3'>{/*<PolyMarketCategoryTabs />*/}</div>
                <MarketListLayout layout='grid' />
            </div>
        </MarketProvider>
    )
}

export default MarketPage
