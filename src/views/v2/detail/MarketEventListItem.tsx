import React, { memo, useCallback, useMemo } from 'react'
import { EBetOption, ESide, Market } from '@/types'
import PredictionDrawer from '@/views/event/PredictionDrawer.tsx'
import { useDrawerContext } from '@/contexts/DrawerContext.tsx'
import { useEventContext } from '@/contexts/EventContext.tsx'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx'
import { Button } from '@/components/ui/button.tsx'
import { formatCurrency, formatToCents } from '@/lib/utils.ts'
import SaleDrawer from '@/views/event/SaleDrawer.tsx'
import { clsx } from 'clsx'
import { CircleCheckBold } from '@/components/icon.tsx'

const MarketEventListItem: React.FC<{ data: Market }> = memo(({ data }) => {
    const { openDrawer } = useDrawerContext()
    const {
        changeBetOption,
        betOption,
        handleSelectMarket,
        formStatus,
        selectedMarketId
    } = useEventContext()
    const {
        id,
        outcomePrices,
        outcomes,
        groupItemTitle,
        volume,
        icon,
        active
    } = data

    const handleBetOptionChange = useCallback(
        (option: EBetOption) => {
            changeBetOption(option)
        },
        [changeBetOption]
    )

    const chance = useMemo(
        () => Math.round(+outcomePrices[0] * 100),
        [outcomePrices]
    )

    const onClickBetButton = () => {
        openDrawer({
            background: 'bg-color-neutral-alpha-800',
            content: <SaleDrawer />
        })
    }

    return (
        <div
            className={clsx(
                'w-full grid grid-cols-5 lg:grid-cols-8 gap-3',
                'p-3 bg-color-neutral-50 rounded-xl border-b border-Neutral-50/5 backdrop-blur-lg'
            )}
            onClick={() => {
                handleSelectMarket(id)
                openDrawer({
                    background: 'bg-color-neutral-alpha-800',
                    content: <PredictionDrawer />
                })
            }}
        >
            <div className='w-full col-span-3 lg:col-span-3 flex items-center gap-2'>
                <Avatar className='relative inline-flex h-10 w-10'>
                    <AvatarImage
                        src={icon}
                        className='h-full w-full object-cover rounded-full'
                    />
                    <AvatarFallback className='flex h-full w-full items-center justify-center bg-white dark:bg-gray-900 rounded-full' />
                </Avatar>
                <div className='w-full'>
                    <div className='flex items-center gap-2'>
                        <div className='flex-1 text-color-neutral-900 text-base font-normal leading-normal'>
                            {groupItemTitle}
                        </div>
                    </div>
                    <div className='text-color-neutral-500 text-xs font-light leading-none'>
                        {formatCurrency(Number(volume))} Bet
                    </div>
                </div>
            </div>
            <div className='text-end lg:text-center my-auto col-span-2 lg:col-span-2'>
                <div className='self-stretch text-color-neutral-900 text-xl font-semibold leading-7'>
                    {chance < 1 ? '<1' : chance} %
                </div>
            </div>
            {!active ? (
                <div className='col-span-5 lg:col-span-3 w-full flex items-center gap-2'>
                    <div>
                        <CircleCheckBold />
                    </div>
                    <div className='text-color-neutral-900 text-sm font-light leading-tight'>
                        Outcome: YES
                    </div>
                </div>
            ) : (
                <div className='col-span-5 lg:col-span-3 grid grid-cols-2 gap-2 items-center '>
                    <Button
                        variant={
                            selectedMarketId === id &&
                            betOption === EBetOption.YES
                                ? 'successSolid'
                                : 'successGhost'
                        }
                        className='px-4 py-2.5 lg:py-6 rounded-lg justify-center items-center gap-2 inline-flex overflow-hidden whitespace-nowrap text-ellipsis'
                        onClick={(e: React.MouseEvent) => {
                            e.stopPropagation()
                            handleSelectMarket(id)
                            handleBetOptionChange(EBetOption.YES)
                            onClickBetButton()
                        }}
                    >
                        <div className='rounded-lg flex-col justify-center items-center inline-flex'>
                            <div className='self-stretch text-center text-sm font-semibold leading-tight'>
                                {formStatus === ESide.BUY ? 'Bet' : 'Sell'}{' '}
                                {outcomes[0]}
                            </div>
                            <div
                                className={clsx(
                                    'self-stretch text-center text-xs font-light leading-3',
                                    {
                                        'text-color-accent-green-700':
                                            selectedMarketId !== id ||
                                            betOption === EBetOption.NO
                                    }
                                )}
                            >
                                {formatToCents(Number(outcomePrices[0]), 1)}
                            </div>
                        </div>
                    </Button>
                    <Button
                        variant={
                            selectedMarketId === id &&
                            betOption === EBetOption.NO
                                ? 'accentSolid'
                                : 'accentGhost'
                        }
                        className='px-4 py-2.5 lg:py-6 rounded-lg justify-center items-center gap-2 inline-flex overflow-hidden whitespace-nowrap text-ellipsis'
                        onClick={(e: React.MouseEvent) => {
                            e.stopPropagation()
                            handleSelectMarket(id)
                            handleBetOptionChange(EBetOption.NO)
                            onClickBetButton()
                        }}
                    >
                        <div className='rounded-lg flex-col justify-center items-center inline-flex'>
                            <div className='self-stretch text-center text-sm font-semibold leading-tight'>
                                {formStatus === ESide.BUY ? 'Bet' : 'Sell'}{' '}
                                {outcomes[1]}
                            </div>
                            <div
                                className={clsx(
                                    'self-stretch text-center text-xs font-light leading-3',
                                    {
                                        'text-color-accent-red-700':
                                            selectedMarketId !== id ||
                                            betOption === EBetOption.YES
                                    }
                                )}
                            >
                                {formatToCents(Number(outcomePrices[1]), 1)}
                            </div>
                        </div>
                    </Button>
                </div>
            )}
        </div>
    )
})

export default MarketEventListItem
