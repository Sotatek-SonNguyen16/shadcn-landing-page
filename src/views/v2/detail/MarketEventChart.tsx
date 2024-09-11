import { Logo } from '@/components/icon.tsx'
import { useDrawerContext } from '@/contexts/DrawerContext.tsx'
import { useEventContext } from '@/contexts/EventContext.tsx'
import { useEventWebSocket } from '@/contexts/WebSocketContext.tsx'
import { EBetOption } from '@/types'
import EventOrderBook from '@/views/event/order/EventOrderBook.tsx'
import SettingChartDrawer from '@/views/v2/detail/SettingChartDrawer.tsx'
import axios from 'axios'
import {
    ChartOptions,
    ColorType,
    createChart,
    DeepPartial,
    IChartApi,
    UTCTimestamp
} from 'lightweight-charts'
import { ArrowRightLeft, RefreshCcw, Settings } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

const OrderBookButton: React.FC<{
    active: boolean
    text: string
    onClick: () => void
}> = ({ active, text, onClick }) => {
    if (active) {
        return (
            <div
                className='self-stretch py-0.5 bg-color-neutral-alpha-500 rounded-full shadow flex-col justify-center items-center gap-2 inline-flex'
                onClick={onClick}
            >
                <div className='px-3 rounded-lg justify-center items-center gap-2 inline-flex'>
                    <div className='rounded-lg justify-start items-center gap-1 flex'>
                        <div className='pb-px rounded-lg flex-col justify-center items-start inline-flex'>
                            <div className='self-stretch text-color-neutral-900 text-xs font-normal leading-none'>
                                {text}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div
            className='self-stretch py-0.5 rounded-full flex-col justify-center items-center gap-2 inline-flex'
            onClick={onClick}
        >
            <div className='px-3 rounded-lg justify-center items-center gap-2 inline-flex'>
                <div className='rounded-lg justify-start items-center gap-1 flex'>
                    <div className='pb-px rounded-lg flex-col justify-center items-start inline-flex'>
                        <div className='self-stretch text-color-neutral-500 text-xs font-normal leading-none'>
                            {text}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const OrderBookGroupButton = () => {
    const { changeBetOption, betOption } = useEventContext()
    const { resetOrderBook } = useEventWebSocket()
    return (
        <div className='flex justify-between items-center'>
            <div className='w-fit h-8 p-0.5 bg-color-neutral-100 rounded-full justify-start items-center gap-0.5 inline-flex'>
                <OrderBookButton
                    text='Trade Yes'
                    active={betOption === EBetOption.YES}
                    onClick={() => changeBetOption(EBetOption.YES)}
                />
                <OrderBookButton
                    text='Trade No'
                    active={betOption === EBetOption.NO}
                    onClick={() => changeBetOption(EBetOption.NO)}
                />
            </div>
            <RefreshCcw
                size={20}
                onClick={resetOrderBook}
                className='cursor-pointer'
            />
        </div>
    )
}

const MarketEventChart: React.FC = () => {
    const tvChartRef = useRef(null)
    const { currentMarket } = useEventContext()
    const [isShowYesChart, setIsShowYesChart] = useState<boolean>(true)
    const [tvChart, setTvChart] = useState<IChartApi | null>(null)
    const [historyData, setHistoryData] = useState<
        { value: number; time: UTCTimestamp }[]
    >([])

    const getMarketChartData = async () => {
        const res = await axios.get(
            `https://clob.polymarket.com` +
                '/prices-history?' +
                `interval=all&market=21742633143463906290569050155826241533067272736897614950488156847949938836455&fidelity=720`
        )
        const dataHistory = res.data.history
        setHistoryData(
            dataHistory.map((el: { p: number; t: number }) => ({
                value: el.p * 100,
                time: el.t as UTCTimestamp
            }))
        )
    }

    useEffect(() => {
        getMarketChartData()
    }, [currentMarket])

    useEffect(() => {
        if (tvChart) {
            tvChart.resize(0, 0)
            setTvChart(null)
        }
    }, [isShowYesChart, historyData])

    useEffect(() => {
        if (tvChartRef.current && !tvChart) {
            const chartOptions: DeepPartial<ChartOptions> = {
                height: 220,
                layout: {
                    background: { type: ColorType.Solid, color: 'transparent' },
                    textColor: 'rgba(255, 255, 255, 0.50)',
                    fontSize: 10,
                    fontFamily: 'PolySans',
                    attributionLogo: false
                },
                grid: {
                    vertLines: {
                        visible: false
                    },
                    horzLines: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    }
                },
                timeScale: { visible: false },
                rightPriceScale: {
                    borderVisible: false
                },
                crosshair: {
                    horzLine: { visible: false, labelVisible: false },
                    vertLine: { visible: false, labelVisible: false }
                },
                handleScroll: true,
                handleScale: true,
                trackingMode: { exitMode: 0 }
            }
            const chart = createChart(tvChartRef.current, chartOptions)

            const lineSeries = chart.addLineSeries({
                color: isShowYesChart ? '#E84A64' : '#22DD70',
                lastPriceAnimation: 1,
                pointMarkersVisible: false,
                lineType: 2,
                lastValueVisible: false,
                priceLineVisible: false,
                priceFormat: { type: 'percent', precision: 1 }
            })
            lineSeries.setData(
                isShowYesChart
                    ? historyData
                    : historyData.map((el) => ({
                          ...el,
                          value: 100 - el.value
                      }))
            )

            // chart.subscribeCrosshairMove((param) =>{
            // let dateStr = useWeekly
            //   ? dayjs(param.time.year + '-' + param.time.month + '-' + param.time.day)
            //       .startOf('week')
            //       .format('MMMM D, YYYY') +
            //     '-' +
            //     dayjs(param.time.year + '-' + param.time.month + '-' + param.time.day)
            //       .endOf('week')
            //       .format('MMMM D, YYYY')
            //   : dayjs(param.time.year + '-' + param.time.month + '-' + param.time.day).format('MMMM D, YYYY')
            // var price = param.seriesPrices.get(series)

            chart.timeScale().fitContent()
            setTvChart(chart)
        }
    }, [tvChartRef, tvChart])

    const { openDrawer } = useDrawerContext()

    const onClickSettingButton = () => {
        openDrawer({
            transparent: true,
            background: 'bg-color-neutral-50',
            content: <SettingChartDrawer />
        })
    }

    return (
        <div className='w-100 [calc(100vh-220px)] flex flex-col gap-4 py-4 overflow-y-scroll scrollbar-hidden'>
            <div className='flex flex-col gap-2'>
                <div className='flex'>
                    <div className='flex-1 flex flex-col'>
                        <div className='h-8 rounded-lg justify-start items-center gap-1 inline-flex'>
                            <div className='rounded-lg flex-col justify-center items-start inline-flex'>
                                <div className='text-color-neutral-900 text-2xl font-semibold leading-loose'>
                                    19%
                                </div>
                            </div>
                            <div className='rounded-lg flex-col justify-center items-start inline-flex'>
                                <div className='text-color-neutral-900 text-base font-normal leading-normal'>
                                    chance
                                </div>
                            </div>
                        </div>
                        <div className='h-5 rounded-lg justify-start items-center gap-1 inline-flex'>
                            <div className='text-color-accent-green-900 text-xs font-normal leading-none'>
                                +32%
                            </div>
                            <div className='text-color-neutral-500 text-sm font-light leading-tight'>
                                YES
                            </div>
                        </div>
                    </div>
                    <div className='flex-1 justify-end items-center inline-flex'>
                        <Logo />
                    </div>
                </div>
            </div>

            <div className='flex flex-col'>
                <div className='flex w-full justify-between h-[32px]'>
                    <div className='flex flex-row gap-[2px]'>
                        {[
                            { text: '1h' },
                            { text: '6h' },
                            { text: '1d' },
                            { text: '1w' },
                            { text: '1m' },
                            { text: 'All time' }
                        ].map(({ text }) => (
                            <div
                                key={text}
                                className='h-[24px] text-xs text-neutral-500 font-[300] px-[8px] py-[2px] cursor-pointer'
                            >
                                {text}
                            </div>
                        ))}
                    </div>
                    <div className='flex gap-4'>
                        <ArrowRightLeft
                            className='cursor-pointer'
                            size={20}
                            onClick={() => {
                                setIsShowYesChart((prev) => {
                                    return !prev
                                })
                            }}
                        />
                        <Settings
                            size={20}
                            className='cursor-pointer hidden'
                            onClick={onClickSettingButton}
                        />
                    </div>
                </div>

                <div ref={tvChartRef} className='w-full h-[220px]' />
            </div>

            <div className='flex flex-col gap-2'>
                <div className='text-color-neutral-900 text-xl font-semibold leading-7'>
                    Order book
                </div>
                <OrderBookGroupButton />
                <EventOrderBook />
            </div>
        </div>
    )
}

export default MarketEventChart
