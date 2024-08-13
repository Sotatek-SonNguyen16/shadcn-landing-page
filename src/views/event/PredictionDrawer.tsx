import React, { useMemo, useState } from 'react'
import * as AvatarPrimitive from '@radix-ui/react-avatar'
import { clsx } from 'clsx'
import {
    ChevronDown,
    ChevronUp,
    CircleHelp,
    Clock4,
    Code,
    Gavel,
    Link2,
    Star,
    Trophy,
    X
} from 'lucide-react'
import { useEventContext } from '@/contexts/EventContext.tsx'
import EventOrderBook from '@/views/event/order/EventOrderBook.tsx'
import { DrawerClose } from '@/components/ui/drawer.tsx'
import { Button } from '@/components/ui/button.tsx'
import BetGroupButton from '@/views/BetGroupButton.tsx'
import DynamicHeightDiv from '@/components/DynamicHeightDiv.tsx'
import DrawerProvider from '@/contexts/DrawerContext.tsx'
import { Tab, UnderlineTabs } from '@/components/ui/tabs.tsx'
import { EBetOption } from '@/types'
import MarketDescription from '@/views/event/MarketDescription.tsx'
import { formatDate } from '@/lib/utils.ts'

const tabs: Tab<EBetOption>[] = [
    {
        title: 'Trade Yes',
        value: EBetOption.YES,
        content: <></>
    },
    {
        title: 'Trade No',
        value: EBetOption.NO,
        content: <></>
    }
]

