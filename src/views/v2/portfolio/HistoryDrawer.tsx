import React, { Fragment, useEffect, useState } from 'react'
import {
    ChevronLeft,
    ExternalLink,
    Filter,
    RefreshCcw,
    Search
} from 'lucide-react'
import DrawerProvider, { useDrawerContext } from '@/contexts/DrawerContext.tsx'
import { Button } from '@/components/ui/button.tsx'
import { UnderlineTabs } from '@/components/ui/tabs.tsx'
import {
    ITrade,
    MarketDetail,
    SortByType,
    SortOrderType,
    TradeType
} from '@/types'
import { Badge } from '@/components/ui/badge.tsx'
import CheckboxGroup from '@/components/CheckBoxGroup.tsx'
import SettingGroup from '@/components/SettingGroup.tsx'
import DateTimePicker from '@/components/DateTimePicker.tsx'
import RequestFactory from '@/services/RequestFactory'
import { filterParams, formatUnixTime } from '@/lib/utils'
import moment from 'moment'
import { LoadingSpinner } from '@/components/ui/spinner'
import InfiniteScroll from 'react-infinite-scroll-component'
import {
    Drawer,
    DrawerContent,
    DrawerFooter,
    DrawerTitle
} from '@/components/ui/drawer'
import { clsx } from 'clsx'
import { TradesRequestParam } from '@/types/request.ts'
import { useNavigate } from 'react-router-dom'

