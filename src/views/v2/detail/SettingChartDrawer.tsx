import React from 'react'
import { ChevronLeft } from 'lucide-react'
import { Switch } from '@/components/ui/switch.tsx'
import { useDrawerContext } from '@/contexts/DrawerContext.tsx'

type SettingItem = {
    name: string
    checked: boolean
}

const SettingGroup: React.FC<{ name: string; items: SettingItem[] }> = ({
    name,
    items
}) => {
    const handleChecked = (checked: boolean) => {
        console.log(checked)
    }

    return (
        <div className='w-full flex-col justify-start items-start gap-2 inline-flex'>
            <div className='self-stretch h-4 rounded-lg flex-col justify-center items-start flex'>
                <div className='self-stretch text-color-neutral-500 text-xs font-light leading-none'>
                    {name}
                </div>
            </div>
            <div className='self-stretch flex-col justify-start items-start gap-2 flex'>
                {items.map(({ name, checked }) => (
                    <div
                        key={`menu-${name}`}
                        className='self-stretch rounded-lg justify-start items-center gap-2 inline-flex'
                    >
                        <div className='grow shrink basis-0 rounded-lg flex-col justify-center items-start inline-flex'>
                            <div className='self-stretch text-Neutral-900 text-sm font-light leading-tight'>
                                {name}
                            </div>
                        </div>
                        <div className='grow shrink basis-0 flex-col justify-center items-end inline-flex'>
                            <Switch
                                checked={checked}
                                onCheckedChange={handleChecked}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

const SplitLine = () => {
    return (
        <div className='w-full h-px flex-col justify-end items-center inline-flex'>
            <div className='self-stretch h-px border border-color-neutral-100'></div>
        </div>
    )
}

const SettingChartDrawer: React.FC = () => {
    const { closeDrawer } = useDrawerContext()

    return (
        <div className='flex flex-col gap-4 px-4 h-full'>
            <div className='w-full h-10 grid grid-cols-7 items-center gap-1'>
                <div className='py-0.5 flex-col justify-start items-start gap-2 inline-flex'>
                    <div className='self-stretch rounded-lg justify-start items-center inline-flex'>
                        <ChevronLeft
                            size={20}
                            className='cursor-pointer'
                            onClick={closeDrawer}
                        />
                    </div>
                </div>
                <div className='grow shrink basis-0 flex-col justify-center items-center inline-flex col-span-5'>
                    <div className='self-stretch rounded-lg justify-center items-start gap-2 inline-flex'>
                        <div className='grow shrink basis-0 rounded-lg flex-col justify-center items-start inline-flex'>
                            <div className='self-stretch text-center text-color-neutral-900 text-base font-normal leading-normal'>
                                Chart Settings
                            </div>
                        </div>
                    </div>
                </div>
                <div className='py-0.5' />
            </div>
            <SettingGroup
                name='Outcomes'
                items={[
                    { name: 'Yes', checked: true },
                    { name: 'No', checked: false }
                ]}
            />
            <SplitLine />
            <SettingGroup
                name='Display'
                items={[
                    { name: 'X-Axis', checked: true },
                    { name: 'Y-Axis', checked: true },
                    { name: 'Horizontal Grid', checked: true },
                    { name: 'Vertical Grid', checked: false },
                    { name: 'Decimals', checked: false }
                ]}
            />
            <SplitLine />
            <SettingGroup
                name='Interactivity'
                items={[
                    { name: 'Autoscale', checked: true },
                    { name: 'Tooltip', checked: true },
                    { name: 'Zoom', checked: true }
                ]}
            />
        </div>
    )
}

export default SettingChartDrawer
