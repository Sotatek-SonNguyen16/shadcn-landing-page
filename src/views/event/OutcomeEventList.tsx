import React from 'react'
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
            {events.map((data, index) => (
                <EventListItem key={`event-${index}`} data={data} />
            ))}
        </Accordion.Root>
    )
}

export default OutcomeEventList
