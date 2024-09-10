import React, { forwardRef, Fragment } from 'react'
import { Package } from 'lucide-react'
import useEmblaCarousel from 'embla-carousel-react'
import { useMiniAppContext } from '@/contexts/MiniAppContext.tsx'

type Category = {
    name: string
}

const MarketCategoryItem: React.FC<{ category: Category }> = ({ category }) => {
    const { showComingSoon } = useMiniAppContext()

    return (
        <div className='h-20 min-w-36 w-full px-3 pt-1 pb-2 bg-white/10 rounded-lg flex-col justify-start items-start gap-1 inline-flex cursor-default'>
            <div className='self-stretch rounded-lg justify-end items-center inline-flex'>
                <div className='w-10 h-10 relative'>
                    <Package size={40} />
                </div>
            </div>
            <div className='self-stretch h-5 rounded-lg flex-col justify-center items-start flex'>
                <div
                    className='self-stretch text-white text-sm font-normal leading-tight cursor-pointer'
                    onClick={showComingSoon}
                >
                    {category.name}
                </div>
            </div>
        </div>
    )
}

const CATEGORIES: Category[] = [
    { name: 'Politics' },
    { name: 'Olympic' },
    { name: 'Pop Culture' },
    { name: 'Sports' },
    { name: 'Business' },
    { name: 'Science' }
]

type DivProps = React.HTMLProps<HTMLDivElement>

const Embla: React.FC<DivProps> = ({ children }) => {
    return <section className='w-full mx-auto'>{children}</section>
}

const EmblaViewport = forwardRef<HTMLDivElement, DivProps>(
    ({ children = true }, ref) => {
        return (
            <div className='overflow-hidden' ref={ref}>
                {children}
            </div>
        )
    }
)

const EmblaContainer: React.FC<DivProps> = ({ children }) => {
    return (
        <div className='grid grid-flow-col grid-rows-2 gap-2 touch-pan-y touch-pinch-zoom'>
            {children}
        </div>
    )
}

const MarketCategories: React.FC = () => {
    const [emblaRef] = useEmblaCarousel({ dragFree: true })

    return (
        <Embla>
            <EmblaViewport ref={emblaRef}>
                <EmblaContainer>
                    {CATEGORIES.map((category, index) => (
                        <Fragment key={index}>
                            <MarketCategoryItem category={category} />
                        </Fragment>
                    ))}
                </EmblaContainer>
            </EmblaViewport>
        </Embla>
    )
}

export default MarketCategories
