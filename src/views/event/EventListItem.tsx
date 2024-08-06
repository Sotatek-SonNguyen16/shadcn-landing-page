import React, { memo, useCallback } from 'react'
import { useEventContext } from '@/contexts/EventContext.tsx'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { Code, Gift, Link2 } from 'lucide-react'
import { Button } from '@/components/ui/button.tsx'
import * as Accordion from '@radix-ui/react-accordion'
import { Tab, UnderlineTabs } from '@/components/ui/tabs.tsx'
import EventGraph from '@/views/event/charts/EventGraph.tsx'
import EventResolution from '@/views/event/resolution/EventResolution.tsx'
import EventOrderBook from '@/views/event/order/EventOrderBook.tsx'
import { EBetOption, EMarketDepth, ESide, Market } from '@/types'

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
    const { changeMarketDepth } = useEventContext()
    return (
        <UnderlineTabs<EMarketDepth> tabs={tabs} onClick={changeMarketDepth} />
    )
})

const EventListItem: React.FC<{ data: Market }> = ({ data }) => {
    const {
        changeBetOption,
        betOption,
        selectedEvent,
        setSelectedEvent,
        formStatus
    } = useEventContext()
    const { id, image, outcomePrices, outcomes, groupItemTitle, volume } = data
    const arrayOutcomes = JSON.parse(outcomes || '[]')
    const arrayOutcomePrices = JSON.parse(outcomePrices || '[]')

    const formatterEuro = new Intl.NumberFormat('default', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 5
    })

    const formatterUSD = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 5
    })

    const handleBetOptionChange = useCallback(
        (option: EBetOption) => {
            changeBetOption(option)
        },
        [changeBetOption]
    )

    const _renderEventTrigger = useCallback(() => {
        return (
            <div className='w-full grid grid-cols-7 cursor-pointer p-3 border-b border-gray-100 hover:bg-gray-100'>
                <div className='flex items-center gap-2 col-span-3'>
                    <Avatar className='relative inline-flex h-10 w-10'>
                        <AvatarImage
                            src={image}
                            className='h-full w-full object-cover rounded-full'
                        />
                        <AvatarFallback className='flex h-full w-full items-center justify-center bg-white dark:bg-gray-800 rounded-full' />
                    </Avatar>
                    <div>
                        <div className='flex items-center gap-2 font-semibold text-xl'>
                            {groupItemTitle}
                            <Link2 color='gray' width={15} height={15} />
                            <Code color='gray' width={15} height={15} />
                        </div>
                        <div className='text-gray-500 flex items-center gap-2'>
                            {formatterUSD.format(+volume)} Bet{' '}
                            <Gift width={15} height={15} />
                        </div>
                    </div>
                </div>
                <div className='font-bold text-center'>
                    {Math.floor(arrayOutcomePrices[0])} %
                </div>
                <div className='grid grid-cols-2 gap-2 items-center col-span-3'>
                    <Button
                        variant={
                            selectedEvent?.id === id &&
                            betOption === EBetOption.YES
                                ? 'successSolid'
                                : 'successGhost'
                        }
                        className='px-8 py-6 w-full'
                        onClick={() => handleBetOptionChange(EBetOption.YES)}
                    >
                        {`${formStatus === ESide.BUY ? 'Bet' : 'Sell'} ${arrayOutcomes[0]} ${formatterEuro.format(arrayOutcomePrices[0])}`}
                    </Button>
                    <Button
                        variant={
                            selectedEvent?.id === id &&
                            betOption === EBetOption.NO
                                ? 'accentSolid'
                                : 'accentGhost'
                        }
                        className='px-8 py-6'
                        onClick={() => handleBetOptionChange(EBetOption.NO)}
                    >
                        {`${formStatus === ESide.BUY ? 'Bet' : 'Sell'} ${arrayOutcomes[1]} ${formatterEuro.format(arrayOutcomePrices[1])}`}
                    </Button>
                </div>
            </div>
        )
    }, [
        image,
        groupItemTitle,
        formatterUSD,
        volume,
        arrayOutcomePrices,
        selectedEvent?.id,
        id,
        betOption,
        formStatus,
        arrayOutcomes,
        formatterEuro,
        handleBetOptionChange
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
                <div className='py-4 px-5'>
                    <Content />
                </div>
            </Accordion.Content>
        </Accordion.Item>
    )
}

export default EventListItem
