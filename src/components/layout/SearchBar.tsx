import React, { ChangeEvent, FocusEvent, useState } from 'react'
import { clsx } from 'clsx'
import { Search, X } from 'lucide-react'

const SuggestResultItem = () => {
    const src =
        'https://polymarket.com/_next/image?url=https%3A%2F%2Fpolymarket-upload.s3.us-east-2.amazonaws.com%2Fstarmer-out-before-october-4wy0FnlVhTBe.jpg&w=96&q=100'
    return (
        <div className='hover:bg-gray-200 dark:hover:bg-gray-600 p-2 rounded'>
            <div className='flex gap-3 items-center h-[42px] min-h-[42px] max-h-[42px]'>
                <div className='relative'>
                    <div className='w-[38px] min-w-[38px] h-[38px] rounded-[4px] opacity-100'>
                        <img
                            src={src}
                            alt=''
                            className='absolute inset-0 h-full w-full object-cover text-transparent rounded-full'
                        />
                    </div>
                </div>
                <div className='flex-1 min-w-0 flex justify-between cursor-default'>
                    <a href={`/event/`} className='flex items-center min-w-0'>
                        <p className='overflow-hidden cursor-pointer text-[16px]'>
                            Keir Starmer out as UK PM before October?
                        </p>
                    </a>
                </div>
            </div>
        </div>
    )
}

const SearchBar: React.FC = () => {
    const [term, setTerm] = useState<string>('')
    const [isFocused, setIsFocused] = useState<boolean>(false)
    const [openSuggest, setOpenSuggest] = useState<boolean>(false)

    const handleChangeTerm = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        setTerm(value)
    }

    const handleFocus = () => {
        setIsFocused(true)
        setOpenSuggest(true)
    }

    const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
        if (event.target.value === '') {
            setIsFocused(false)
        }
        setOpenSuggest(false)
    }

    return (
        <div className={clsx('w-full h-auto relative', 'flex items-center')}>
            <Search
                className='absolute left-4 cursor-pointer'
                width={15}
                height={15}
            />
            <input
                className={clsx(
                    'w-full h-[30px] ps-10 py-5',
                    'bg-white border-[1px] border-gray-200 rounded-xl',
                    'hover:bg-gray-100',
                    'focus:border-gray-100',
                    'dark:bg-background dark:hover:bg-gray-800',
                    { 'focus:outline-none': isFocused }
                )}
                value={term}
                onChange={handleChangeTerm}
                onFocus={handleFocus}
                onBlur={handleBlur}
            />
            <X
                className={clsx('absolute right-4 cursor-pointer', {
                    block: isFocused && term !== '',
                    hidden: !isFocused || term === ''
                })}
                width={15}
                height={15}
                onClick={() => setTerm('')}
            />
            {openSuggest && (
                <div
                    className={clsx(
                        'absolute top-12',
                        'w-full h-auto px-3 py-3',
                        'bg-white border-[1px] border-gray-200 rounded-xl',
                        'dark:bg-gray-800'
                    )}
                >
                    <div className='uppercase text-gray-400 font-semibold text-[12px] py-1'>
                        Results
                    </div>
                    <SuggestResultItem />
                    <SuggestResultItem />
                    <SuggestResultItem />
                </div>
            )}
        </div>
    )
}

export default SearchBar
