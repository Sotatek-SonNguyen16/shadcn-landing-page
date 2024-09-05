import React, { Fragment, useEffect, useMemo, useState } from 'react'
import CheckboxGroup from '@/components/CheckBoxGroup.tsx'
import DrawerProvider, { useDrawerContext } from '@/contexts/DrawerContext.tsx'
import { ChevronDown, Search } from 'lucide-react'
import { ActiveOrder, ESide, MarketDetail, MyActiveOrder } from '@/types'
import { Button } from '@/components/ui/button.tsx'
import { usePortfolioContext } from '@/contexts/PortfolioContext.tsx'
import { formatToCents, formatUnixTime } from '@/lib/utils.ts'
import OrderStatusBadge from '@/components/OrderStatus.tsx'
import { useNavigate } from 'react-router-dom'

const SortByDrawerContent = () => {
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
                <div className='col-span-2 py-0.5 flex justify-end' />
            </div>
            <CheckboxGroup
                name='Sort by'
                items={[
                    { name: 'Market', value: 'Market' },
                    { name: 'Filled quantity', value: 'Filled' },
                    { name: 'Total quantity', value: 'Total' },
                    { name: 'Order date', value: 'Order' },
                    { name: 'Resolving Soonest', value: 'Resolving' }
                ]}
            />
        </div>
    )
}

const OpenOrdersFilter = () => {
    const { openDrawer } = useDrawerContext()

    const onClickSearchByButton = () => {
        openDrawer({
            background: 'bg-color-neutral-alpha-700',
            content: <SortByDrawerContent />
        })
    }

    const onClickSearch = () => {
        openDrawer({
            background: 'bg-color-neutral-alpha-900',
            content: <MarketSearchDrawer />
        })
    }

    return (
        <div className='w-full rounded-lg justify-start items-center gap-4 inline-flex'>
            <div className='grow shrink basis-0 h-4 rounded-lg justify-start items-center gap-1 flex'>
                <div className='rounded-lg flex-col justify-center items-start inline-flex'>
                    <div className='self-stretch text-color-neutral-500 text-xs font-light leading-3'>
                        Sort by
                    </div>
                </div>
                <div
                    className='rounded-lg justify-start items-center gap-0.5 flex cursor-pointer'
                    onClick={onClickSearchByButton}
                >
                    <div className='rounded-lg flex-col justify-center items-start inline-flex'>
                        <div className='self-stretch text-color-neutral-900 text-xs font-light leading-none'>
                            Market
                        </div>
                    </div>
                    <div className='rounded-lg justify-center items-center flex'>
                        <ChevronDown size={12} />
                    </div>
                </div>
            </div>
            <Button
                variant={'transparent'}
                size={'icon'}
                onClick={onClickSearch}
            >
                <Search size={20} />
            </Button>
        </div>
    )
}

const MarketSearchDrawer: React.FC = () => {
    const { myActiveOrders } = usePortfolioContext()
    const [filteredMyActiveOrders, setFilteredMyActiveOrders] = useState<
        MyActiveOrder[]
    >([])
    const [searchTerm, setSearchTerm] = useState<string>('')
    useEffect(() => {
        if (searchTerm !== '') {
            setFilteredMyActiveOrders(
                myActiveOrders?.filter((myActiveOrder) =>
                    myActiveOrder?.marketDetail?.question
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                ) ?? []
            )
        } else {
            setFilteredMyActiveOrders([])
        }
    }, [searchTerm])

    const onClickCancelButton = () => {
        setSearchTerm('')
    }

    return (
        <div className='p-4 bg-color-neutral-alpha-90 h-full'>
            <div className='flex flex-wrap items-center justify-between gap-2 mb-4 relative'>
                <input
                    className='ps-10 flex-1 w-full bg-color-neutral-50 p-2.5 rounded-lg'
                    placeholder='Search order...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search size={20} className='absolute ms-3' />
                <div className='h-4 pb-0.5 rounded-lg flex-col justify-center items-start inline-flex'>
                    <div
                        className='self-stretch text-center text-color-brand-500 text-sm font-normal leading-tight cursor-pointer'
                        onClick={onClickCancelButton}
                    >
                        Cancel
                    </div>
                </div>
            </div>
            <div className='w-full h-[calc(100vh-124px)] overflow-y-scroll scrollbar-hidden flex flex-col gap-4'>
                {filteredMyActiveOrders?.map((myAO) => (
                    <Fragment key={myAO.activeOrder.assetId}>
                        {myAO.marketDetail && (
                            <OpenOrdersListItem
                                marketDetail={myAO.marketDetail}
                                activeOrder={myAO.activeOrder}
                            />
                        )}
                    </Fragment>
                ))}
            </div>
        </div>
    )
}

