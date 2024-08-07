import React, { useMemo, useState } from 'react'
import { Tooltip } from '@/components/ui/tooltip.tsx'
import { UpdateIcon } from '@radix-ui/react-icons'
import OutcomeEventList from '@/views/event/OutcomeEventList.tsx'
import { useEventContext } from '@/contexts/EventContext.tsx'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button.tsx'

const MarketDescription: React.FC<{ content: string }> = ({ content }) => {
    const lines = content.split('\n').map((_line, index) => (
        <React.Fragment key={index}>
            {_line}
            <br />
        </React.Fragment>
    ))

    return <div>{lines}</div>
}

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
                className={`grid grid-cols-7 border-b-[1px] border-grey-200 p-1 items-center`}
            >
                <div className='col-span-3'>Outcome</div>
                <div
                    className={`inline-flex justify-center items-center gap-2`}
                >
                    <p className='text-nowrap'>% Chance</p>
                    <Tooltip
                        trigger={
                            <Button size={`sm`} variant={`outline`}>
                                <UpdateIcon width='15' height='15' />
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
