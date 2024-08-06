import React, { useEffect, useRef, useState } from 'react'
import { clsx } from 'clsx'

const ScrollHiddenNavTab: React.FC = () => {
    const [isVisible, setIsVisible] = useState(true)
    const lastScrollTop = useRef<number>(0)

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollTop = window.scrollY
            if (currentScrollTop > lastScrollTop.current) {
                setIsVisible(false)
            } else {
                setIsVisible(true)
            }
            lastScrollTop.current = currentScrollTop
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <div
            className={clsx(
                'fixed bottom-0 left-0 w-full transition-transform',
                {
                    'transform translate-y-full': !isVisible,
                    'transform translate-y-0': isVisible
                }
            )}
        >
            <div className='bg-background p-4 border-t-[1px] border-gray-200 shadow-lg'>
                This is a scroll-hide component!
            </div>
        </div>
    )
}

export default ScrollHiddenNavTab
