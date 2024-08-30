import React from 'react'
import MarketDescription from '@/views/event/MarketDescription.tsx'
import { useEventContext } from '@/contexts/EventContext.tsx'

const MarketEventRule: React.FC = () => {
    const { market } = useEventContext()
    return (
        <div className='w-100 flex flex-col gap-4'>
            <div className='flex flex-col gap-2.5'>
                <div className='text-color-neutral-500 text-xs font-light leading-none'>
                    RULE
                </div>
                <MarketDescription content={market?.description || ''} />
            </div>
        </div>
    )
}

export default MarketEventRule
