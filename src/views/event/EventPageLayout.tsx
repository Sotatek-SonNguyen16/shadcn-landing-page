import React from 'react'
import EventHeader from '@/views/event/EventHeader.tsx'
import PredictionCard from '@/views/event/PredictionCard.tsx'
import EventListLayout from '@/views/event/EventListLayout.tsx'

const EventPageLayout: React.FC = () => {
    return (
        <div className={`h-screen w-full flex pt-5`}>
            <div className={`w-[70%]`}>
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
