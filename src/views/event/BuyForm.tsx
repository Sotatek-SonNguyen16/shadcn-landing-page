import React, { useCallback, useEffect, useMemo } from 'react'
import { clsx } from 'clsx'
import { Button } from '@/components/ui/button.tsx'
import { Info, Minus, Plus, RefreshCcw, Settings } from 'lucide-react'
import { Checkbox, DataList, IconButton } from '@radix-ui/themes'
import { useEventContext } from '@/contexts/EventContext.tsx'
import { EBetOption, EFormType, ESide, OrderFormValues } from '@/types'
import { Tooltip } from '@/components/ui/tooltip.tsx'
import { useForm } from 'react-hook-form'
import { useAuthContext } from '@/contexts/AuthContext.tsx'

const BuyForm: React.FC = () => {
    const {
        formType,
        betOption,
        formStatus,
        currentMarket,
        changeBetOption,
        selectedOrder,
        handleOrder,
        resolver
    } = useEventContext()
    const { isLogin } = useAuthContext()
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch
    } = useForm<OrderFormValues>({ resolver })
    const onSubmit = handleSubmit((data) => {
        handleOrder({
            marketId: currentMarket?.id ?? '',
            assetId:
                formStatus === ESide.BUY
                    ? (currentMarket?.clobTokenIds[0] ?? '')
                    : (currentMarket?.clobTokenIds[1] ?? ''),
            side: formStatus,
            price: Number(data.amount),
            size: Number(data.size)
        })
    })

    const formatterEuro = useMemo(
        () =>
            new Intl.NumberFormat('default', {
                style: 'currency',
                currency: 'EUR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 1
            }),
        []
    )

    const formatterUSD = useMemo(
        () =>
            new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }),
        []
    )

    const amount = Number(watch('amount'))

    useEffect(() => {
        setValue(
            'amount',
            Number(((selectedOrder?.price ?? 0) * 100).toFixed(1))
        )
        setValue('size', selectedOrder?.size ?? 0)
    }, [selectedOrder?.price, selectedOrder?.size, setValue])

    const updateValue = useCallback(
        (field: keyof OrderFormValues, delta: number) => {
            setValue(field, Number((Number(watch(field)) + delta).toFixed(1)))
        },
        [setValue, watch]
    )

    const formFields = {
        [EFormType.MARKET]: (
            <>
                <div className={`mb-3`}>
                    <form id='marketForm' onSubmit={onSubmit}>
                        <div className='flex justify-between items-center mb-1'>
                            <div className={`mb-2 font-semibold`}>Amount</div>
                            <div className='flex gap-1 items-center justify-center'>
                                <div className='text-[14px] font-semibold rounded-2xl bg-gray-100 py-1 px-2'>
                                    Balance $0.00
                                </div>
                                <Button
                                    className='rounded-2xl'
                                    variant='default'
                                    size={'iconGroup'}
                                    type={`button`}
                                >
                                    Max
                                </Button>
                            </div>
                        </div>
                        <div
                            className={clsx(
                                'flex justify-around px-3 py-2 border border-gray-300 rounded-lg',
                                { 'border-red-500': errors?.amount }
                            )}
                        >
                            <Button
                                variant={`secondary`}
                                size={`icon`}
                                type={`button`}
                                onClick={() => updateValue('amount', -10)}
                            >
                                <Tooltip
                                    trigger={<Minus width={15} height={15} />}
                                    content='-$10'
                                />
                            </Button>
                            <input
                                className={clsx(
                                    'text-center bg-background text-primary placeholder-gray-400',
                                    'border-none outline-none',
                                    'focus:outline-none'
                                )}
                                placeholder='$0'
                                {...register('amount')}
                            />
                            <Button
                                variant={`secondary`}
                                size={`icon`}
                                type={`button`}
                                onClick={() => updateValue('amount', 10)}
                            >
                                <Tooltip
                                    trigger={<Plus width={15} height={15} />}
                                    content='+$10'
                                />
                            </Button>
                        </div>
                        {errors?.amount && (
                            <p className='text-red-600 text-[12px]'>
                                {errors.amount.message}
                            </p>
                        )}
                    </form>
                </div>
                <div className={'flex mb-3'}>
                    {isLogin ? (
                        <Button
                            form='marketForm'
                            className={`flex-1`}
                            variant={`primary`}
                            type={`submit`}
                        >
                            Buy
                        </Button>
                    ) : (
                        <Button className={`flex-1`} variant={`primary`}>
                            Login
                        </Button>
                    )}
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
                                        {formatterEuro.format(
                                            Number(selectedOrder?.price ?? 0) *
                                                100
                                        )}
                                    </span>
                                </div>
                            </DataList.Value>
                        </DataList.Item>
                        <DataList.Item align='center'>
                            <DataList.Label minWidth='88px'>
                                Shares
                            </DataList.Label>
                            <DataList.Value>
                                <div className={`w-full text-end`}>
                                    {`${(
                                        amount /
                                        Number(selectedOrder?.price ?? 1)
                                    ).toFixed(2)}`}
                                </div>
                            </DataList.Value>
                        </DataList.Item>
                        <DataList.Item align='center'>
                            <DataList.Label minWidth='88px'>
                                Potential return
                            </DataList.Label>
                            <DataList.Value>
                                <div
                                    className={`w-full text-end text-green-600`}
                                >
                                    {formatterUSD.format(0.0)} (0.00%)
                                </div>
                            </DataList.Value>
                        </DataList.Item>
                    </DataList.Root>
                </div>
            </>
        ),
        [EFormType.LIMIT]: (
            <>
                <form
                    className={`flex flex-col gap-3 mb-3`}
                    id='limitForm'
                    onSubmit={onSubmit}
                >
                    <div>
                        <div className={`mb-2 font-semibold`}>Limit Price</div>
                        <div
                            className={clsx(
                                'flex justify-around px-3 py-2 border border-gray-300 rounded-lg',
                                { 'border-red-500': errors?.amount }
                            )}
                        >
                            <Button
                                variant={`secondary`}
                                size={`icon`}
                                type={`button`}
                                onClick={() => updateValue('amount', -1)}
                            >
                                <Tooltip
                                    trigger={<Minus width={15} height={15} />}
                                    content='-$1'
                                />
                            </Button>
                            <input
                                className={clsx(
                                    'text-center bg-background text-primary placeholder-gray-400',
                                    'border-none outline-none',
                                    'focus:outline-none'
                                )}
                                placeholder='$0'
                                {...register('amount')}
                            />
                            <Button
                                variant={`secondary`}
                                size={`icon`}
                                type={`button`}
                                onClick={() => updateValue('amount', 1)}
                            >
                                <Tooltip
                                    trigger={<Plus width={15} height={15} />}
                                    content='+$1'
                                />
                            </Button>
                        </div>
                        {errors?.amount && (
                            <p className='text-red-600 text-[12px]'>
                                {errors.amount.message}
                            </p>
                        )}
                    </div>
                    <div>
                        <div className={`mb-2 font-semibold`}>Shares</div>
                        <div
                            className={clsx(
                                'flex justify-around px-3 py-2 border border-gray-300 rounded-lg',
                                { 'border-red-500': errors?.size }
                            )}
                        >
                            <Button
                                variant={`secondary`}
                                size={`icon`}
                                type={`button`}
                                onClick={() => updateValue('size', -10)}
                            >
                                <Tooltip
                                    trigger={<Plus width={15} height={15} />}
                                    content='-10'
                                />
                            </Button>
                            <input
                                className={clsx(
                                    'text-center bg-background text-primary placeholder-gray-400',
                                    'border-none outline-none',
                                    'focus:outline-none'
                                )}
                                placeholder={`$0`}
                                {...register('size')}
                            />
                            <Button
                                variant={`secondary`}
                                size={`icon`}
                                type={`button`}
                                onClick={() => updateValue('size', 10)}
                            >
                                <Tooltip
                                    trigger={<Plus width={15} height={15} />}
                                    content='+10'
                                />
                            </Button>
                        </div>
                        {errors?.size && (
                            <p className='text-red-600 text-[12px]'>
                                {errors.size.message}
                            </p>
                        )}
                    </div>
                    <div className={`flex justify-between items-center`}>
                        <div className={`font-semibold`}>Set Expiration</div>
                        <Checkbox size='3' defaultChecked />
                    </div>
                </form>
                <div className={'flex mb-3'}>
                    {isLogin ? (
                        <Button
                            form='limitForm'
                            className={`flex-1`}
                            variant={`primary`}
                            type={`submit`}
                        >
                            Buy
                        </Button>
                    ) : (
                        <Button className={`flex-1`} variant={`primary`}>
                            Login
                        </Button>
                    )}
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
                            className={clsx(
                                'text-center bg-background text-primary placeholder-gray-400',
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

    const _renderFormField = useMemo(
        () => formFields[formType],
        [formFields, formType]
    )

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
                    {`${currentMarket?.outcomes[0]} ${formatterEuro.format(Number(currentMarket?.outcomePrices[0]) * 100)}`}
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
                    {`${currentMarket?.outcomes[1]} ${formatterEuro.format(Number(currentMarket?.outcomePrices[1]) * 100)}`}
                </Button>
            </div>
            {_renderFormField}
        </div>
    )
}

export default BuyForm
