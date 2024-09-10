import React, { Fragment } from 'react'
import { clsx } from 'clsx'
import { useMarketsContext } from '@/contexts/MarketsContext.tsx'
import MarketCardGridItem from '@/views/market/MarketCardGridItem.tsx'
import MarketCardGridItemSkeleton from '@/components/skeleton/MarketCardGridItemSkeleton.tsx'
import { Filter, Search } from 'lucide-react'
import { Button } from '@/components/ui/button.tsx'
import InfiniteScroll from 'react-infinite-scroll-component'
import { LoadingSpinner } from '@/components/ui/spinner.tsx'
import MarketCardListItem from '@/views/v2/home/MarketCardListItem.tsx'
import MarketCategories from '@/views/v2/home/MarketCategories.tsx'
import { useDrawerContext } from '@/contexts/DrawerContext.tsx'
import MarketFilterDrawer from '@/views/market/MarketFilterDrawer.tsx'
import MarketSearchDrawer from '@/views/market/MarketSearchDrawer.tsx'
import MarketCardListItemSkeleton from '@/components/skeleton/MarketCardListItemSkeleton.tsx'

interface MarketListLayoutProps {
    layout: 'grid' | 'list'
    filter?: boolean
}

const MarketListLayout: React.FC<MarketListLayoutProps> = ({
    layout,
    filter = false
}) => {
    const { polyMarkets, hasMore, fetchMoreData } = useMarketsContext()
    const { openDrawer } = useDrawerContext()

    const onClickFilterButton = () => {
        openDrawer({
            background: 'bg-color-neutral-50',
            content: <MarketFilterDrawer />
        })
    }

    const onClickSearchInput = () => {
        openDrawer({
            background: 'bg-color-neutral-alpha-900',
            content: <MarketSearchDrawer />
        })
    }

    if (!polyMarkets) {
        return layout === 'grid' ? (
            <MarketCardGridItemSkeleton />
        ) : (
            <MarketCardListItemSkeleton />
        )
    }

    if (layout === 'grid')
        return (
            <div
                className={clsx(
                    'transition-opacity duration-300 animate-fadeIn',
                    'grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4'
                )}
            >
                {polyMarkets.map((market, index) => (
                    <Fragment key={`market-${index}`}>
                        <MarketCardGridItem data={market} />
                    </Fragment>
                ))}
            </div>
        )

    return (
        <Fragment>
            {filter && (
                <div className='flex flex-wrap items-center justify-between gap-2 mb-4 relative'>
                    <input
                        className='ps-10 flex-1 w-full bg-color-neutral-50 p-2.5 rounded-lg'
                        placeholder='Search market...'
                        onFocus={onClickSearchInput}
                    />
                    <Search size={20} className='absolute ms-3' />
                    <Button
                        variant={'transparent'}
                        className='size-11 bg-color-neutral-50 rounded-lg p-2.5'
                        onClick={onClickFilterButton}
                    >
                        <Filter size={20} />
                    </Button>
                </div>
            )}
            <InfiniteScroll
                dataLength={polyMarkets.length - 3}
                next={fetchMoreData}
                hasMore={hasMore}
                loader={
                    <div className='flex justify-center items-center bg-background/10 gap-1 m-3'>
                        <LoadingSpinner />
                        Loading more...
                    </div>
                }
            >
                <div
                    className={clsx(
                        'transition-opacity duration-300 animate-fadeIn',
                        'w-full flex flex-col gap-4'
                    )}
                >
                    {polyMarkets.slice(0, 3).map((market, index) => (
                        <Fragment key={`market-${index}`}>
                            <MarketCardListItem data={market} />
                        </Fragment>
                    ))}

                    <MarketCategories />

                    {polyMarkets.slice(3).map((market, index) => (
                        <Fragment key={`market-${index}`}>
                            <MarketCardListItem data={market} />
                        </Fragment>
                    ))}
                </div>
            </InfiniteScroll>
        </Fragment>
    )
}

export default MarketListLayout
