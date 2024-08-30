import React from 'react'
import { clsx } from 'clsx'

const NotMatch: React.FC = () => {
    return (
        <div
            className={clsx(
                'bg-gradient-to-b from-brand01/40 via-brand02/20 to-30% h-screen',
                'w-full flex flex-col',
                'py-4 gap-4'
            )}
        >
            <div className='w-full h-[25%] flex justify-center items-center'>
                <h1>Not found this page</h1>
            </div>
        </div>
    )
}

export default NotMatch
