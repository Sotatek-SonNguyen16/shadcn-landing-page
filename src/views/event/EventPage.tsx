import React from 'react'
import EventPageLayout from '@/views/event/EventPageLayout.tsx'
import EventProvider from '@/contexts/EventContext.tsx'
import { EventWebSocketProvider } from '@/contexts/WebSocketContext.tsx'
import { useParams } from 'react-router-dom'
import BetGroupButton from '@/views/BetGroupButton.tsx'

const EventPage: React.FC = () => {
    const { id } = useParams()

    return (
        <EventWebSocketProvider>
            <EventProvider id={id || ''}>
                <div className={`container px-4 md:px-8 lg:px-20`}>
                    <EventPageLayout />
                </div>
                <div className='block lg:hidden sticky bottom-0 w-full mx-0'>
                    <BetGroupButton />
                </div>
            </EventProvider>
        </EventWebSocketProvider>
    )
}

export default EventPage
