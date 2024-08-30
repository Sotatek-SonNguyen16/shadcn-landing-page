import React from 'react'

const MoreActionsDrawer: React.FC = () => {
    return (
        <div className='w-full px-4 pt-7 backdrop-blur-2xl flex-col justify-start items-center gap-4 inline-flex'>
            <div className='w-full flex-col justify-start items-start gap-2 inline-flex'>
                <div className='self-stretch h-4 rounded-lg flex-col justify-center items-start flex'>
                    <div className='self-stretch text-color-neutral-500 text-xs font-light leading-none'>
                        More Actions
                    </div>
                </div>
                <div className='self-stretch h-52 flex-col justify-start items-center flex'>
                    <div className='self-stretch py-4 border-b border-color-neutral-50 justify-start items-center gap-1 inline-flex'>
                        <div className='h-5 pb-0.5 rounded-lg flex-col justify-center items-start inline-flex'>
                            <div className='self-stretch text-center text-color-neutral-900 text-base font-normal leading-normal'>
                                Merge shares
                            </div>
                        </div>
                    </div>
                    <div className='self-stretch py-4 border-b border-color-neutral-50 justify-start items-center gap-1 inline-flex'>
                        <div className='h-5 pb-0.5 rounded-lg flex-col justify-center items-start inline-flex'>
                            <div className='self-stretch text-center text-color-neutral-900 text-base font-normal leading-normal'>
                                Split shares
                            </div>
                        </div>
                    </div>
                    <div className='self-stretch py-4 border-b border-color-neutral-50 justify-start items-center gap-1 inline-flex'>
                        <div className='h-5 pb-0.5 rounded-lg flex-col justify-center items-start inline-flex'>
                            <div className='self-stretch text-center text-color-neutral-250 text-base font-normal leading-normal'>
                                Buy shares
                            </div>
                        </div>
                    </div>
                    <div className='self-stretch py-4 border-b border-color-neutral-50 justify-start items-center gap-1 inline-flex'>
                        <div className='h-5 pb-0.5 rounded-lg flex-col justify-center items-start inline-flex'>
                            <div className='self-stretch text-center text-color-neutral-250 text-base font-normal leading-normal'>
                                Sell shares
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MoreActionsDrawer
