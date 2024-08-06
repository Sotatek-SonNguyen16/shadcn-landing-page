import React from 'react'
import { clsx } from 'clsx'
import { Button } from '@/components/ui/button.tsx'
import { Info, Minus, Plus, RefreshCcw, Settings } from 'lucide-react'
import { Checkbox, DataList, IconButton } from '@radix-ui/themes'
import { useEventContext } from '@/contexts/EventContext.tsx'
import { EBetOption, EFormType } from '@/types'

const BuyForm: React.FC = () => {
    const { formType, betOption, selectedEvent, changeBetOption } =
        useEventContext()

    const arrayOutcomes = JSON.parse(selectedEvent?.outcomes || '[]')
    const arrayOutcomePrices = JSON.parse(selectedEvent?.outcomePrices || '[]')

    const formatterEuro = new Intl.NumberFormat('default', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 5
    })

    const formFields = {
        [EFormType.MARKET]: (
            <>
                <div className={`mb-3`}>
                    <div>
                        <div className={`mb-2 font-semibold`}>Amount</div>
                        <div
                            className={`flex justify-around px-3 py-2 border border-gray-300 rounded-lg`}
                        >
                            <IconButton>
                                <Minus width={15} height={15} />
                            </IconButton>
                            <input
                                className={clsx(
                                    'text-center',
                                    'focus:border-none'
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
                                Shares
                            </DataList.Label>
                            <DataList.Value>
                                <div className={`w-full text-end`}>0.0#</div>
                            </DataList.Value>
                        </DataList.Item>
                        <DataList.Item align='center'>
                            <DataList.Label minWidth='88px'>
                                Potential
                            </DataList.Label>
                            <DataList.Value>
                                <div
                                    className={`w-full text-end text-green-500`}
                                >
                                    0.0#
                                </div>
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
                                    'focus:border-none'
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
                                    'focus:border-none'
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
                        <DataList.Item align='center'>
                            <DataList.Label minWidth='88px'>
                                Potential return
                            </DataList.Label>
                            <DataList.Value>
                                <div
                                    className={`w-full text-end text-green-500`}
                                >
                                    0.0#
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
                    <div className={`mb-2 font-semibold`}>Amount</div>
                    <div
                        className={`flex justify-around px-3 py-2 border border-gray-300 rounded-lg`}
                    >
                        <IconButton>
                            <Minus width={15} height={15} />
                        </IconButton>
                        <input
                            className={clsx('text-center', 'focus:border-none')}
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
                    {`${arrayOutcomes[0]} ${formatterEuro.format(0.005)}`}
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
                    {`${arrayOutcomes[1]} ${formatterEuro.format(+arrayOutcomePrices[1])}`}
                </Button>
            </div>
            {_renderFormField()}
        </div>
    )
}

export default BuyForm
