import React from 'react';
import {clsx} from "clsx";
import {Badge} from "@/components/ui/badge.tsx";
import {Order} from "@/types";

interface EventTradeBarProps {
    variant: 'success' | 'accent'
    data: Order[] | undefined,
    total: string,
}

const EventTradeBar: React.FC<EventTradeBarProps> = (props) => {
    const {variant, data, total} = props
    const formatterEuro = new Intl.NumberFormat('default', {
        style: 'currency',
        currency: 'EUR',
    });

    const formatterUSD = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    return (
        <div className={clsx(
            "flex",
            {
                "flex-col": variant === 'accent',
                "flex-col-reverse": variant === 'success'
            }
        )}>
            {data && data.filter((_, index) => index >= data.length - 6).map(({size, price}, index) => (
                <div
                    key={`${price}-${index}`}
                    className={clsx(
                        "group grid grid-cols-5",
                        {
                            "hover:bg-green-100": variant === 'success',
                            "hover:bg-red-100": variant === 'accent'
                        }
                    )}>
                    <div className={clsx(
                        'col-span-2',
                        `w-[30px] flex items-center ps-3`,
                        {
                            "bg-green-100 group-hover:bg-green-200": variant === 'success',
                            "bg-red-100 group-hover:bg-red-200": variant === 'accent'
                        }
                    )}>
                        {index === data.length - 1 &&
                            <Badge variant={`${variant}Solid`}>{variant === 'accent' ? "Asks" : "Bids"}</Badge>}
                    </div>
                    <div className={clsx(
                        "text-center font-semibold py-2",
                        {
                            "text-green-500": variant === 'success',
                            "text-orange-500": variant === 'accent'
                        }
                    )}>
                        {formatterEuro.format(+price)}
                    </div>
                    <div className="text-center font-semibold text-gray-600 py-2">
                        {formatterUSD.format(+size)}
                    </div>
                    <div className="text-center font-semibold text-gray-600 py-2">
                        {formatterUSD.format(+total)}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default EventTradeBar;