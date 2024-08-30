import React from 'react'
import { RefreshCcw } from 'lucide-react'
import SettingGroup from '@/components/SettingGroup.tsx'
import CheckboxGroup from '@/components/CheckBoxGroup.tsx'

const SplitLine = () => {
    return (
        <div className='w-full h-px flex-col justify-end items-center inline-flex'>
            <div className='self-stretch h-px border border-color-neutral-100'></div>
        </div>
    )
}

const MarketFilterDrawer: React.FC = () => {
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
                    <div className='w-fit justify-center items-center gap-2 inline-flex cursor-pointer'>
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
            <SettingGroup
                name='Status'
                single={true}
                items={[
                    { name: 'All', value: 'all' },
                    { name: 'Live', value: 'live' },
                    { name: 'Resolved', value: 'resolved' }
                ]}
            />
            <SplitLine />
            <CheckboxGroup
                name='Sort by'
                items={[
                    { name: 'Top', value: 'true' },
                    {
                        name: 'Newest',
                        value: 'newest'
                    },
                    { name: 'Volume', value: 'volume' },
                    { name: 'Liquidity', value: 'liquidity' },
                    { name: 'Ending', value: 'ending' }
                ]}
            />
            <SplitLine />
            <SettingGroup
                name='Categories'
                single={false}
                items={[
                    { name: 'All', value: 'all' },
                    { name: 'Politics', value: 'politics' },
                    { name: 'Olympic', value: 'true' },
                    { name: 'Pop Culture', value: 'pop' },
                    { name: 'Sports', value: 'sports' },
                    { name: 'Business', value: 'business' },
                    { name: 'Science', value: 'science' }
                ]}
            />
        </div>
    )
}

export default MarketFilterDrawer
