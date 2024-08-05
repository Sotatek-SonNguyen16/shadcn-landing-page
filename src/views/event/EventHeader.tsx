import React from 'react';
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import {clsx} from "clsx";
import {Link2Icon, LinkNone2Icon, RocketIcon, StarFilledIcon, StarIcon} from "@radix-ui/react-icons";

type IconVariant = 'cup' | 'star' | 'starFilled' | 'linkNone' | 'link'

type IconState = {
    [key in IconVariant]: JSX.Element;
};

const icons: IconState = {
    'cup': <RocketIcon/>,
    'star': <StarIcon width={20} height={20}/>,
    'starFilled': <StarFilledIcon width={20} height={20}/>,
    'linkNone': <LinkNone2Icon width={20} height={20}/>,
    'link': <Link2Icon width={20} height={20}/>,
}

const EventHeader: React.FC = () => {
    const src = 'https://polymarket.com/_next/image?url=https%3A%2F%2Fpolymarket-upload.s3.us-east-2.amazonaws.com%2Fpresidential-election-winner-2024-afdda358-219d-448a-abb5-ba4d14118d71.png&w=96&q=100'

    return (
        <div className={`flex gap-4 items-center border-b-[1px] border-gray-200 p-3`}>
            <AvatarPrimitive.Root
                className="relative inline-flex h-[72px] w-[72px]"
            >
                <AvatarPrimitive.Image
                    src={src}
                    alt="Avatar"
                    className={clsx(
                        "h-full w-full object-cover",
                        "rounded-full",
                    )}
                />
                <AvatarPrimitive.Fallback
                    className={clsx(
                        "flex h-full w-full items-center justify-center bg-white dark:bg-gray-800",
                        "rounded-full"
                    )}
                    delayMs={600}
                >
            <span className="text-sm font-medium uppercase text-gray-700 dark:text-gray-400">
              Kamala Harris
            </span>
                </AvatarPrimitive.Fallback>
            </AvatarPrimitive.Root>
            <div className={`flex-1 flex flex-col`}>
                <div className={`flex`}>
                    <div className={`flex-1 flex items-center gap-4`}>
                        <div>
                            {icons['cup']}
                        </div>
                        <div className="text-gray-400">$467,000,750 Bet
                        </div>
                        <div className="text-gray-400">Nov 4, 2024</div>
                    </div>
                    <div className={'flex gap-2 items-center'}>
                        {icons['star']}
                        {icons['linkNone']}
                    </div>
                </div>
                <div className={`flex items-center`}>
                    <div className={`flex-1 text-2xl font-bold`}>Presidential Election Winner 2024</div>
                    <div>Logo</div>
                </div>
            </div>
        </div>
    );
};

export default EventHeader;