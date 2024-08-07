import React, { Fragment } from 'react'
import EventListItem from '@/views/event/EventListItem.tsx'
import * as Accordion from '@radix-ui/react-accordion'
import { Market } from '@/types'
import EventPageSkeleton from '@/components/skeleton/EventPageSkeleton.tsx'

const OutcomeEventList: React.FC<{ events: Market[] | undefined }> = ({
    events
}) => {
    if (!events) {
        return <EventPageSkeleton />
    }

    return (
        <Accordion.Root
            className='bg-mauve6 rounded-md shadow-[0_2px_10px] shadow-black/5'
            type='single'
            collapsible
        >
            {events
                .sort(
                    (a, b) =>
                        Number(b.outcomePrices[0]) - Number(a.outcomePrices[0])
                )
                .map((data, index) => (
                    <Fragment key={`event-${index}`}>
                        <EventListItem data={data} />
                    </Fragment>
                ))}
        </Accordion.Root>
    )
}

export default OutcomeEventList
