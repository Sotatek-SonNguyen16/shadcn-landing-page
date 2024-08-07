import React from 'react'
import EventHeader from '@/views/event/EventHeader.tsx'
import PredictionCard from '@/views/event/PredictionCard.tsx'
import EventListLayout from '@/views/event/EventListLayout.tsx'
import { clsx } from 'clsx'
import { useEventWebSocket } from '@/contexts/WebSocketContext.tsx'

const CheckWebSocketConnection: React.FC<{ isConnected: boolean }> = ({
    isConnected
}) => {
    return (
        <div
            className={clsx(
                'hidden',
                'border-[1px] rounded-xl px-6 py-4 flex flex-col',
                {
                    'border-green-500 bg-green-100': isConnected,
                    'border-red-500 bg-red-100': !isConnected
                }
            )}
        >
            <h1>Status: {isConnected ? 'Connected' : 'Disconnected'}</h1>
        </div>
    )
}

const EventPageLayout: React.FC = () => {
    const { isConnected } = useEventWebSocket()

    return (
        <div className={`h-screen w-full lg:flex pt-5`}>
            <div className={clsx(`w-full`, 'lg:w-[70%] lg:pt-3')}>
                <CheckWebSocketConnection isConnected={isConnected} />
                <EventHeader />
                <EventListLayout />
            </div>
            <div className={`relative`}>
                <aside
                    className={`hidden lg:block sticky top-[140px] right-0 p-3 w-fit`}
                >
                    <PredictionCard />
                </aside>
            </div>
        </div>
    )
}

export default EventPageLayout
