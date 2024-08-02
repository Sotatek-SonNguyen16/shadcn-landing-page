import React from "react";
import EventPageLayout from "@/views/event/EventPageLayout.tsx";
import EventProvider from "@/contexts/EventContext.tsx";

const EventPage: React.FC = () => {
    return (
        <div className={`container mx-auto px-20`}>
            <EventProvider>
                <EventPageLayout/>
            </EventProvider>
        </div>
    );
};

export default EventPage;