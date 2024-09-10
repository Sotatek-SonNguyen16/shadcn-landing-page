import React, {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useState
} from 'react'
import {
    EBetOption,
    EFormType,
    EMarketDepth,
    ESide,
    KeyPadOptions,
    Market,
    MarketDetail,
    MarketTrade,
    Order,
    OrderFormValues,
    PolyMarketDetail
} from '@/types'
import RequestFactory from '@/services/RequestFactory.ts'
import { useAuthContext } from '@/contexts/AuthContext.tsx'
import { useToast } from '@/components/ui/use-toast.ts'
import { CheckCircle } from 'lucide-react'
import { formatToCents } from '@/lib/utils.ts'
import { UseFormSetError } from 'react-hook-form'

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
    market: PolyMarketDetail | null | undefined
    loading: boolean
    handleSelectMarket: (id: string) => void
    currentMarket: MarketDetail | null
    selectedMarketId: string
    selectedOrder: Order | null
    handleSelectOrder: (order: Order | null) => void
    handleOrder: (
        data: OrderFormValues,
        setError: UseFormSetError<OrderFormValues>
    ) => Promise<void>
    tradeYes: MarketTrade[] | null
    tradeNo: MarketTrade[] | null
    handleCancelMarketTrade: (orderIds: string[]) => Promise<void>
    reloadEvent: () => void
    createOrderResult: 'none' | 'success' | 'failure'
    setCreateOrderResult: (value: 'none' | 'success' | 'failure') => void
    keyPadOptions: KeyPadOptions
    updateKeyPadOptions: (value: KeyPadOptions) => void
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
    const [market, setMarket] = useState<PolyMarketDetail | null | undefined>(
        undefined
    )
    const [loading, setLoading] = useState<boolean>(true)

    const [currentMarket, setCurrentMarket] = useState<MarketDetail | null>(
        null
    )
    const [selectedMarketId, setSelectedMarketId] = useState<string>('')
    const [selectedEvent, setSelectedEvent] = useState<Market | null>(null)
    const [formStatus, setFormStatus] = useState<ESide>(ESide.BUY)
    const [formType, setFormType] = useState<EFormType>(EFormType.MARKET)
    const [marketDepth, setMarketDepth] = useState<EMarketDepth>(
        EMarketDepth.ORDER_BOOK
    )
    const [betOption, setBetOption] = useState<EBetOption>(EBetOption.YES)

    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
    const [tradeYes, setTradeYes] = useState<MarketTrade[] | null>(null)
    const [tradeNo, setTradeNo] = useState<MarketTrade[] | null>(null)
    const [createOrderResult, setCreateOrderResult] = useState<
        'none' | 'success' | 'failure'
    >('none')
    const [keyPadOptions, setKeyPadOptions] = useState<KeyPadOptions>({
        decimal: false
    })

    const { address, isLogin } = useAuthContext()
    const { toast } = useToast()

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

    const handleSelectOrder = (order: Order | null) => {
        setSelectedOrder(order)
    }

    const reloadEvent = () => {
        const fetchPolyMarket = async (eId: string) => {
            setLoading(true)
            try {
                const response = await request.getEventsById(eId)
                if (response) {
                    setMarket(response)
                    const maxPriceItem = response.markets.reduce(
                        (max, item) => {
                            return Number(item.outcomePrices[0]) >
                                Number(max.outcomePrices[0])
                                ? item
                                : max
                        },
                        response.markets[0]
                    )
                    setSelectedMarketId(maxPriceItem.id)
                } else {
                    setMarket(null)
                }
            } catch (err) {
                setMarket(null)
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        if (id) fetchPolyMarket(id)
    }

    useEffect(() => {
        const fetchPolyMarket = async (eId: string) => {
            setLoading(true)
            try {
                const response = await request.getEventsById(eId)
                if (response) {
                    setMarket(response)
                    const maxPriceItem = response.markets.reduce(
                        (max, item) => {
                            return Number(item.outcomePrices[0]) >
                                Number(max.outcomePrices[0])
                                ? item
                                : max
                        },
                        response.markets[0]
                    )
                    setSelectedMarketId(maxPriceItem.id)
                } else {
                    setMarket(null)
                }
            } catch (err) {
                console.error(err)
                setMarket(null)
            } finally {
                setLoading(false)
            }
        }
        if (id) fetchPolyMarket(id)
    }, [id, request])

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
    }, [request, selectedMarketId])

    const fetchActiveOrder = useCallback(
        async (marketId: string) => {
            try {
                const response = await request.getActiveTrades(marketId)
                if (response) {
                    setTradeYes(response.tradeYes)
                    setTradeNo(response.tradeNo)
                }
            } catch (err) {
                console.error(err)
            }
        },
        [request]
    )

    useEffect(() => {
        if (currentMarket) {
            if (isLogin) {
                fetchActiveOrder(currentMarket.id)
            } else {
                setTradeNo(null)
                setTradeYes(null)
            }
        }
    }, [currentMarket, fetchActiveOrder, address, isLogin])

    const handleOrder = async (
        data: OrderFormValues,
        setError: UseFormSetError<OrderFormValues>
    ) => {
        const payload = {
            marketId: currentMarket?.id ?? '',
            assetId:
                betOption === EBetOption.YES
                    ? (currentMarket?.clobTokenIds[0] ?? '')
                    : (currentMarket?.clobTokenIds[1] ?? ''),
            side: formStatus,
            price: Number(data.amount / 100),
            size: Number(data.size)
        }

        setCreateOrderResult('none')

        try {
            const response = await request.order(payload)
            if (response) {
                setCreateOrderResult('success')
                toast({
                    variant: 'transparent',
                    title: '',
                    description: (
                        <div className='p-3 rounded-lg backdrop-blur-xl justify-start items-start gap-2 inline-flex'>
                            <div className='py-0.5 justify-start items-center gap-2 flex'>
                                <div className='p-1 bg-color-accent-green-200 rounded-md justify-center items-center flex'>
                                    <CheckCircle
                                        size={16}
                                        className='text-color-accent-green-900'
                                    />
                                </div>
                            </div>
                            <div className='grow shrink basis-0 flex-col justify-start items-start gap-3 inline-flex'>
                                <div className='self-stretch rounded-lg flex-col justify-center items-start flex'>
                                    <div className='self-stretch text-color-neutral-900 text-base font-semibold leading-normal'>
                                        Buy{' '}
                                        {betOption === EBetOption.YES
                                            ? 'Yes'
                                            : 'No'}{' '}
                                        placed
                                    </div>
                                    <div className='self-stretch text-color-neutral-800 text-sm font-light leading-tight'>
                                        {currentMarket?.question}
                                    </div>
                                </div>
                                <div className='rounded-lg justify-start items-center gap-3 inline-flex'>
                                    <div className='rounded-lg flex-col justify-center items-start inline-flex'>
                                        <div className='self-stretch text-color-neutral-500 text-sm font-light leading-tight'>
                                            {payload.size} shares
                                        </div>
                                    </div>
                                    <div className='rounded-lg flex-col justify-center items-start inline-flex'>
                                        <div className='self-stretch text-color-neutral-500 text-sm font-light leading-tight'>
                                            @ {formatToCents(payload.price)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })
                if (currentMarket?.id) {
                    await fetchActiveOrder(currentMarket?.id)
                }
            }
        } catch (err: any) {
            setError('size', {
                type: 'manual',
                message: JSON.parse(err.message)
                    .map((item: string | { message: string }) => {
                        if (typeof item === 'string') {
                            return item
                        } else if (typeof item === 'object' && item !== null) {
                            const parsedMessage = JSON.parse(item['message'])
                            return Object.values(parsedMessage).join(', ')
                        }
                        return ''
                    })
                    .join(', ')
            })
            setCreateOrderResult('failure')
            // toast({
            //     variant: 'transparent',
            //     title: '',
            //     description: (
            //         <div className='p-3 rounded-lg backdrop-blur-xl justify-start items-start gap-2 inline-flex'>
            //             <div className='py-0.5 justify-start items-center gap-2 flex'>
            //                 <div className='p-1 bg-color-accent-red-200 rounded-md justify-center items-center flex'>
            //                     <X
            //                         size={16}
            //                         className='text-color-accent-red-900'
            //                     />
            //                 </div>
            //             </div>
            //             <div className='grow shrink basis-0 flex-col justify-start items-start gap-3 inline-flex'>
            //                 <div className='self-stretch rounded-lg flex-col justify-center items-start flex'>
            //                     <div className='self-stretch text-color-neutral-900 text-base font-semibold leading-normal'>
            //                         Buy{' '}
            //                         {betOption === EBetOption.YES
            //                             ? 'Yes'
            //                             : 'No'}{' '}
            //                         placed
            //                     </div>
            //                     <div className='self-stretch text-color-neutral-800 text-sm font-light leading-tight'>
            //                         {currentMarket?.question}
            //                     </div>
            //                 </div>
            //                 <div className='rounded-lg justify-start items-center gap-3 inline-flex'>
            //                     <div className='rounded-lg flex-col justify-center items-start inline-flex'>
            //                         <div className='self-stretch text-color-neutral-500 text-sm font-light leading-tight'>
            //                             {payload.size} shares
            //                         </div>
            //                     </div>
            //                     <div className='rounded-lg flex-col justify-center items-start inline-flex'>
            //                         <div className='self-stretch text-color-neutral-500 text-sm font-light leading-tight'>
            //                             @ {formatToCents(payload.price)}
            //                         </div>
            //                     </div>
            //                 </div>
            //             </div>
            //         </div>
            //     )
            // })
        }
    }

    const handleCancelMarketTrade = async (orderIds: string[]) => {
        try {
            await request.deleteOrders({ orderIds: orderIds })
            toast({
                variant: 'success',
                title: 'Delete order success!'
            })
            if (currentMarket?.id) {
                await fetchActiveOrder(currentMarket?.id)
            }
        } catch (err: any) {
            toast({
                variant: 'destructive',
                title: 'Delete order failure!',
                description: JSON.parse(err.message)
                    .map((item: string | { message: string }) => {
                        if (typeof item === 'string') {
                            return item
                        } else if (typeof item === 'object' && item !== null) {
                            const parsedMessage = JSON.parse(item['message'])
                            return Object.values(parsedMessage).join(', ')
                        }
                        return ''
                    })
                    .join(', ')
            })
        }
    }

    const updateKeyPadOptions = (value: KeyPadOptions) => {
        setKeyPadOptions((prevState) => ({
            ...prevState,
            decimal: value.decimal
        }))
    }

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
                selectedMarketId,
                selectedOrder,
                handleSelectOrder,
                handleOrder,
                tradeNo,
                tradeYes,
                handleCancelMarketTrade,
                reloadEvent,
                createOrderResult,
                setCreateOrderResult,
                keyPadOptions,
                updateKeyPadOptions
            }}
        >
            {children}
        </EventContext.Provider>
    )
}

export { useEventContext }
export default EventProvider
