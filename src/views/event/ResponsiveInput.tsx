import React, { useEffect, useRef, useState } from 'react'
import { clsx } from 'clsx'

const ResponsiveInput: React.FC<{
    className?: string
    value: string
    name: 'amount' | 'size'
    focus: 'amount' | 'size' | 'none'
    onFocus: (value: 'amount' | 'size' | 'none') => void
}> = ({ value, focus, onFocus, name, className }) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const [inputWidth, setInputWidth] = useState<number>(48)

    useEffect(() => {
        const span = document.createElement('span')
        span.style.position = 'absolute'
        span.style.whiteSpace = 'nowrap'
        span.style.visibility = 'hidden'
        span.style.fontSize = window.getComputedStyle(
            inputRef.current!
        ).fontSize
        span.style.fontFamily = window.getComputedStyle(
            inputRef.current!
        ).fontFamily
        span.style.padding = window.getComputedStyle(inputRef.current!).padding

        span.textContent = value || inputRef.current?.placeholder || '0'
        document.body.appendChild(span)

        setInputWidth(span.offsetWidth + 8)

        document.body.removeChild(span)

        if (inputRef.current) {
            inputRef.current.scrollLeft = inputRef.current.scrollWidth
        }
    }, [value])

    return (
        <div
            className='relative inline-flex items-center'
            style={{ maxWidth: '50vw', overflow: 'hidden' }}
            onFocus={() => {
                if (name !== focus) {
                    onFocus(name)
                }
            }}
        >
            <input
                type='string'
                value={value}
                readOnly={true}
                autoFocus={true}
                placeholder='0'
                ref={inputRef}
                className={clsx(
                    'text-end bg-transparent outline-none caret-transparent',
                    className
                )}
                style={{
                    maxWidth: '100%',
                    width: `${inputWidth}px`,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    direction: 'ltr'
                }}
            />
            {focus === name && (
                <div
                    className={clsx(
                        'absolute w-[2px] h-full bg-color-brand-500 animate-blink',
                        'right-0 top-1/2 -translate-y-1/2'
                    )}
                />
            )}
        </div>
    )
}

export default ResponsiveInput
