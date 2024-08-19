import React from 'react'
import EventPageLayout from '@/views/event/EventPageLayout.tsx'
import EventProvider from '@/contexts/EventContext.tsx'
import { useParams } from 'react-router-dom'

const EventPage: React.FC = () => {
    const { id } = useParams()

    return (
        <EventProvider id={id ?? ''}>
            <div className={`container px-4 md:px-8 lg:px-20`}>
                <EventPageLayout />
            </div>
        </EventProvider>
    )
}

export default EventPage