const FilterDrawerContent = ({
    setParams,
    params
}: {
    setParams: (value: TradesRequestParam) => void
    params: TradesRequestParam
}) => {
    const [customFromTs, setCustomFromTs] = useState<Date | undefined>(
        undefined
    )
    const [customToTs, setCustomToTs] = useState<Date | undefined>(undefined)
    const [selectedCustom, setSelectedCustom] = useState<string>('')

    const onSortBy = (value: string | SortByType | '') => {
        if (value === '') {
            setParams({
                ...params,
                sortBy: undefined
            })
            return
        }

        setParams({ ...params, sortBy: value as SortByType })
    }

    const onSortOrder = (value: string | SortOrderType | '') => {
        if (value === '') {
            setParams({
                ...params,
                sortOrder: undefined
            })
            return
        }

        setParams({ ...params, sortOrder: value as SortOrderType })
    }

    const onSelectTime = (value: string) => {
        setSelectedCustom(value)

        switch (value) {
            case 'today': {
                setParams({
                    ...params,
                    fromTs: moment().startOf('day').valueOf(),
                    toTs: moment().valueOf()
                })
                break
            }
            case 'yesterday': {
                setParams({
                    ...params,
                    fromTs: moment()
                        .subtract(1, 'days')
                        .startOf('day')
                        .valueOf(),
                    toTs: moment().subtract(1, 'days').endOf('day').valueOf()
                })
                break
            }
            case 'lastWeek': {
                setParams({
                    ...params,
                    fromTs: moment()
                        .subtract(1, 'week')
                        .startOf('week')
                        .valueOf(),
                    toTs: moment().subtract(1, 'week').endOf('week').valueOf()
                })
                break
            }
            case 'lastMonth': {
                setParams({
                    ...params,
                    fromTs: moment()
                        .subtract(1, 'month')
                        .startOf('month')
                        .valueOf(),
                    toTs: moment().subtract(1, 'month').endOf('month').valueOf()
                })
                break
            }
            case 'last3Months': {
                setParams({
                    ...params,
                    fromTs: moment()
                        .subtract(3, 'month')
                        .startOf('day')
                        .valueOf(),
                    toTs: moment().valueOf()
                })
                break
            }
            case 'yearToDate': {
                setParams({
                    ...params,
                    fromTs: moment()
                        .subtract(1, 'year')
                        .startOf('day')
                        .valueOf(),
                    toTs: moment().valueOf()
                })
                break
            }
            case 'lastYear': {
                setParams({
                    ...params,
                    fromTs: moment()
                        .subtract(1, 'year')
                        .startOf('year')
                        .valueOf(),
                    toTs: moment().subtract(1, 'year').endOf('year').valueOf()
                })
                break
            }

            case 'custom': {
                break
            }

            default: {
                setParams({
                    ...params,
                    fromTs: undefined,
                    toTs: undefined
                })
                break
            }
        }
    }

    useEffect(() => {
        if (customFromTs && customToTs) {
            setParams({
                ...params,
                fromTs: customFromTs?.getTime(),
                toTs: customToTs?.getTime()
            })
        }
    }, [customFromTs, customToTs])

    return (
        <div className='flex flex-col gap-4 px-4'>
            <div className='w-full h-10 grid grid-cols-7 items-center gap-1'>
                <div className='py-0.5' />
                <div className='grow shrink basis-0 flex-col justify-center items-center inline-flex col-start-3 col-span-3'>
                    <div className='self-stretch rounded-lg justify-center items-start gap-2 inline-flex'>
                        <div className='grow shrink basis-0 rounded-lg flex-col justify-center items-start inline-flex'>
                            <div className='self-stretch text-center text-color-neutral-900 text-base font-normal leading-normal'>
                                Filters
                            </div>
                        </div>
                    </div>
                </div>
                <div className='col-span-2 py-0.5 flex justify-end'>
                    <div
                        className='w-fit justify-center items-center gap-2 inline-flex cursor-pointer'
                        onClick={() => {
                            setSelectedCustom('')
                            setCustomFromTs(undefined)
                            setCustomToTs(undefined)
                            setParams({})
                        }}
                    >
                        <div className='self-stretch text-center text-color-brand-500 text-sm font-normal leading-tight'>
                            Reset
                        </div>
                        <div>
                            <RefreshCcw
                                size={16}
                                className='text-color-brand-500'
                            />
                        </div>
                    </div>
                </div>
            </div>
            <CheckboxGroup
                name='Sort order'
                value={params.sortOrder ?? ''}
                onChange={(value: string | (SortOrderType | '')) =>
                    onSortOrder(value)
                }
                items={[
                    { name: 'Newest', value: 'desc' },
                    { name: 'Oldest', value: 'asc' }
                ]}
            />
            <CheckboxGroup
                name='Sort by'
                value={params.sortBy ?? ''}
                onChange={(value: string | SortByType | '') => onSortBy(value)}
                items={[
                    { name: 'Time', value: 'timestamp' },
                    { name: 'Value', value: 'totalValue' },
                    { name: 'Shares', value: 'shares' },
                    { name: 'Price', value: 'price' }
                ]}
            />
            <SettingGroup
                name='Time'
                valueSingle={selectedCustom}
                onChange={(value: any) => onSelectTime(value)}
                single
                items={[
                    { name: 'All', value: '' },
                    { name: 'Today', value: 'today' },
                    { name: 'Yesterday', value: 'yesterday' },
                    { name: 'Last week', value: 'lastWeek' },
                    { name: 'Last month', value: 'lastMonth' },
                    { name: 'Last 3 months', value: 'last3Months' },
                    { name: 'Year to date', value: 'yearToDate' },
                    { name: 'Last year', value: 'lastYear' },
                    { name: 'Custom time', value: 'custom' }
                ]}
            />
            <div className='flex justify-center items-center gap-2'>
                <DateTimePicker
                    placeholder='Due date'
                    value={customFromTs}
                    onChange={setCustomFromTs}
                    disabled={selectedCustom !== 'custom'}
                />
                <div>-</div>
                <DateTimePicker
                    placeholder='To date'
                    value={customToTs}
                    onChange={setCustomToTs}
                    disabled={selectedCustom != 'custom'}
                />
            </div>
        </div>
    )
}

