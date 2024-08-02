import React from 'react';
import {clsx} from "clsx";
import {Badge} from "@/components/ui/badge.tsx";

interface EventTradeBarProps {
    variant: 'success' | 'accent'
}

const EventTradeBar: React.FC<EventTradeBarProps> = (props) => {
    const {variant} = props

    return (
        <div className={clsx(
            "group grid grid-cols-5",
            {
                "hover:bg-green-100": variant === 'success',
                "hover:bg-red-100": variant === 'accent'
            }
        )}>
            <div className={clsx(
                'col-span-2',
                'w-[30px] flex items-center ps-3',
                {
                    "bg-green-100 group-hover:bg-green-200": variant === 'success',
                    "bg-red-100 group-hover:bg-red-200": variant === 'accent'
                }
            )}>
                <Badge variant={`${variant}Solid`}>Asks</Badge>
            </div>
            <div className={clsx(
                "text-center font-semibold py-2",
                {
                    "text-green-500": variant === 'success',
                    "text-orange-500": variant === 'accent'
                }
            )}>
                60#
            </div>
            <div className="text-center font-semibold text-gray-600 py-2">
                57,054.83
            </div>
            <div className="text-center font-semibold text-gray-600 py-2">
                $512,473.89
            </div>
        </div>
    );
};

export default EventTradeBar;