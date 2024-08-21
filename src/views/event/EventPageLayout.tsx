import React from 'react'
import EventHeader from '@/views/event/EventHeader.tsx'
import PredictionCard from '@/views/event/PredictionCard.tsx'
import EventListLayout from '@/views/event/EventListLayout.tsx'
import { clsx } from 'clsx'
import DrawerProvider from '@/contexts/DrawerContext.tsx'
import { EventWebSocketProvider } from '@/contexts/WebSocketContext.tsx'

const EventPageLayout: React.FC = () => {
    return (
        <div className={`h-screen w-full lg:flex pt-3 lg:pt-5`}>
            <div
                className={clsx(
                    `w-full transition-opacity duration-300 animate-fadeIn`,
                    'lg:w-[70%]'
                )}
            >
                <EventHeader />
                <EventWebSocketProvider>
                    <DrawerProvider>
                        <EventListLayout />
                    </DrawerProvider>
                </EventWebSocketProvider>
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
