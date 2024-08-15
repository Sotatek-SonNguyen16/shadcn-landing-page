import React from 'react'
import { Box, Tabs } from '@radix-ui/themes'
import { clsx } from 'clsx'

export interface Tab<T extends string> {
    title: string
    value: T
    content: React.ReactNode
}

interface TabsProps<T extends string> {
    active: T
    tabs: Tab<T>[]
    onClick: (value: T) => void
}

const UnderlineTabs = <T extends string>(props: TabsProps<T>) => {
    const { active, tabs, onClick: onClickTab } = props

    return (
        <Tabs.Root
            defaultValue={active}
            onValueChange={(value) => onClickTab(value as T)}
        >
            <Tabs.List color='indigo' className={clsx('')}>
                {tabs.map(({ title, value }) => (
                    <Tabs.Trigger
                        key={`tab-trigger-${value}`}
                        value={`${value}`}
                    >
                        <span className={clsx('p-3 font-semibold')}>
                            {title}
                        </span>
                    </Tabs.Trigger>
                ))}
            </Tabs.List>
            <Box pt='3'>
                {tabs.map(({ value, content }) => (
                    <Tabs.Content
                        key={`tab-content-${value}`}
                        value={`${value}`}
                    >
                        {content}
                    </Tabs.Content>
                ))}
            </Box>
        </Tabs.Root>
    )
}

export { UnderlineTabs }
