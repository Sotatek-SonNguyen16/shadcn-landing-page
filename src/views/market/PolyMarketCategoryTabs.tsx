import React, { Fragment } from 'react'
import { useMarketsContext } from '@/contexts/MarketsContext.tsx'
import PolyMarketCard from '@/views/market/PolyMarketCard.tsx'

const PolyMarketCategoryTabs: React.FC = () => {
    const { polyMarkets } = useMarketsContext()

    return (
        <div className='grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4'>
            {polyMarkets?.map((poly) => (
                <Fragment key={`poly-${poly.id}`}>
                    <PolyMarketCard poly={poly} />
                </Fragment>
            ))}
        </div>
    )
}

export default PolyMarketCategoryTabs
