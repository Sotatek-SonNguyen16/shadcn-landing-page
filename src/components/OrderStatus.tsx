import React from 'react'
import { X } from 'lucide-react'
import { OrderStatus } from '@/types'

const COLOR: Record<OrderStatus, string> = {
    New: 'text-color-accent-red-900',
    Cancelled: 'text-color-accent-red-900',
    Accepted: 'text-color-accent-red-900',
    Filled: 'text-color-accent-green-900',
    Cancelling: 'text-color-accent-red-900',
    'Partially Filled': 'text-color-accent-red-900',
    Pending: 'text-color-accent-red-900',
    Rejected: 'text-color-accent-red-900'
}

const OrderStatusBadge: React.FC<{
    status: OrderStatus
    onClick: () => void
}> = ({ status, onClick }) => {
    return (
        <div
            className={`h-3 justify-center items-center gap-1 inline-flex ${status !== 'Filled' ? 'cursor-pointer' : ''}`}
            onClick={onClick}
        >
            {status !== 'Filled' && (
                <X size={12} className={`${COLOR[status]}`} />
            )}
            <div className='h-3 pb-px rounded-lg flex-col justify-center items-start inline-flex'>
                <div
                    className={`${COLOR[status]} self-stretch text-center text-xs font-normal leading-3`}
                >
                    {status !== 'Filled' ? 'Cancel' : 'Filled'}
                </div>
            </div>
        </div>
    )
}

export default OrderStatusBadge
