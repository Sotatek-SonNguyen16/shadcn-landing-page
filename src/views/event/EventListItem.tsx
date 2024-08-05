import React, { memo, useCallback } from 'react'
import { useEventContext } from '@/contexts/EventContext.tsx'
import { clsx } from 'clsx'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { Code, Gift, Link2 } from 'lucide-react'
import { Button } from '@/components/ui/button.tsx'
import * as Accordion from '@radix-ui/react-accordion'
import { Tab, UnderlineTabs } from '@/components/ui/tabs.tsx'
import EventGraph from '@/views/event/charts/EventGraph.tsx'
import EventResolution from '@/views/event/resolution/EventResolution.tsx'
import EventOrderBook from '@/views/event/order/EventOrderBook.tsx'
import { BetEvent, EBetOption, EMarketDepth, ESide } from '@/types'

const tabs: Tab<EMarketDepth>[] = [
    {
        title: 'Order Book',
        value: EMarketDepth.ORDER_BOOK,
        content: <EventOrderBook />
    },
    {
        title: 'Graph',
        value: EMarketDepth.GRAPH,
        content: <EventGraph />
    },
    {
        title: 'Resolution',
        value: EMarketDepth.RESOLUTION,
        content: <EventResolution />
    }
]

const Content = memo(() => {
    const { changeMarketDepth } = useEventContext()

    return (
        <UnderlineTabs<EMarketDepth> tabs={tabs} onClick={changeMarketDepth} />
    )
})

const EventListItem: React.FC<{ data: BetEvent }> = ({ data }) => {
    const {
        changeBetOption,
        betOption,
        selectedEvent,
        setSelectedEvent,
        formStatus
    } = useEventContext()
    const { id, name, avatar, price, chance, outcome } = data

    const _renderEventTrigger = useCallback(() => {
        return (
            <div
                className={clsx(
                    'w-full flex justify-between cursor-pointer p-3 border-b-[1px] border-gray-100',
                    'hover:bg-gray-100'
                )}
            >
                <div className={`flex items-center gap-2`}>
                    <Avatar className='relative inline-flex h-[40px] w-[40px]'>
                        <AvatarImage
                            src={avatar}
                            className={clsx(
                                'h-full w-full object-cover',
                                'rounded-full'
                            )}
                        />
                        <AvatarFallback
                            className={clsx(
                                'flex h-full w-full items-center justify-center bg-white dark:bg-gray-800',
                                'rounded-full'
                            )}
                        />
                    </Avatar>
                    <div>
                        <div
                            className={`flex items-center gap-2 font-semibold text-xl`}
                        >
                            {name}
                            <Link2 color={`gray`} width={15} height={15} />
                            <Code color={`gray`} width={15} height={15} />
                        </div>
                        <div
                            className={`text-gray-500 flex items-center gap-2`}
                        >
                            ${price} Bet <Gift width={15} height={15} />
                        </div>
                    </div>
                </div>
                <div className={`font-bold text-center place-content-center`}>
                    {chance}%
                </div>
                <div className={`flex gap-2`}>
                    <Button
                        variant={
                            selectedEvent?.id === data.id &&
                            betOption === EBetOption.YES
                                ? 'successSolid'
                                : 'successGhost'
                        }
                        className='px-8 py-6'
                        onClick={() => changeBetOption(EBetOption.YES)}
                    >
                        {formStatus === ESide.BUY ? 'Buy' : 'Sell'} Yes{' '}
                        {outcome.yes}c
                    </Button>
                    <Button
                        variant={
                            selectedEvent?.id === data.id &&
                            betOption === EBetOption.NO
                                ? 'accentSolid'
                                : 'accentGhost'
                        }
                        className='px-8 py-6'
                        onClick={() => changeBetOption(EBetOption.NO)}
                    >
                        {formStatus === ESide.BUY ? 'Buy' : 'Sell'} No{' '}
                        {outcome.no}c
                    </Button>
                </div>
            </div>
        )
    }, [
        avatar,
        name,
        price,
        chance,
        selectedEvent?.id,
        data.id,
        betOption,
        formStatus,
        outcome.yes,
        outcome.no,
        changeBetOption
    ])

    return (
        <Accordion.Item
            value={`item-${id}`}
            onClick={() => setSelectedEvent(data)}
        >
            <Accordion.Header className='flex'>
                <Accordion.Trigger asChild>
                    {_renderEventTrigger()}
                </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content
                className={
                    'text-mauve11 bg-mauve2 data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden text-[15px]'
                }
            >
                <div className='py-[15px] px-5'>
                    <Content />
                </div>
            </Accordion.Content>
        </Accordion.Item>
    )
}

export default EventListItem
