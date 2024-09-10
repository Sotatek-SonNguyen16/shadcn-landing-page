import React, { Fragment, useEffect, useRef, useState } from 'react'
import { ChevronDown, Filter, RefreshCcw } from 'lucide-react'
import { MarketDetail, TPosition } from '@/types'
import { Button } from '@/components/ui/button.tsx'
import useThrottle from '@/hooks/useThrottle.ts'
import DrawerProvider, { useDrawerContext } from '@/contexts/DrawerContext.tsx'
import CheckboxGroup from '@/components/CheckBoxGroup.tsx'
import { usePortfolioContext } from '@/contexts/PortfolioContext.tsx'
import { formatToCents } from '@/lib/utils.ts'
import RequestFactory from '@/services/RequestFactory'
import { useNavigate } from 'react-router-dom'

const FilterDrawerContent = () => {
    return (
        <div className='flex flex-col gap-4 px-4'>
            <div className='w-full h-10 grid grid-cols-7 items-center gap-1'>
                <div className='py-0.5' />
                <div className='grow shrink basis-0 flex-col justify-center items-center inline-flex col-start-3 col-span-3'>
                    <div className='self-stretch rounded-lg justify-center items-start gap-2 inline-flex'>
                        <div className='grow shrink basis-0 rounded-lg flex-col justify-center items-start inline-flex'>
                            <div className='self-stretch text-center text-color-neutral-900 text-base font-normal leading-normal'>
                                Filters
                            </div>
                        </div>
                    </div>
                </div>
                <div className='col-span-2 py-0.5 flex justify-end'>
                    <div className='w-fit justify-center items-center gap-2 inline-flex cursor-pointer'>
                        <div className='self-stretch text-center text-color-brand-500 text-sm font-normal leading-tight'>
                            Reset
                        </div>
                        <div>
                            <RefreshCcw
                                size={16}
                                className='text-color-brand-500'
                            />
                        </div>
                    </div>
                </div>
            </div>
            <CheckboxGroup
                name='Status'
                items={[
                    { name: 'All', value: 'all' },
                    { name: 'Live', value: 'live' },
                    { name: 'Resolved', value: 'resolved' }
                ]}
            />
        </div>
    )
}

const SortByDrawerContent = () => {
    return (
        <div className='flex flex-col gap-4 px-4'>
            <div className='w-full h-10 grid grid-cols-7 items-center gap-1'>
                <div className='py-0.5' />
                <div className='grow shrink basis-0 flex-col justify-center items-center inline-flex col-start-3 col-span-3'>
                    <div className='self-stretch rounded-lg justify-center items-start gap-2 inline-flex'>
                        <div className='grow shrink basis-0 rounded-lg flex-col justify-center items-start inline-flex'>
                            <div className='self-stretch text-center text-color-neutral-900 text-base font-normal leading-normal'>
                                Filters
                            </div>
                        </div>
                    </div>
                </div>
                <div className='col-span-2 py-0.5 flex justify-end' />
            </div>
            <CheckboxGroup
                name='Sort by'
                items={[
                    { name: 'Current value', value: 'Current value' },
                    {
                        name: 'Initial value',
                        value: 'Initial value'
                    },
                    { name: 'Return ($)', value: 'Return ($)' },
                    { name: 'Return (%)', value: 'Return (%)' },
                    { name: 'Shares', value: 'Shares' },
                    { name: 'Market', value: 'Market' },
                    { name: 'Expiration', value: 'Expiration' },
                    { name: 'To win', value: 'To win' }
                ]}
            />
        </div>
    )
}

