import React from 'react'
import EventHeader from '@/views/event/EventHeader.tsx'
import PredictionCard from '@/views/event/PredictionCard.tsx'
import EventListLayout from '@/views/event/EventListLayout.tsx'
import { clsx } from 'clsx'
import { useEventWebSocket } from '@/contexts/WebSocketContext.tsx'
import DrawerProvider from '@/contexts/DrawerContext.tsx'

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
        <div className={`h-screen w-full lg:flex pt-3 lg:pt-5`}>
            <div
                className={clsx(
                    `w-full transition-opacity duration-300 animate-fadeIn`,
                    'lg:w-[70%]'
                )}
            >
                <CheckWebSocketConnection isConnected={isConnected} />
                <EventHeader />
                <DrawerProvider>
                    <EventListLayout />
                </DrawerProvider>
            </div>
            <div className={`relative`}>
                <aside
                    className={`hidden lg:block sticky top-[140px] right-0 px-3 w-fit`}
                >
                    <PredictionCard />
                    <div
                        className={clsx(
                            'w-[338px] h-fit bg-card rounded-xl border-[1px] border-gray-200 shadow-lg',
                            'mt-4 p-2 flex justify-center items-center cursor-pointer',
                            'hover:bg-gray-100',
                            'dark:border-slate-700 dark:hover:bg-gray-800'
                        )}
                    >
                        More
                    </div>
                </aside>
            </div>
        </div>
    )
}

export default EventPageLayout
