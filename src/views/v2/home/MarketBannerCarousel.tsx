import React from 'react'
import { EmblaOptionsType } from 'embla-carousel'
import EmblaCarousel from '@/components/EmblaCarousel.tsx'
import { clsx } from 'clsx'
import { BrandMask } from '@/components/icon.tsx'

const OPTIONS: EmblaOptionsType = { containScroll: false }

type Banner = {
    title: string
    color: string
}

const SLIDES: Banner[] = [
    {
        title: '2024 Presidential Election',
        color: 'from-[#b6e056] to-[#e0de88]'
    },
    { title: '2024 Election Forecast', color: 'from-[#AA9EF8] to-[#A5B4F3]' }
]

const MarketBanner: React.FC<{ banner: Banner }> = ({ banner }) => {
    return (
        <div
            className={clsx(
                'w-full h-[164px] px-6 py-6 rounded-2xl flex-col justify-center items-start gap-4 inline-flex relative',
                'bg-gradient-to-r ' + banner.color
            )}
        >
            <div className='absolute overflow-hidden right-0'>
                <BrandMask />
            </div>
            <div className='w-20 text-[#010212] text-xl font-semibold leading-norma text-wrap'>
                {banner.title}
            </div>
            <div className='h-7 px-2.5 py-1 bg-color-neutral-900 rounded-md justify-center items-center gap-1 inline-flex cursor-pointer'>
                <div className='pb-0.5 rounded-lg flex-col justify-center items-center inline-flex'>
                    <div className='self-stretch text-center text-color-neutral-alpha-900 text-xs font-semibold leading-none'>
                        Discover
                    </div>
                </div>
            </div>
        </div>
    )
}

const MarketBannerCarousel: React.FC = () => {
    return (
        <EmblaCarousel<Banner>
            slides={SLIDES}
            options={OPTIONS}
            render={(value) => <MarketBanner banner={value} />}
        />
    )
}

export default MarketBannerCarousel