const PositionFilter = () => {
    const { openDrawer } = useDrawerContext()

    const onClickSearchByButton = () => {
        openDrawer({
            background: 'bg-color-neutral-alpha-700',
            content: <SortByDrawerContent />
        })
    }

    const onClickFilterButton = () => {
        openDrawer({
            background: 'bg-color-neutral-alpha-700',
            content: <FilterDrawerContent />
        })
    }

    return (
        <div className='w-full rounded-lg justify-start items-center gap-4 inline-flex'>
            <div className='grow shrink basis-0 h-4 rounded-lg justify-start items-center gap-1 flex'>
                <div className='rounded-lg flex-col justify-center items-start inline-flex'>
                    <div className='self-stretch text-color-neutral-500 text-xs font-light leading-3'>
                        Sort by
                    </div>
                </div>
                <div
                    className='rounded-lg justify-start items-center gap-0.5 flex cursor-pointer'
                    onClick={onClickSearchByButton}
                >
                    <div className='rounded-lg flex-col justify-center items-start inline-flex'>
                        <div className='self-stretch text-color-neutral-900 text-xs font-light leading-none'>
                            Current value
                        </div>
                    </div>
                    <div className='rounded-lg justify-center items-center flex'>
                        <ChevronDown size={12} />
                    </div>
                </div>
            </div>
            <div className='rounded-lg justify-start items-center gap-2 flex'>
                <div
                    className='justify-center items-center gap-1 flex cursor-pointer'
                    onClick={onClickFilterButton}
                >
                    <div className='rounded-lg justify-center items-center gap-1 flex'>
                        <Filter size={16} />
                    </div>
                    <div className='h-4 rounded-lg flex-col justify-center items-start inline-flex'>
                        <div className='self-stretch text-center text-color-neutral-900 text-sm font-normal leading-tight'>
                            Filters
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const PositionListItem: React.FC<{
    position: TPosition
    marketDetail: MarketDetail
}> = ({ position, marketDetail }) => {
    const { icon, question, eventId } = marketDetail
    const navigate = useNavigate()

    const currentPrice =
        +marketDetail.outcomePrices[
            marketDetail.clobTokenIds.findIndex(
                (id) => id === position.positionId
            )
        ]

    const isYes =
        marketDetail.clobTokenIds.findIndex(
            (id) => id === position.positionId
        ) === 0

    const pl = ((currentPrice - position.avgPrice) * 100) / position.avgPrice

    const goToDetailEvent = (id: string) => {
        navigate(`/event/${id}`)
    }

    return (
        <div className='w-full rounded-xl bg-color-neutral-50 flex flex-col p-3 gap-3'>
            <div className='w-full rounded-lg justify-start items-center gap-3 inline-flex'>
                <div className='relative'>
                    <div className='size-12 rounded-[0.375rem] opacity-100'>
                        <img
                            src={icon}
                            alt={question}
                            className='absolute inset-0 h-full w-full object-cover text-transparent rounded-[0.375rem]'
                        />
                    </div>
                </div>
                <div className='grow shrink basis-0 flex-col justify-start items-start inline-flex'>
                    <div
                        className='self-stretch min-h-6 rounded-lg flex-col justify-center items-start flex cursor-pointer'
                        onClick={() => goToDetailEvent(eventId)}
                    >
                        <div className='w-[calc(100vw-132px)] text-color-neutral-900 text-sm font-normal leading-tight text-nowrap truncate'>
                            {question}
                        </div>
                    </div>
                    <div className='h-3 rounded-lg justify-start items-center gap-1 inline-flex'>
                        <div
                            className={`text-color-accent-${isYes ? 'green' : 'red'}-900 text-xs font-light leading-3`}
                        >
                            {isYes ? 'YES' : 'NO'} {formatToCents(currentPrice)}
                        </div>
                        <div className='text-color-neutral-250 text-xs font-light leading-3'>
                            •
                        </div>
                        <div className='text-color-neutral-800 text-xs font-light leading-3'>
                            {position.size} shares
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-full grid grid-cols-2'>
                <div className='h-14 rounded-lg flex-col justify-center items-start inline-flex'>
                    <div className='self-stretch h-3 rounded-lg flex-col justify-center items-start flex'>
                        <div className='self-stretch text-color-neutral-500 text-xs font-light leading-3'>
                            Current value
                        </div>
                    </div>
                    <div className='self-stretch h-10 rounded-lg flex-col justify-center items-start flex'>
                        <div
                            className={`self-stretch text-color-accent-${pl >= 0 ? 'green' : 'red'}-900 text-base font-semibold leading-normal`}
                        >
                            {pl.toFixed(2)}%
                        </div>
                        <div className='self-stretch text-color-neutral-700 text-xs font-light leading-none'>
                            ${(currentPrice * position.size).toFixed(2)}
                        </div>
                    </div>
                </div>
            </div>
            <div className='h-px border border-dashed border-color-neutral-100' />

            <div className='flex justify-between items-center'>
                <div className='flex flex-col'>
                    <div className='h-3 rounded-lg justify-start items-center gap-1 inline-flex'>
                        <div className='text-color-neutral-500 text-xs font-light leading-3'>
                            Bet:
                        </div>
                        <div className='text-color-neutral-800 text-xs font-light leading-3'>
                            ${(position.avgPrice * position.size).toFixed(2)}
                        </div>
                    </div>
                    <div className='h-3 rounded-lg justify-start items-center gap-1 inline-flex'>
                        <div className='text-color-neutral-500 text-xs font-light leading-3'>
                            To win:
                        </div>
                        <div className='text-color-neutral-800 text-xs font-light leading-3'>
                            ${position.size}
                        </div>
                    </div>
                </div>
                <Button
                    variant={'default'}
                    className='self-stretch text-center text-color-neutral-alpha-900 text-xs font-semibold leading-none'
                    disabled={true}
                >
                    Claim
                </Button>
            </div>
        </div>
    )
}

const ClaimAllButtonLayout = () => {
    const lastScrollTop = useRef<number>(0)
    const [offsetY, setOffsetY] = useState<number>(0)

    const handleScroll = useThrottle(() => {
        const currentScrollTop = window.scrollY

        if (currentScrollTop < lastScrollTop.current) {
            setOffsetY(0)
        } else {
            setOffsetY(-20)
        }

        lastScrollTop.current = currentScrollTop
    }, 100)

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: false })

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [handleScroll])

    return (
        <div
            className='fixed bottom-[10vh] left-1/2 transform -translate-x-1/2 transition-transform duration-300'
            style={{ transform: `translate(-50%, ${-offsetY}px)` }}
        >
            <Button size={'md'} variant={'brand'}>
                Claim All
            </Button>
        </div>
    )
}

