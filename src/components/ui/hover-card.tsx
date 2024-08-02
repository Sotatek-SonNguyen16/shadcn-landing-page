import {clsx} from "clsx";
import React from "react";
import {HoverCard} from "@radix-ui/themes";
import {ChevronDown} from "lucide-react";


interface HoverCardProps<T extends string> {
    selected: T;
    options: T[];
    onSelect: (option: T) => void;
}

const HoverSelect = <T extends string, >(props: HoverCardProps<T>): React.ReactElement => {
    const {selected, options, onSelect} = props;
    return (
        <HoverCard.Root>
            <HoverCard.Trigger>
                <div className={`flex gap-4 items-center`}>
                    {`${selected}`} <ChevronDown width={15} height={15}/>
                </div>
            </HoverCard.Trigger>
            <HoverCard.Content size="2" maxWidth="280px">
                <div className={clsx("flex flex-col gap-4 p-4 cursor-pointer")}>
                    {options.map((option) => (
                        <div key={`${option}`} onClick={() => onSelect(option)}>{`${option}`}</div>
                    ))}
                </div>
            </HoverCard.Content>
        </HoverCard.Root>
    );
};

export {HoverSelect};