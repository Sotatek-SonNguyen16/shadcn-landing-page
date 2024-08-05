import React, { Fragment, Suspense } from 'react'
import { clsx } from 'clsx'
import { useMarketsContext } from '@/contexts/MarketsContext.tsx'
import MarketCardGridItem from '@/views/market/MarketCardGridItem.tsx'
import MarketCardGridItemSkeleton from '@/components/skeleton/MarketCardGridItemSkeleton.tsx'

interface MarketListLayoutProps {
    layout: 'grid' | 'list'
}

const MarketListLayout: React.FC<MarketListLayoutProps> = ({ layout }) => {
    const { polyMarkets } = useMarketsContext()

    if (layout === 'grid')
        return (
            <Suspense fallback={<MarketCardGridItemSkeleton />}>
                <div className={clsx('grid grid-cols-4 gap-4')}>
                    {polyMarkets?.map((polyMarket, index) => (
                        <Fragment key={`market-${index}`}>
                            <MarketCardGridItem data={polyMarket} />
                        </Fragment>
                    ))}
                </div>
            </Suspense>
        )

    return <div></div>
}

export default MarketListLayout
