import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState
} from 'react'
import {
    EBetOption,
    EFormType,
    EMarketDepth,
    ESide,
    Market,
    PolyMarket
} from '@/types'
import RequestFactory from '@/services/RequestFactory.ts'

interface EventContextType {
    formStatus: ESide
    changeForm: (status: ESide) => void
    formType: EFormType
    changeType: (type: EFormType) => void
    marketDepth: EMarketDepth
    changeMarketDepth: (type: EMarketDepth) => void
    betOption: EBetOption
    changeBetOption: (option: EBetOption) => void
    selectedEvent: Market | null
    setSelectedEvent: (event: Market) => void
    market: PolyMarket | null
    loading: boolean
}

const EventContext = createContext<EventContextType | undefined>(undefined)

const useEventContext = () => {
    const context = useContext(EventContext)
    if (context === undefined) {
        throw new Error('useEventContext must be used within an EventProvider')
    }
    return context
}

const EventProvider: React.FC<{ children: ReactNode; id: string }> = ({
    children,
    id
}) => {
    const request = RequestFactory.getRequest('MarketRequest')
    const [market, setMarket] = useState<PolyMarket | null>(null)
    const [loading, setLoading] = useState<boolean>(true)

    const [selectedEvent, setSelectedEvent] = useState<Market | null>(null)
    const [formStatus, setFormStatus] = useState<ESide>(ESide.BUY)
    const [formType, setFormType] = useState<EFormType>(EFormType.MARKET)
    const [marketDepth, setMarketDepth] = useState<EMarketDepth>(
        EMarketDepth.GRAPH
    )
    const [betOption, setBetOption] = useState<EBetOption>(EBetOption.YES)

    const changeForm = (status: ESide) => {
        setFormStatus(status)
    }

    const changeType = (type: EFormType) => {
        setFormType(type)
    }

    const changeMarketDepth = (type: EMarketDepth) => {
        setMarketDepth(type)
    }

    const changeBetOption = (option: EBetOption) => {
        setBetOption(option)
    }

    const fetchMarket = async () => {
        setLoading(true)
        try {
            const response = await request.getTopEvents()
            if (response) {
                setMarket(response[0])
                setSelectedEvent(response[0].markets[0])
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchMarket()
    }, [id])

    return (
        <EventContext.Provider
            value={{
                formStatus,
                changeForm,
                formType,
                changeType,
                betOption,
                changeBetOption,
                selectedEvent,
                setSelectedEvent,
                marketDepth,
                changeMarketDepth,
                market,
                loading
            }}
        >
            {children}
        </EventContext.Provider>
    )
}

export { useEventContext }
export default EventProvider
