import React from 'react'
import EventPageLayout from '@/views/event/EventPageLayout.tsx'
import EventProvider from '@/contexts/EventContext.tsx'
import { EventWebSocketProvider } from '@/contexts/WebSocketContext.tsx'
import { useParams } from 'react-router-dom'

const EventPage: React.FC = () => {
    const { id } = useParams()

    return (
        <div className={`container lg:px-20`}>
            <EventWebSocketProvider>
                <EventProvider id={id || ''}>
                    <EventPageLayout />
                </EventProvider>
            </EventWebSocketProvider>
        </div>
    )
}

export default EventPage
