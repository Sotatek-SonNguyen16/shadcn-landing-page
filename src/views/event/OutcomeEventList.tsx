import React, {Fragment} from 'react';
import {BetEvent} from "@/contexts/EventContext.tsx";
import EventListItem from "@/views/event/EventListItem.tsx";
import * as Accordion from '@radix-ui/react-accordion';


const OutcomeEventList: React.FC<{ events: BetEvent[] }> = ({events}) => {
    return (
        <Accordion.Root
            className="bg-mauve6 rounded-md shadow-[0_2px_10px] shadow-black/5"
            type="single"
            collapsible
        >
            {events.map((data, index) => (
                <Fragment key={`event-${index}`}>
                    <EventListItem data={data}/>
                </Fragment>
            ))}
        </Accordion.Root>
    );
};

export default OutcomeEventList;