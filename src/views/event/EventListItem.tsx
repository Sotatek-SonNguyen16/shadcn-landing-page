import React, { memo, useCallback, useMemo } from 'react'
import { useEventContext } from '@/contexts/EventContext.tsx'
import { Code, Gift, Link2 } from 'lucide-react'
import { Button } from '@/components/ui/button.tsx'
import * as Accordion from '@radix-ui/react-accordion'
import { Tab, UnderlineTabs } from '@/components/ui/tabs.tsx'
import EventGraph from '@/views/event/charts/EventGraph.tsx'
import EventResolution from '@/views/event/resolution/EventResolution.tsx'
import EventOrderBook from '@/views/event/order/EventOrderBook.tsx'
import { EBetOption, EMarketDepth, ESide, Market } from '@/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx'
import { clsx } from 'clsx'
import { useDrawerContext } from '@/contexts/DrawerContext.tsx'
import PredictionDrawer from '@/views/event/PredictionDrawer.tsx'
import SaleDrawer from '@/views/event/SaleDrawer.tsx'
import useScreenSize from '@/hooks/useScreenSize.ts'
import { formatToCents } from '@/lib/utils.ts'

const tabs: Tab<EMarketDepth>[] = [
    {
        title: 'Order Book',
        value: EMarketDepth.ORDER_BOOK,
        content: <EventOrderBook />
    },
    { title: 'Graph', value: EMarketDepth.GRAPH, content: <EventGraph /> },
    {
        title: 'Resolution',
        value: EMarketDepth.RESOLUTION,
        content: <EventResolution />
    }
]

const Content = memo(() => {
    const { changeMarketDepth, marketDepth } = useEventContext()
    return (
        <UnderlineTabs<EMarketDepth>
            active={marketDepth}
            tabs={tabs}
            onClick={changeMarketDepth}
        />
    )
})

const ResizeComponent: React.FC<{
    id: string
    handleSelectMarket: (id: string) => void
    _renderEventTrigger: (isLargeScreen: boolean) => JSX.Element
}> = ({ id, handleSelectMarket, _renderEventTrigger }) => {
    const { openDrawer } = useDrawerContext()
    const { isLargerThan } = useScreenSize()

    return (
        <>
            {isLargerThan('lg') ? (
                <Accordion.Item
                    value={`item-${id}`}
                    onClick={() => {
                        handleSelectMarket(id)
                    }}
                >
                    <Accordion.Header className='flex'>
                        <Accordion.Trigger asChild>
                            {_renderEventTrigger(true)}
                        </Accordion.Trigger>
                    </Accordion.Header>
                    <Accordion.Content
                        className={clsx(
                            'text-mauve11 bg-mauve2 data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden text-[15px]'
                        )}
                    >
                        <div className='py-4 px-5'>
                            <Content />
                        </div>
                    </Accordion.Content>
                </Accordion.Item>
            ) : (
                <div>
                    <div
                        onClick={() => {
                            handleSelectMarket(id)
                            openDrawer({
                                content: <PredictionDrawer />
                            })
                        }}
                    >
                        {_renderEventTrigger(false)}
                    </div>
                </div>
            )}
        </>
    )
}

const EventListItem: React.FC<{ data: Market }> = memo(({ data }) => {
    const {
        changeBetOption,
        betOption,
        handleSelectMarket,
        formStatus,
        selectedMarketId
    } = useEventContext()
    const { id, outcomePrices, outcomes, groupItemTitle, volume, icon } = data
    const { openDrawer } = useDrawerContext()

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
            content: <SaleDrawer />
        })
    }

    const _renderEventTrigger = useCallback(
        (isLargeScreen: boolean) => (
            <div className='w-full grid grid-cols-5 lg:grid-cols-8 gap-2 cursor-pointer px-2 py-6 border-b border-gray-100 rounded bg-background hover:bg-gray-100 dark:border-b-slate-700hover:dark:bg-gray-800'>
                <div className='w-full flex items-center gap-2 col-span-3 lg:col-span-3'>
                    <Avatar className='relative inline-flex h-10 w-10'>
                        <AvatarImage
                            src={icon}
                            className='h-full w-full object-cover rounded-full'
                        />
                        <AvatarFallback className='flex h-full w-full items-center justify-center bg-white dark:bg-gray-800 rounded-full' />
                    </Avatar>
                    <div className='w-full'>
                        <div className='flex items-center gap-2'>
                            <p className='font-semibold text-xl flex-1'>
                                {groupItemTitle}
                            </p>
                            <Link2
                                color='gray'
                                className='hidden lg:block'
                                width={15}
                                height={15}
                            />
                            <Code
                                color='gray'
                                className='hidden lg:block'
                                width={15}
                                height={15}
                            />
                        </div>
                        <div className='text-gray-500 text-[12px] flex items-center gap-2'>
                            {formatterUSD.format(Number(volume))} Bet{' '}
                            <Gift
                                className='hidden lg:block'
                                width={15}
                                height={15}
                            />
                        </div>
                    </div>
                </div>
                <div className='text-end lg:text-center my-auto text-3xl col-span-2 lg:col-span-2'>
                    <p className='font-bold'>{chance < 1 ? '<1' : chance} %</p>
                </div>
                <div className='grid grid-cols-2 gap-2 items-center col-span-5 lg:col-span-3'>
                    <Button
                        variant={
                            selectedMarketId === id &&
                            betOption === EBetOption.YES
                                ? 'successSolid'
                                : 'successGhost'
                        }
                        className='px-8 py-5 lg:py-6 overflow-hidden whitespace-nowrap text-ellipsis'
                        onClick={(e: React.MouseEvent) => {
                            e.stopPropagation()
                            handleSelectMarket(id)
                            handleBetOptionChange(EBetOption.YES)
                            if (!isLargeScreen) onClickBetButton()
                        }}
                    >
                        <p className='text-nowrap'>
                            {`${formStatus === ESide.BUY ? 'Bet' : 'Sell'} ${outcomes[0]} ${formatToCents(Number(outcomePrices[0]), 1)}`}
                        </p>
                    </Button>
                    <Button
                        variant={
                            selectedMarketId === id &&
                            betOption === EBetOption.NO
                                ? 'accentSolid'
                                : 'accentGhost'
                        }
                        className='px-8 py-5 lg:py-6 overflow-hidden whitespace-nowrap text-ellipsis'
                        onClick={(e: React.MouseEvent) => {
                            e.stopPropagation()
                            handleSelectMarket(id)
                            handleBetOptionChange(EBetOption.NO)
                            if (!isLargeScreen) onClickBetButton()
                        }}
                    >
                        <p className='text-nowrap'>
                            {`${formStatus === ESide.BUY ? 'Bet' : 'Sell'} ${outcomes[1]} ${formatToCents(Number(outcomePrices[1]), 1)}`}
                        </p>
                    </Button>
                </div>
            </div>
        ),
        [
            icon,
            groupItemTitle,
            formatterUSD,
            volume,
            chance,
            selectedMarketId,
            id,
            betOption,
            formStatus,
            outcomes,
            outcomePrices,
            handleSelectMarket,
            handleBetOptionChange,
            onClickBetButton
        ]
    )

    return (
        <ResizeComponent
            id={id}
            _renderEventTrigger={_renderEventTrigger}
            handleSelectMarket={handleSelectMarket}
        />
    )
})

export default EventListItem
