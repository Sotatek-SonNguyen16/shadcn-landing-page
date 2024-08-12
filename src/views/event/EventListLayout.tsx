import React, { useMemo, useState } from 'react'
import { Tooltip } from '@/components/ui/tooltip.tsx'
import { UpdateIcon } from '@radix-ui/react-icons'
import OutcomeEventList from '@/views/event/OutcomeEventList.tsx'
import { useEventContext } from '@/contexts/EventContext.tsx'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button.tsx'
import MarketDescription from '@/views/event/MarketDescription.tsx'

const EventListLayout: React.FC = () => {
    const { market } = useEventContext()
    const [viewMore, setViewMore] = useState<boolean>(false)
    const onClickViewMore = () => {
        setViewMore((prevState) => !prevState)
    }

    const sortedMarkets = useMemo(
        () =>
            market?.markets.sort(
                (a, b) =>
                    Number(b.outcomePrices[0]) - Number(a.outcomePrices[0])
            ) || [],
        [market?.markets]
    )

    return (
        <div className={`flex flex-col gap-3`}>
            <div
                className={`grid grid-cols-4 lg:grid-cols-7 border-b-[1px] border-grey-200 p-1 items-center text-[10px] uppercase text-gray-500`}
            >
                <div className='col-span-3'>Outcome</div>
                <div
                    className={`inline-flex justify-center items-center gap-2`}
                >
                    <p className='text-nowrap'>% Chance</p>
                    <Tooltip
                        trigger={
                            <Button size={`icon`} variant={`outline`}>
                                <UpdateIcon width='10' height='10' />
                            </Button>
                        }
                        content={`Refresh`}
                    />
                </div>
            </div>
            <OutcomeEventList events={sortedMarkets.slice(0, 3)} />
            <div className={`flex`}>
                <Button
                    variant={`secondary`}
                    size={`sm`}
                    className={`flex items-center gap-1`}
                    onClick={onClickViewMore}
                >
                    View more{' '}
                    {viewMore ? (
                        <ChevronUp height={18} width={18} />
                    ) : (
                        <ChevronDown height={18} width={18} />
                    )}
                </Button>
            </div>
            {viewMore && <OutcomeEventList events={sortedMarkets.slice(3)} />}
            <div>
                <div className='text-xl font-semibold border-b-[1px] border-gray-100'>
                    Rules
                </div>
                <MarketDescription content={market?.description || ''} />
            </div>
        </div>
    )
}

export default EventListLayout
