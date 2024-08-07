import React from 'react'
import { clsx } from 'clsx'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card.tsx'
import { PredictionMarket } from '@/types'

const PolyMarketCard: React.FC<{ poly: PredictionMarket }> = ({ poly }) => {
    return (
        <Card className={clsx('w-full shadow-sm', 'hover:shadow-lg')}>
            <CardHeader>
                <CardTitle className='flex gap-3 items-center h-[42px] min-h-[42px] max-h-[42px]'>
                    <div className='relative'>
                        <div className='w-[38px] min-w-[38px] h-[38px] rounded-[4px] opacity-100'>
                            <img
                                src={poly.icon}
                                alt={poly.title}
                                className='absolute inset-0 h-full w-full object-cover text-transparent rounded-[4px]'
                            />
                        </div>
                    </div>
                    <div className='flex-1 min-w-0 flex justify-between cursor-default'>
                        <a
                            href={`/event/${poly.id}`}
                            className='flex items-center min-w-0'
                        >
                            <p className='overflow-hidden cursor-pointer text-[16px] hover:underline'>
                                {poly.title}
                            </p>
                        </a>
                    </div>
                </CardTitle>
                <CardDescription></CardDescription>
            </CardHeader>
            <CardContent></CardContent>
            <CardFooter className='flex justify-between'></CardFooter>
        </Card>
    )
}

export default PolyMarketCard
