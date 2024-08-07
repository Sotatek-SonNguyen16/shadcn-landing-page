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
    MarketDetail,
    PolyMarketDetail
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
    market: PolyMarketDetail | null
    loading: boolean
    handleSelectMarket: (id: string) => void
    currentMarket: MarketDetail | null
    selectedMarketId: string
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
    const [market, setMarket] = useState<PolyMarketDetail | null>(null)
    const [loading, setLoading] = useState<boolean>(true)

    const [currentMarket, setCurrentMarket] = useState<MarketDetail | null>(
        null
    )
    const [selectedMarketId, setSelectedMarketId] = useState<string>('')
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

    const handleSelectMarket = (id: string) => {
        if (id === '') return
        setSelectedMarketId(id)
    }

    useEffect(() => {
        const fetchPolyMarket = async (eId: string) => {
            setLoading(true)
            try {
                const response = await request.getEventsById(eId)
                if (response) {
                    setMarket(response)
                    setSelectedMarketId(response.markets[0].id)
                }
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        if (id) fetchPolyMarket(id)
    }, [id])

    useEffect(() => {
        const fetchMarket = async (mId: string) => {
            setCurrentMarket(null)
            try {
                const response = await request.getMarketById(mId)
                if (response) {
                    setCurrentMarket(response)
                }
            } catch (err) {
                console.error(err)
            }
        }

        if (selectedMarketId) fetchMarket(selectedMarketId)
    }, [selectedMarketId])

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
                loading,
                handleSelectMarket,
                currentMarket,
                selectedMarketId
            }}
        >
            {children}
        </EventContext.Provider>
    )
}

export { useEventContext }
export default EventProvider