const PortfolioPositionContent: React.FC = () => {
    const { fetchPositions, positions } = usePortfolioContext()
    const [positionMarkets, setPositionMarkets] = useState<
        (TPosition & { market?: MarketDetail })[]
    >([])

    useEffect(() => {
        fetchPositions({ page: 1, limit: 9 })
    }, [fetchPositions])

    useEffect(() => {
        const fetchData = async () => {
            const request = RequestFactory.getRequest('MarketRequest')
            const marketRes = await request.getMarketsByListId({
                id: positions?.map((positions) => positions.marketId) ?? []
            })
            const data =
                positions?.map((p) => ({
                    ...p,
                    market: marketRes?.docs.find((mk) => mk.id === p.marketId)
                })) ?? []

            setPositionMarkets(data)
        }

        fetchData()
    }, [positions])

    return (
        <div className='max-h-[70vh] flex flex-col gap-4 my-4 relative'>
            <DrawerProvider>
                <PositionFilter />
            </DrawerProvider>
            <div className='overflow-y-scroll scrollbar-hidden min-h-[50vh] flex flex-col gap-4'>
                {positionMarkets?.map((myAO) => (
                    <Fragment key={myAO.positionId}>
                        <PositionListItem
                            marketDetail={myAO.market as any}
                            position={myAO}
                        />
                    </Fragment>
                ))}
            </div>
            <ClaimAllButtonLayout />
        </div>
    )
}

export default PortfolioPositionContent