const OpenOrdersListItem: React.FC<{
    activeOrder: ActiveOrder
    marketDetail: MarketDetail
}> = ({ activeOrder, marketDetail }) => {
    const {
        size,
        price,
        side,
        assetId,
        sizeMatched,
        status,
        createdAt,
        orderId
    } = activeOrder
    const { icon, question, clobTokenIds, eventId } = marketDetail
    const { handleCancelActiveOrder } = usePortfolioContext()
    const navigate = useNavigate()

    const formatterUSD = useMemo(
        () =>
            new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 5
            }),
        []
    )

    const goToDetailEvent = (id: string) => {
        navigate(`/v2/event/${id}`)
    }

    return (
        <div className='w-full rounded-xl bg-color-neutral-50 flex flex-col p-3 gap-3'>
            <div className='w-full rounded-lg justify-start items-center gap-3 inline-flex'>
                <div className='relative'>
                    <div className='size-12 rounded-[0.375rem] opacity-100'>
                        <img
                            src={icon}
                            alt={question}
                            className='absolute inset-0 h-full w-full object-cover text-transparent rounded-[0.375rem]'
                        />
                    </div>
                </div>
                <div className='grow shrink basis-0 flex-col justify-start items-start inline-flex'>
                    <div
                        className='self-stretch min-h-6 rounded-lg flex-col justify-center items-start flex cursor-pointer'
                        onClick={() => goToDetailEvent(eventId)}
                    >
                        <div className='w-[calc(100vw-183px)] text-color-neutral-900 text-sm font-normal leading-tight text-nowrap truncate'>
                            {question}
                        </div>
                    </div>
                    <div className='rounded-lg justify-start items-center gap-1 inline-flex flex-wrap'>
                        {side === ESide.BUY ? (
                            <div className='text-color-accent-green-900 text-xs font-light leading-3'>
                                Buy
                            </div>
                        ) : (
                            <div className='text-color-accent-red-900 text-xs font-light leading-3'>
                                Sell
                            </div>
                        )}
                        <div className='text-color-neutral-800 text-xs font-light leading-3'>
                            {clobTokenIds.indexOf(assetId) === 0 ? 'Yes' : 'No'}
                        </div>
                        <div className='text-color-neutral-500 text-xs font-light leading-3'>
                            {formatUnixTime(createdAt)}
                        </div>
                    </div>
                </div>
                <OrderStatusBadge
                    status={status}
                    onClick={() => {
                        handleCancelActiveOrder([orderId])
                    }}
                />
            </div>
            <div className='h-px border border-dashed border-color-neutral-100' />

            <div className='flex justify-between items-center'>
                <div className='flex flex-col'>
                    <div className='rounded-lg justify-start items-center gap-1 inline-flex flex-wrap'>
                        <div className='text-color-neutral-500 text-xs font-light leading-3'>
                            Total amount:
                        </div>
                        <div className='text-color-neutral-800 text-xs font-light leading-3'>
                            {formatterUSD.format(Number(price) * Number(size))}
                        </div>
                    </div>
                    <div className='rounded-lg justify-start items-center gap-1 inline-flex flex-wrap'>
                        <div className='text-color-neutral-500 text-xs font-light leading-3'>
                            Price:
                        </div>
                        <div className='text-color-neutral-800 text-xs font-light leading-3'>
                            {formatToCents(price)}
                        </div>
                    </div>
                </div>
                <div className='h-8 rounded-lg flex-col justify-center items-end inline-flex'>
                    <div className='self-stretch rounded-lg justify-end items-baseline gap-1 inline-flex'>
                        <div className='text-color-neutral-900 text-sm font-normal leading-tight'>
                            {sizeMatched}/{size}
                        </div>
                        <div className='text-color-neutral-900 text-xs font-light leading-3'>
                            filled
                        </div>
                    </div>
                    <div className='rounded-lg flex-col justify-center items-start flex'>
                        <div className='self-stretch text-color-neutral-500 text-xs font-light leading-3'>
                            Until Cancelled
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const PortfolioOpenOrdersContent: React.FC = () => {
    const { myActiveOrders } = usePortfolioContext()

    return (
        <div className='max-h-[70vh] flex flex-col gap-4 my-4 relative'>
            <DrawerProvider>
                <OpenOrdersFilter />
            </DrawerProvider>
            <div className='overflow-y-scroll scrollbar-hidden min-h-[50vh] flex flex-col gap-4'>
                {myActiveOrders?.map((myAO) => (
                    <Fragment key={myAO.activeOrder.assetId}>
                        {myAO.marketDetail && (
                            <OpenOrdersListItem
                                marketDetail={myAO.marketDetail}
                                activeOrder={myAO.activeOrder}
                            />
                        )}
                    </Fragment>
                ))}
            </div>
        </div>
    )
}

export default PortfolioOpenOrdersContent
