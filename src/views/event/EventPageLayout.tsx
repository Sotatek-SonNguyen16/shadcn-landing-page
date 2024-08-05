import React from 'react';
import EventHeader from "@/views/event/EventHeader.tsx";
import PredictionCard from "@/views/event/PredictionCard.tsx";
import EventListLayout from "@/views/event/EventListLayout.tsx";
import {clsx} from "clsx";
import {Button} from "@/components/ui/button.tsx";
import {useEventWebSocket} from "@/contexts/WebSocketContext.tsx";

const EventPageLayout: React.FC = () => {
    const {isConnected, subscribe} = useEventWebSocket();

    return (
        <div className={`h-screen w-full flex pt-5`}>
            <div className={clsx(
                `w-full`,
                'lg:w-[70%] lg:pt-3'
            )}>
                <div className={clsx(
                    "border-[1px] rounded-xl px-6 py-4 flex flex-col",
                    {
                        "border-green-500 bg-green-100": isConnected,
                        "border-red-500 bg-red-100": !isConnected,
                    }
                )}>
                    <h1>Status: {isConnected ? 'Connected' : 'Disconnected'}</h1>
                    <div>
                        <Button variant={`accentSolid`}
                                onClick={() => subscribe(["48331043336612883890938759509493159234755048973500640148014422747788308965732"])}>Subscribe</Button>
                    </div>
                </div>
                <EventHeader/>
                <EventListLayout/>
            </div>
            <div className={`relative`}>
                <aside className={`hidden lg:block sticky top-[140px] right-0 p-3 w-fit`}>
                    <PredictionCard/>
                </aside>
            </div>
        </div>
    );
};

export default EventPageLayout;