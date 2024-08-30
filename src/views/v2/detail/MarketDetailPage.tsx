import React from 'react'
import { clsx } from 'clsx'
import { useNavigate, useParams } from 'react-router-dom'
import EventProvider from '@/contexts/EventContext.tsx'
import { ChevronLeft } from 'lucide-react'
import MarketEventHeader from '@/views/v2/detail/MarketEventHeader.tsx'
import DrawerProvider from '@/contexts/DrawerContext.tsx'
import EventListLayout from '@/views/event/EventListLayout.tsx'
import { EventWebSocketProvider } from '@/contexts/WebSocketContext.tsx'

const MarketDetailPage: React.FC = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const handleBack = () => {
        navigate(-1)
    }

    return (
        <EventProvider id={id ?? ''}>
            <div
                className={clsx(
                    'bg-gradient-to-bl from-brand01/30 via-brand02/10 to-25% h-screen',
                    'w-full flex flex-col',
                    'py-4 px-4 gap-4'
                )}
            >
                <div className='flex justify-start items-center'>
                    <div
                        className='flex justify-start items-center cursor-pointer'
                        onClick={handleBack}
                    >
                        <ChevronLeft size={18} />
                        <div className='self-stretch text-center text-Neutral-900 text-base font-normal leading-normal'>
                            Back
                        </div>
                    </div>
                </div>
                <MarketEventHeader />
                <EventWebSocketProvider>
                    <DrawerProvider>
                        <EventListLayout />
                    </DrawerProvider>
                </EventWebSocketProvider>
            </div>
        </EventProvider>
    )
}

export default MarketDetailPage
