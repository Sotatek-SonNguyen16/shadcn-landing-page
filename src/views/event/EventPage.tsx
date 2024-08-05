import React from "react";
import EventPageLayout from "@/views/event/EventPageLayout.tsx";
import EventProvider from "@/contexts/EventContext.tsx";
import {useParams} from "react-router-dom";

const EventPage: React.FC = () => {
    const {id} = useParams()
    return (
        <div className={`container mx-auto px-20`}>
            <EventProvider id={id}>
                <EventPageLayout/>
            </EventProvider>
        </div>
    );
};

export default EventPage;