const PredictionDrawer: React.FC = () => {
    const src =
        'https://polymarket.com/_next/image?url=https%3A%2F%2Fpolymarket-upload.s3.us-east-2.amazonaws.com%2Fwill-kamala-harris-win-the-2024-us-presidential-election-21483ac3-94a5-4efd-b89e-05cdca69753f.png&w=96&q=100'
    const { currentMarket, changeBetOption } = useEventContext()
    const [viewMore, setViewMore] = useState<boolean>(false)
    const [displayOrderBook, setDisplayOrderBook] = useState<boolean>(false)

    const onClickViewMore = () => {
        setViewMore((prevState) => !prevState)
    }

    const onClickOrderBook = () => {
        setDisplayOrderBook((prevState) => !prevState)
    }

    const handleInnerClick = (e: React.MouseEvent) => {
        e.stopPropagation()
    }

    const formatterUSD = useMemo(
        () =>
            new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }),
        []
    )

    return (
        <DrawerProvider>
            <div
                className={clsx('w-full h-full flex flex-col gap-2 px-4 py-2')}
            >
                <div className={`flex gap-3 items-start mb-2`}>
                    <AvatarPrimitive.Root className='relative h-[48px] w-[48px]'>
                        <AvatarPrimitive.Image
                            src={currentMarket?.image ?? src}
                            alt={currentMarket?.slug}
                            className={clsx(
                                'h-full w-full object-cover rounded-lg'
                            )}
                        />
                        <AvatarPrimitive.Fallback
                            className={clsx(
                                'flex h-full w-full items-center justify-center bg-white dark:bg-gray-800',
                                'rounded-lg'
                            )}
                            delayMs={600}
                        ></AvatarPrimitive.Fallback>
                    </AvatarPrimitive.Root>
                    <div className='flex-1 flex justify-between items-center'>
                        <div className='text-gray-500 text-lg flex items-center gap-2'>
                            <Button variant={`secondary`} size={`icon`}>
                                <Trophy className='size-5' />
                            </Button>
                            {formatterUSD.format(
                                Number(currentMarket?.volume ?? '60184473')
                            )}{' '}
                            Bet
                        </div>
                        <div className='flex items-center gap-2'>
                            <Star className='size-5' />
                            <Code className='size-5' />
                            <Link2 className='size-5' />
                            <DrawerClose>
                                <X className='size-5' />
                            </DrawerClose>
                        </div>
                    </div>
                </div>
                <div
                    className={`text-2xl font-semibold dark:text-gray-400 flex-1`}
                >
                    {currentMarket?.groupItemTitle || 'Michelle Obama'}
                </div>
                {/*<div className=''>*/}
                {/*    <EventGraph />*/}
                {/*</div>*/}
                <div
                    className={clsx(
                        'w-full border-[1px] border-gray-200 rounded-2xl overflow-hidden'
                    )}
                    onClick={onClickOrderBook}
                >
                    <div
                        className={clsx(
                            'flex justify-between items-center p-4'
                        )}
                    >
                        <span className='text-xl font-medium inline-flex items-center gap-2'>
                            Order Book <CircleHelp width={18} height={18} />
                        </span>{' '}
                        {displayOrderBook ? (
                            <ChevronUp height={18} width={18} />
                        ) : (
                            <ChevronDown height={18} width={18} />
                        )}
                    </div>
                    {displayOrderBook && (
                        <div className='mt-3' onClick={handleInnerClick}>
                            <UnderlineTabs<EBetOption>
                                tabs={tabs}
                                onClick={changeBetOption}
                            />
                            <EventOrderBook />
                        </div>
                    )}
                </div>
                <div>
                    <div className='text-xl font-semibold border-b-[1px] border-gray-100 mb-3'>
                        Rules
                    </div>
                    <MarketDescription
                        content={currentMarket?.description || ''}
                    />
                </div>
                {viewMore && (
                    <div className='flex flex-col gap-2 mb-3'>
                        <div className='flex justify-between items-center py-1'>
                            <div className='flex items-center gap-2'>
                                <svg
                                    color={`#1d4ed8`}
                                    xmlns='http://www.w3.org/2000/svg'
                                    width='20'
                                    height='20'
                                    viewBox='0 0 24 24'
                                    fill='none'
                                    stroke='currentColor'
                                    strokeWidth='2'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    className='lucide lucide-chart-no-axes-combined'
                                >
                                    <path d='M12 16v5' />
                                    <path d='M16 14v7' />
                                    <path d='M20 10v11' />
                                    <path d='m22 3-8.646 8.646a.5.5 0 0 1-.708 0L9.354 8.354a.5.5 0 0 0-.707 0L2 15' />
                                    <path d='M4 18v3' />
                                    <path d='M8 14v7' />
                                </svg>
                                <div className='font-semibold'>Amount Bet</div>
                            </div>
                            <div>
                                {formatterUSD.format(
                                    Number(currentMarket?.volume)
                                )}
                            </div>
                        </div>
                        <div className='flex justify-between items-center py-1'>
                            <div className='flex items-center gap-2'>
                                <Clock4
                                    color={`#1d4ed8`}
                                    width={20}
                                    height={20}
                                />
                                <div className='font-semibold'>End Date</div>
                            </div>
                            <div>
                                {formatDate(
                                    currentMarket?.endDate ||
                                        '2024-01-01T00:00:00'
                                )}
                            </div>
                        </div>
                        <div className='flex items-center gap-4 border-[1px] border-gray-200 rounded-xl py-2 px-4'>
                            <Button
                                variant={`secondary`}
                                className='rounded-full p-3'
                            >
                                <Gavel width={20} height={20} />
                            </Button>
                            <div>
                                <div className='text-[16px] text-gray-500'>
                                    Resolver
                                </div>
                                <div className='text-[16px] text-blue-700'>
                                    {`${currentMarket?.resolvedBy.substr(0, 12)}...` ||
                                        ''}
                                </div>
                            </div>
                        </div>
                        <div>
                            <Button
                                variant={`outline`}
                                size={`sm`}
                                className={clsx('rounded-2xl border-gray-500')}
                            >
                                Propose resolution
                            </Button>
                        </div>
                    </div>
                )}
                <div className={`flex`}>
                    <Button
                        variant={`secondary`}
                        size={`iconGroup`}
                        onClick={onClickViewMore}
                    >
                        {viewMore ? (
                            <span className={`flex items-center gap-1`}>
                                Show more <ChevronUp height={18} width={18} />
                            </span>
                        ) : (
                            <span className={`flex items-center gap-1`}>
                                Show more <ChevronDown height={18} width={18} />
                            </span>
                        )}
                    </Button>
                </div>
                <DynamicHeightDiv className='mt-3'>
                    <BetGroupButton />
                </DynamicHeightDiv>
            </div>
        </DrawerProvider>
    )
}

export default PredictionDrawer
