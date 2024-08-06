import React, { Fragment } from 'react'
import { clsx } from 'clsx'
import { useMarketsContext } from '@/contexts/MarketsContext.tsx'
import MarketCardGridItem from '@/views/market/MarketCardGridItem.tsx'
import MarketCardGridItemSkeleton from '@/components/skeleton/MarketCardGridItemSkeleton.tsx'

interface MarketListLayoutProps {
    layout: 'grid' | 'list'
}

const MarketListLayout: React.FC<MarketListLayoutProps> = ({ layout }) => {
    const { polyMarkets } = useMarketsContext()

    if (!polyMarkets) {
        return <MarketCardGridItemSkeleton />
    }

    if (layout === 'grid')
        return (
            <div
                className={clsx(
                    'grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4'
                )}
            >
                {polyMarkets[0].markets.map((market, index) => (
                    <Fragment key={`market-${index}`}>
                        <MarketCardGridItem data={market} />
                    </Fragment>
                ))}
            </div>
        )

    return (
        <div
            className={clsx(
                'grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4'
            )}
        >
            {polyMarkets[0].markets.map((market, index) => (
                <Fragment key={`market-${index}`}>
                    <MarketCardGridItem data={market} />
                </Fragment>
            ))}
        </div>
    )
}

export default MarketListLayout
