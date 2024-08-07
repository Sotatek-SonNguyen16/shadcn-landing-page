import React from 'react'
import MarketProvider from '@/contexts/MarketsContext.tsx'
import PolyMarketCategoryTabs from '@/views/market/PolyMarketCategoryTabs.tsx'

const MarketPage: React.FC = () => {
    return (
        <MarketProvider>
            <div className='container px-4 md:px-8 w-full mt-3'>
                <div className='mb-3'>
                    <PolyMarketCategoryTabs />
                </div>
            </div>
        </MarketProvider>
    )
}

export default MarketPage