const HistoryListItem = ({ trade }: { trade: ITrade }) => {
    const navigate = useNavigate()

    const goToDetailEvent = (id: string) => {
        navigate(`/v2/event/${id}`)
    }

    return (
        <div className='w-full rounded-xl bg-color-neutral-50 flex flex-col p-3 gap-3'>
            <div className='w-full rounded-lg justify-start items-center gap-3 inline-flex'>
                <div className='relative'>
                    <div className='size-12 rounded-[0.375rem] opacity-100'>
                        <img
                            src={trade?.image}
                            alt={trade?.name}
                            className='absolute inset-0 h-full w-full object-cover text-transparent rounded-[0.375rem]'
                        />
                    </div>
                </div>
                <div className='grow shrink basis-0 flex-col justify-start items-start inline-flex'>
                    <div
                        className='self-stretch min-h-6 rounded-lg flex-col justify-center items-start flex cursor-pointer'
                        onClick={() => goToDetailEvent(trade.eventId)}
                    >
                        <div className='w-[calc(100vw-132px)] text-color-neutral-900 text-sm font-normal leading-tight text-wrap'>
                            {trade?.name}
                        </div>
                    </div>
                </div>
            </div>
            <div className='h-8 rounded-lg justify-start items-center gap-2 inline-flex'>
                <div className='grow shrink basis-0 rounded-lg flex-col justify-start items-start gap-0.5 inline-flex'>
                    <div className='self-stretch rounded-lg justify-start items-center gap-1 inline-flex'>
                        <div className='text-color-neutral-900 text-sm font-light leading-tight capitalize'>
                            {trade?.type?.toLowerCase()}
                        </div>
                        <div
                            className={`grow shrink basis-0  text-sm font-light leading-tight ${
                                trade?.positionType === 'YES'
                                    ? 'text-color-accent-green-900'
                                    : 'text-color-accent-red-900'
                            }`}
                        >
                            {trade?.positionType}
                        </div>
                    </div>
                    <div className='self-stretch rounded-lg justify-start items-center gap-0.5 inline-flex'>
                        <div className='text-color-neutral-700 text-xs font-light leading-3'>
                            {trade?.shares}{' '}
                        </div>
                        <div className='text-color-neutral-700 text-xs font-light leading-3'>
                            shares at
                        </div>
                        <div className='text-color-neutral-700 text-xs font-light leading-3'>
                            {trade?.price}¢
                        </div>
                    </div>
                </div>
                <div className='rounded-lg flex-col justify-center items-end gap-0.5 inline-flex'>
                    <div className='self-stretch h-5 rounded-lg flex-col justify-center items-end flex'>
                        <div className='self-stretch text-right text-color-neutral-900 text-sm font-normal leading-tight'>
                            ${trade?.totalValue}
                        </div>
                    </div>
                    <div className='self-stretch rounded-lg justify-end items-center gap-0.5 inline-flex'>
                        <div className='rounded-lg flex-col justify-center items-start inline-flex'>
                            <div className='self-stretch text-color-neutral-500 text-xs font-light leading-3'>
                                {formatUnixTime(trade?.timestamp)}
                            </div>
                        </div>
                        <div className='rounded-lg justify-center items-center flex cursor-pointer'>
                            <ExternalLink
                                size={12}
                                className='text-color-brand-500'
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const HistoryFilterButton = ({
    setParams,
    params
}: {
    setParams: (value: TradesRequestParam) => void
    params: TradesRequestParam
}) => {
    const [isShowFilter, setIsShowFilter] = useState<boolean>(false)

    return (
        <>
            <Button
                variant={'transparent'}
                size={'sm'}
                onClick={() => setIsShowFilter(true)}
            >
                <Filter size={20} />
                {(!!params.sortBy || !!params.fromTs || !!params.toTs) && (
                    <Badge variant={'brand'} size={'default'} />
                )}
            </Button>

            {isShowFilter && (
                <Drawer
                    open={isShowFilter}
                    onOpenChange={() => {
                        setIsShowFilter(!isShowFilter)
                    }}
                    modal={true}
                    shouldScaleBackground={true}
                    disablePreventScroll={true}
                >
                    <DrawerContent background={'bg-color-neutral-alpha-700'}>
                        <div
                            className={clsx(
                                'max-h-screen',
                                'overflow-y-scroll scrollbar-hidden'
                            )}
                        >
                            <DrawerTitle />
                            <FilterDrawerContent
                                setParams={setParams}
                                params={params}
                            />
                            <DrawerFooter />
                        </div>
                    </DrawerContent>
                </Drawer>
            )}
        </>
    )
}

const HistoryDrawer: React.FC = () => {
    const [tradesHistory, setTradesHistory] = useState<ITrade[]>([])
    const [params, setParams] = useState<TradesRequestParam>({})
    const [page, setPage] = useState<number>(1)
    const [limit] = useState<number>(10)
    const [totalPage, setTotalPage] = useState<number>(0)
    const { closeDrawer } = useDrawerContext()

    const requestTrade = RequestFactory.getRequest('TradeRequest')
    const requestMarkets = RequestFactory.getRequest('MarketRequest')

    const getTradesHistory = async () => {
        try {
            const dataTrade = await requestTrade.getTradesHistory(
                filterParams({
                    page,
                    limit,
                    ...params
                })
            )

            const marketIds =
                dataTrade?.docs?.map((trade: ITrade) => trade.marketId) ?? []

            const dataMarket = await requestMarkets.getMarketsByListId({
                id: marketIds
            })

            const data = dataTrade?.docs?.map((trade: ITrade) => {
                const market = dataMarket?.docs?.find(
                    (mk: MarketDetail) => mk.id === trade.marketId
                )
                return {
                    ...trade,
                    name: market?.question || '',
                    image: market?.image || '',
                    positionType:
                        market?.clobTokenIds.findIndex(
                            (mk: string) => mk === trade.assetId
                        ) === 0
                            ? 'YES'
                            : 'NO'
                }
            })

            setTradesHistory(tradesHistory.concat(data) || [])
            setTotalPage(dataTrade?.totalPages ?? 0)
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        getTradesHistory().then()
    }, [page, params])

    const fetchMoreData = () => {
        setTimeout(() => {
            setPage(page + 1)
        }, 1000)
    }

    return (
        <div className='h-full w-full flex flex-col px-4'>
            <div className='w-full h-10 grid grid-cols-5 items-center gap-1'>
                <div className='py-0.5 flex-col justify-start items-start gap-2 inline-flex'>
                    <div
                        className='h-5 justify-start items-center gap-1 inline-flex cursor-pointer'
                        onClick={closeDrawer}
                    >
                        <ChevronLeft size={24} />
                    </div>
                </div>
                <div className='grow shrink basis-0 flex-col justify-center items-center inline-flex col-span-3'>
                    <div className='self-stretch rounded-lg justify-center items-start gap-2 inline-flex'>
                        History
                    </div>
                </div>
                <div className='py-0.5 justify-end items-center flex'>
                    <div className='h-5 justify-start items-center gap-1 inline-flex cursor-pointer'>
                        <Search size={24} />
                    </div>
                </div>
            </div>
            <div className='h-[80vh] flex flex-col gap-4'>
                <div className='flex gap-2 items-center'>
                    <DrawerProvider>
                        <HistoryFilterButton
                            setParams={setParams}
                            params={params}
                        />
                    </DrawerProvider>
                    <div className='flex-1'>
                        <UnderlineTabs<TradeType | ''>
                            className='w-[calc(100vw-70px)]'
                            defaultValue={''}
                            onClick={(value) =>
                                setParams({
                                    ...params,
                                    type: value === '' ? undefined : value
                                })
                            }
                            tabs={[
                                {
                                    title: 'All trades',
                                    value: '',
                                    content: <></>
                                },
                                { title: 'Buy', value: 'BUY', content: <></> },
                                {
                                    title: 'Sell',
                                    value: 'SELL',
                                    content: <></>
                                },
                                {
                                    title: 'Redeem',
                                    value: 'REDEEM',
                                    content: <></>
                                }
                            ]}
                        />
                    </div>
                </div>
                <div
                    className='overflow-auto scrollbar-hidden'
                    id='scrollableHistory'
                >
                    <InfiniteScroll
                        scrollableTarget='scrollableHistory'
                        dataLength={tradesHistory.length}
                        next={fetchMoreData}
                        hasMore={totalPage > page}
                        loader={
                            <div className='flex justify-center items-center bg-background/10 gap-1 m-3'>
                                <LoadingSpinner />
                                Loading more...
                            </div>
                        }
                    >
                        <div className='flex flex-col gap-4'>
                            {tradesHistory?.map(
                                (trade: ITrade, index: number) => (
                                    <Fragment key={index}>
                                        <HistoryListItem trade={trade} />
                                    </Fragment>
                                )
                            )}
                        </div>
                    </InfiniteScroll>
                </div>
            </div>
        </div>
    )
}

export default HistoryDrawer
