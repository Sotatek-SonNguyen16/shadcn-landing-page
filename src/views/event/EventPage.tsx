import React from 'react'
import EventPageLayout from '@/views/event/EventPageLayout.tsx'
import EventProvider from '@/contexts/EventContext.tsx'
import { EventWebSocketProvider } from '@/contexts/WebSocketContext.tsx'

const EventPage: React.FC = () => {
    return (
        <div className={`container mx-auto px-20`}>
            <EventWebSocketProvider>
                <EventProvider>
                    <EventPageLayout />
                </EventProvider>
            </EventWebSocketProvider>
        </div>
    )
}

export default EventPage
