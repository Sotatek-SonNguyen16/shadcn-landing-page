import React from 'react'
import { Market } from '@/types'
import EventPageSkeleton from '@/components/skeleton/EventPageSkeleton.tsx'
import MarketEventListItem from '@/views/v2/detail/MarketEventListItem.tsx'

const MarketEventList: React.FC<{ events: Market[] | undefined }> = ({
    events
}) => {
    if (!events) {
        return <EventPageSkeleton />
    }

    return (
        <div className='w-full flex flex-col gap-3'>
            {events.map((data, index) => (
                <MarketEventListItem key={`event-${index}`} data={data} />
            ))}
        </div>
    )
}

export default MarketEventList
