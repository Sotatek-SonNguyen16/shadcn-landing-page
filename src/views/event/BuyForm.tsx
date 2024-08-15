import React, { useCallback, useEffect, useMemo } from 'react'
import { clsx } from 'clsx'
import { Button } from '@/components/ui/button.tsx'
import { Info, Minus, Plus, RefreshCcw, Settings } from 'lucide-react'
import { Checkbox, DataList, IconButton } from '@radix-ui/themes'
import { useEventContext } from '@/contexts/EventContext.tsx'
import { EBetOption, EFormType, ESide, OrderFormValues } from '@/types'
import TooltipIcon from '@/components/TooltipIcon.tsx'
import { FieldError, useForm, UseFormRegister } from 'react-hook-form'
import { useAuthContext } from '@/contexts/AuthContext.tsx'
import { LoadingSpinner } from '@/components/ui/spinner.tsx'

const InputField: React.FC<{
    register: UseFormRegister<OrderFormValues>
    name: keyof OrderFormValues
    placeholder: string
    onChange: (value: number) => void
    error?: FieldError
}> = ({ placeholder, register, name, onChange, error }) => (
    <>
        <div
            className={clsx(
                'flex justify-around px-3 py-2 border border-gray-300 rounded-lg',
                { 'border-red-500': !!error }
            )}
        >
            <Button
                variant='secondary'
                size='icon'
                type='button'
                onClick={() => onChange(-10)}
            >
                <TooltipIcon
                    trigger={<Minus width={15} height={15} />}
                    content={`-$10`}
                />
            </Button>
            <input
                className={clsx(
                    'text-center bg-background text-primary placeholder-gray-400',
                    'border-none outline-none',
                    'focus:outline-none'
                )}
                {...register(name)}
                placeholder={placeholder}
            />
            <Button
                variant='secondary'
                size='icon'
                type='button'
                onClick={() => onChange(10)}
            >
                <TooltipIcon
                    trigger={<Plus width={15} height={15} />}
                    content={`+$10`}
                />
            </Button>
        </div>
        {error && <p className='text-red-600 text-[12px]'>{error?.message}</p>}
    </>
)

const ActionButton: React.FC<{
    formId: string
    isLogin: boolean
    isPending: boolean
    disabled?: boolean
}> = ({ formId, isLogin, isPending, disabled = false }) => {
    useEffect(() => {
        console.log(isPending)
    }, [isPending])
    return (
        <div className='flex mb-3'>
            <Button
                form={formId}
                className='flex-1'
                variant='primary'
                type={isLogin ? 'submit' : 'button'}
                disabled={isPending || disabled}
            >
                {isLogin ? isPending ? <LoadingSpinner /> : 'Buy' : 'Login'}
            </Button>
        </div>
    )
}

const DataListItem: React.FC<{
    label: string
    value: string
    className?: string
}> = ({ label, value, className }) => (
    <DataList.Item align='center'>
        <DataList.Label minWidth='88px'>{label}</DataList.Label>
        <DataList.Value>
            <div className='w-full text-end'>
                <span className={clsx(className)}>{value}</span>
            </div>
        </DataList.Value>
    </DataList.Item>
)

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
        formState: { errors, isSubmitting },
        setValue,
        watch
    } = useForm<OrderFormValues>({ resolver })
    const onSubmit = handleSubmit(
        async (data) =>
            await handleOrder({
                marketId: currentMarket?.id ?? '',
                assetId:
                    formStatus === ESide.BUY
                        ? (currentMarket?.clobTokenIds[0] ?? '')
                        : (currentMarket?.clobTokenIds[1] ?? ''),
                side: formStatus,
                price: Number(data.amount) / 100,
                size: Number(data.size)
            })
    )

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

    const formFields = useMemo(
        () => ({
            [EFormType.MARKET]: (
                <>
                    <div className='mb-3'>
                        <form id='marketForm' onSubmit={onSubmit}>
                            <div className='flex justify-between items-center mb-1'>
                                <div className='mb-2 font-semibold'>Amount</div>
                                <div className='flex gap-1 items-center justify-center'>
                                    <div className='text-[14px] font-semibold rounded-2xl bg-gray-100 py-1 px-2'>
                                        Balance $0.00
                                    </div>
                                    <Button
                                        className='rounded-2xl'
                                        variant='default'
                                        size='iconGroup'
                                        type='button'
                                    >
                                        Max
                                    </Button>
                                </div>
                            </div>
                            <InputField
                                placeholder='$0'
                                name={'amount'}
                                register={register}
                                onChange={(val) => updateValue('amount', val)}
                                error={errors?.amount}
                            />
                            <ActionButton
                                isPending={isSubmitting}
                                formId='marketForm'
                                isLogin={isLogin}
                            />
                            <div>
                                <DataList.Root>
                                    <DataListItem
                                        label='Avg price'
                                        value={formatterEuro.format(
                                            Number(selectedOrder?.price ?? 0) *
                                                100
                                        )}
                                        className='text-blue-500 border-dotted border-b-2 border-sky-500 cursor-pointer'
                                    />
                                    <DataListItem
                                        label='Shares'
                                        value={`${(amount / Number(selectedOrder?.price ?? 1)).toFixed(2)}`}
                                    />
                                    <DataListItem
                                        label='Potential return'
                                        value={
                                            formatterUSD.format(0.0) +
                                            ' (0.00%)'
                                        }
                                        className='text-green-600'
                                    />
                                </DataList.Root>
                            </div>
                        </form>
                    </div>
                </>
            ),
            [EFormType.LIMIT]: (
                <>
                    <form
                        className='flex flex-col gap-3 mb-3'
                        id='limitForm'
                        onSubmit={onSubmit}
                    >
                        <div>
                            <div className='mb-2 font-semibold'>
                                Limit Price
                            </div>
                            <InputField
                                placeholder='$0'
                                register={register}
                                name={'amount'}
                                onChange={(val) => updateValue('amount', val)}
                                error={errors?.amount}
                            />
                        </div>
                        <div>
                            <div className='mb-2 font-semibold'>Shares</div>
                            <InputField
                                placeholder='$0'
                                register={register}
                                name={'size'}
                                onChange={(val) => updateValue('size', val)}
                                error={errors?.size}
                            />
                        </div>
                        <div className='flex justify-between items-center'>
                            <div className='font-semibold'>Set Expiration</div>
                            <Checkbox size='3' defaultChecked />
                        </div>
                        <ActionButton
                            formId='limitForm'
                            isLogin={isLogin}
                            isPending={isSubmitting}
                        />
                        <div>
                            <DataList.Root>
                                <DataListItem
                                    label='Total'
                                    value='0.0#'
                                    className='text-blue-500 border-dotted border-b-2 border-sky-500 cursor-pointer'
                                />
                                <DataListItem
                                    label='Potential return'
                                    value='0.0#'
                                    className='text-green-500'
                                />
                            </DataList.Root>
                        </div>
                    </form>
                </>
            ),
            [EFormType.AMM]: (
                <>
                    <div className='mb-3'>
                        <div className='mb-2 font-semibold'>Amount</div>
                        <InputField
                            placeholder='$0'
                            name={'amount'}
                            register={register}
                            onChange={(val) => updateValue('amount', val)}
                        />
                    </div>
                </>
            )
        }),
        [
            amount,
            errors?.amount,
            errors?.size,
            formatterEuro,
            formatterUSD,
            isLogin,
            onSubmit,
            register,
            selectedOrder?.price,
            updateValue
        ]
    )

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
