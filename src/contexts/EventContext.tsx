import React, {createContext, ReactNode, useContext, useEffect, useState} from "react";
import placholder from "@/lib/placeholder-data.ts";

type BetEvent = {
    id: number;
    avatar: string;
    name: string;
    price: number;
    chance: number;
    outcome: {
        yes: number;
        no: number;
    }
}

enum EFormStatus {
    BUY = 'buy',
    SELL = 'sell',
}

enum EFormType {
    MARKET = "Market",
    LIMIT = "Limit",
    AMM = "AMM"
}

enum EMarketDepth {
    ORDER_BOOK = "OrderBook",
    GRAPH = "Graph",
    RESOLUTION = "Resolution",
}

enum EBetOption {
    YES = "Yes",
    NO = "No",
}

interface EventContextType {
    events: BetEvent[];
    formStatus: EFormStatus;
    changeForm: (status: EFormStatus) => void;
    formType: EFormType;
    changeType: (type: EFormType) => void;
    marketDepth: EMarketDepth;
    changeMarketDepth: (type: EMarketDepth) => void;
    betOption: EBetOption;
    changeBetOption: (option: EBetOption) => void;
    selectedEvent: BetEvent | null;
    setSelectedEvent: (event: BetEvent) => void;
    addEvent: (event: BetEvent) => void;
    removeEvent: (id: number) => void;
    updateEvent: (updatedEvent: BetEvent) => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined)

const useEventContext = () => {
    const context = useContext(EventContext);
    if (context === undefined) {
        throw new Error('useEventContext must be used within an EventProvider');
    }
    return context;
}

const EventProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [events, setEvents] = useState<BetEvent[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<BetEvent | null>(null)
    const [formStatus, setFormStatus] = useState<EFormStatus>(EFormStatus.BUY)
    const [formType, setFormType] = useState<EFormType>(EFormType.MARKET)
    const [marketDepth, setMarketDepth] = useState<EMarketDepth>(EMarketDepth.GRAPH)
    const [betOption, setBetOption] = useState<EBetOption>(EBetOption.YES)

    const changeForm = (status: EFormStatus) => {
        setFormStatus(status);
    }

    const changeType = (type: EFormType) => {
        setFormType(type);
    }

    const changeMarketDepth = (type: EMarketDepth) => {
        setMarketDepth(type);
    }

    const changeBetOption = (option: EBetOption) => {
        setBetOption(option);
    }

    const addEvent = (event: BetEvent) => {
        setEvents((prevEvents) => [...prevEvents, event]);
    };

    const removeEvent = (id: number) => {
        setEvents((prevEvents) => prevEvents.filter(event => event.id !== id));
    };

    const updateEvent = (updatedEvent: BetEvent) => {
        setEvents((prevEvents) =>
            prevEvents.map(event => (event.id === updatedEvent.id ? updatedEvent : event))
        );
    };

    useEffect(() => {
        setEvents(placholder.events)
        setSelectedEvent(placholder.events[0] || null)
    }, []);

    return (
        <EventContext.Provider
            value={{
                events,
                formStatus,
                changeForm,
                formType,
                changeType,
                betOption,
                changeBetOption,
                selectedEvent,
                setSelectedEvent,
                addEvent,
                removeEvent,
                updateEvent,
                marketDepth,
                changeMarketDepth
            }}>
            {children}
        </EventContext.Provider>
    )
}

export {EFormStatus, EFormType, EMarketDepth, EBetOption};
export type {BetEvent};
export {useEventContext};
export default EventProvider;