import React, { useState } from 'react'
import { Tooltip } from '@/components/ui/tooltip.tsx'
import { IconButton } from '@radix-ui/themes'
import { UpdateIcon } from '@radix-ui/react-icons'
import OutcomeEventList from '@/views/event/OutcomeEventList.tsx'
import { useEventContext } from '@/contexts/EventContext.tsx'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button.tsx'

const EventListLayout: React.FC = () => {
    const { events } = useEventContext()
    const [viewMore, setViewMore] = useState<boolean>(false)

    const onClickViewMore = () => {
        setViewMore((prevState) => !prevState)
    }

    return (
        <div className={`flex flex-col gap-3`}>
            <div
                className={`grid grid-cols-3 border-b-[1px] border-grey-200 p-1`}
            >
                <div>Outcome</div>
                <div className={`flex justify-center items-center gap-2`}>
                    % Chance
                    <Tooltip
                        trigger={
                            <IconButton>
                                <UpdateIcon width='15' height='15' />
                            </IconButton>
                        }
                        content={`Refresh`}
                    />
                </div>
            </div>
            <OutcomeEventList events={events} />
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
            {viewMore && <OutcomeEventList events={events} />}
        </div>
    )
}

export default EventListLayout
