import React, { useMemo } from 'react'
import { clsx } from 'clsx'
import { Button } from '@/components/ui/button.tsx'
import { Info, Minus, Plus, RefreshCcw, Settings } from 'lucide-react'
import { Checkbox, DataList, IconButton } from '@radix-ui/themes'
import { useEventContext } from '@/contexts/EventContext.tsx'
import { EBetOption, EFormType } from '@/types'

const SellForm: React.FC = () => {
    const { formType, betOption, changeBetOption, currentMarket } =
        useEventContext()

    const outcomes: string[2] = useMemo(() => {
        if (typeof currentMarket?.outcomes === 'string') {
            return JSON.parse(currentMarket.outcomes)
        }
        return ['Yes', 'No']
        // return currentMarket?.outcomes
    }, [currentMarket?.outcomes])

    const outcomePrices: string[2] = useMemo(() => {
        if (typeof currentMarket?.outcomePrices === 'string') {
            return JSON.parse(currentMarket.outcomePrices)
        }
        return ['0.44', '0.55']
        // return currentMarket?.outcomePrices
    }, [currentMarket?.outcomePrices])

    const formatterEuro = useMemo(
        () =>
            new Intl.NumberFormat('default', {
                style: 'currency',
                currency: 'EUR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            }),
        []
    )

    const formFields = {
        [EFormType.MARKET]: (
            <>
                <div className={`mb-3`}>
                    <div>
                        <div className={`mb-2 font-semibold`}>Shares</div>
                        <div
                            className={`flex justify-around px-3 py-2 border border-gray-300 rounded-lg`}
                        >
                            <IconButton>
                                <Minus width={15} height={15} />
                            </IconButton>
                            <input
                                className={clsx(
                                    'text-center',
                                    'border-none outline-none',
                                    'focus:outline-none'
                                )}
                                placeholder={`$0`}
                            />
                            <IconButton>
                                <Plus width={15} height={15} />
                            </IconButton>
                        </div>
                    </div>
                </div>
                <div className={'flex mb-3'}>
                    <Button className={`flex-1`} variant={`primary`}>
                        Login
                    </Button>
                </div>
                <div>
                    <DataList.Root>
                        <DataList.Item align='center'>
                            <DataList.Label minWidth='88px'>
                                Avg price
                            </DataList.Label>
                            <DataList.Value>
                                <div
                                    className={`w-full text-end text-blue-500`}
                                >
                                    <span
                                        className={`border-dotted border-b-2 border-sky-500 cursor-pointer`}
                                    >
                                        0.0#
                                    </span>
                                </div>
                            </DataList.Value>
                        </DataList.Item>
                        <DataList.Item align='center'>
                            <DataList.Label minWidth='88px'>
                                Est. amount received
                            </DataList.Label>
                            <DataList.Value>
                                <div className={`w-full text-end`}>$0.00</div>
                            </DataList.Value>
                        </DataList.Item>
                    </DataList.Root>
                </div>
            </>
        ),
        [EFormType.LIMIT]: (
            <>
                <div className={`flex flex-col gap-3 mb-3`}>
                    <div>
                        <div className={`mb-2 font-semibold`}>Limit Price</div>
                        <div
                            className={`flex justify-around px-3 py-2 border border-gray-300 rounded-lg`}
                        >
                            <IconButton>
                                <Minus width={15} height={15} />
                            </IconButton>
                            <input
                                className={clsx(
                                    'text-center',
                                    'border-none outline-none',
                                    'focus:outline-none'
                                )}
                                placeholder={`$0`}
                            />
                            <IconButton>
                                <Plus width={15} height={15} />
                            </IconButton>
                        </div>
                    </div>
                    <div>
                        <div className={`mb-2 font-semibold`}>Shares</div>
                        <div
                            className={`flex justify-around px-3 py-2 border border-gray-300 rounded-lg`}
                        >
                            <IconButton>
                                <Minus width={15} height={15} />
                            </IconButton>
                            <input
                                className={clsx(
                                    'text-center',
                                    'border-none outline-none',
                                    'focus:outline-none'
                                )}
                                placeholder={`$0`}
                            />
                            <IconButton>
                                <Plus width={15} height={15} />
                            </IconButton>
                        </div>
                    </div>
                    <div className={`flex justify-between items-center`}>
                        <div className={`font-semibold`}>Set Expiration</div>
                        <Checkbox size='3' defaultChecked />
                    </div>
                </div>
                <div className={'flex mb-3'}>
                    <Button className={`flex-1`} variant={`primary`}>
                        Login
                    </Button>
                </div>
                <div>
                    <DataList.Root>
                        <DataList.Item align='center'>
                            <DataList.Label minWidth='88px'>
                                Total
                            </DataList.Label>
                            <DataList.Value>
                                <div
                                    className={`w-full text-end text-blue-500`}
                                >
                                    <span
                                        className={`border-dotted border-b-2 border-sky-500 cursor-pointer`}
                                    >
                                        0.0#
                                    </span>
                                </div>
                            </DataList.Value>
                        </DataList.Item>
                    </DataList.Root>
                </div>
            </>
        ),
        [EFormType.AMM]: (
            <>
                <div className={`mb-3`}>
                    <div className={`mb-2 font-semibold`}>Shares</div>
                    <div
                        className={`flex justify-around px-3 py-2 border border-gray-300 rounded-lg`}
                    >
                        <IconButton>
                            <Minus width={15} height={15} />
                        </IconButton>
                        <input
                            className={clsx(
                                'text-center',
                                'border-none outline-none',
                                'focus:outline-none'
                            )}
                            placeholder={`$0`}
                        />
                        <IconButton>
                            <Plus width={15} height={15} />
                        </IconButton>
                    </div>
                </div>
            </>
        )
    }

    const _renderFormField = () => {
        return formFields[formType]
    }

    return (
        <div className={clsx('p-6')}>
            <div className={`flex justify-between mb-3 font-semibold`}>
                <div className={`flex items-center gap-2`}>
                    Outcome <Info width={15} height={15} />
                </div>
                <div className={`flex gap-2 items-center`}>
                    <IconButton>
                        <RefreshCcw width={15} height={15} />
                    </IconButton>
                    <Settings width={15} height={15} />
                </div>
            </div>
            <div
                className={clsx(
                    'w-full flex justify-center items-center gap-4 mb-3'
                )}
            >
                <Button
                    className={`flex-1 py-6`}
                    variant={
                        betOption === EBetOption.YES
                            ? 'successSolid'
                            : 'secondary'
                    }
                    onClick={() => changeBetOption(EBetOption.YES)}
                >
                    {`${outcomes[0]} ${formatterEuro.format(Math.round(Number(outcomePrices[0]) * 100))}`}
                </Button>
                <Button
                    className={`flex-1 py-6`}
                    variant={
                        betOption === EBetOption.NO
                            ? 'accentSolid'
                            : 'secondary'
                    }
                    onClick={() => changeBetOption(EBetOption.NO)}
                >
                    {`${outcomes[1]} ${formatterEuro.format(Math.round(Number(outcomePrices[1]) * 100))}`}
                </Button>
            </div>
            {_renderFormField()}
        </div>
    )
}

export default SellForm
