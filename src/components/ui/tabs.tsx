import React from "react";
import {Box, Tabs} from "@radix-ui/themes";
import {clsx} from "clsx";

export interface Tab<T extends string> {
    title: string;
    value: T;
    content: React.ReactNode;
}

interface TabsProps<T extends string> {
    tabs: Tab<T>[];
    onClick: (value: T) => void;
}

const UnderlineTabs = <T extends string, >(props: TabsProps<T>) => {
    const {tabs, onClick: onClickTab} = props;

    return (
        <Tabs.Root defaultValue={tabs.length > 0 ? `${tabs[0].value}` : undefined}>
            <Tabs.List color="indigo" className={clsx("")}>
                {tabs.map(({title, value}) => (
                    <Tabs.Trigger
                        key={`tab-trigger-${value}`}
                        value={`${value}`}
                        onClick={() => onClickTab(value)}
                    >
                        <span className={clsx("p-3 font-semibold")}>

                        {title}
                        </span>
                    </Tabs.Trigger>
                ))}
            </Tabs.List>
            <Box pt="3">
                {tabs.map(({value, content}) => (
                    <Tabs.Content
                        key={`tab-content-${value}`}
                        value={`${value}`}>
                        {content}
                    </Tabs.Content>
                ))}
            </Box>
        </Tabs.Root>
    );
};

export {UnderlineTabs};