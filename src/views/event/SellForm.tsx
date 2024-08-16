import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { clsx } from 'clsx'
import { Button } from '@/components/ui/button.tsx'
import { Info, Minus, Plus, RefreshCcw, Settings } from 'lucide-react'
import { Checkbox, DataList, IconButton } from '@radix-ui/themes'
import { useEventContext } from '@/contexts/EventContext.tsx'
import { EBetOption, EFormType, OrderFormValues } from '@/types'
import { formatToCents } from '@/lib/utils.ts'
import {
    FieldError,
    useForm,
    UseFormRegister,
    UseFormSetValue
} from 'react-hook-form'
import TooltipIcon from '@/components/TooltipIcon.tsx'
import { LoadingSpinner } from '@/components/ui/spinner.tsx'
import { useAuthContext } from '@/contexts/AuthContext.tsx'

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

const CentsInputField: React.FC<{
    setValue: UseFormSetValue<OrderFormValues>
    name: keyof OrderFormValues
    placeholder: string
    onChange: (value: number) => void
    error?: FieldError
    value: number
}> = ({ value, placeholder, name, setValue, onChange, error }) => {
    const inputRef = useRef<HTMLInputElement>(null)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const numericValue = Number(e.target.value.replace('¢', '').trim()) || 0

        setValue(name, numericValue)
    }

    useEffect(() => {
        if (inputRef.current) {
            const input = inputRef.current
            const valueWithoutSymbol = value.toString()
            input.value = `${valueWithoutSymbol}¢`

            input.setSelectionRange(
                valueWithoutSymbol.length,
                valueWithoutSymbol.length
            )
        }
    }, [value])

    return (
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
                    ref={inputRef}
                    className={clsx(
                        'text-center bg-background text-primary placeholder-gray-400',
                        'border-none outline-none',
                        'focus:outline-none'
                    )}
                    placeholder={placeholder}
                    onChange={handleInputChange}
                    defaultValue={`${value}¢`}
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
            {error && (
                <p className='text-red-600 text-[12px]'>{error?.message}</p>
            )}
        </>
    )
}

const ActionButton: React.FC<{
    formId: string
    isLogin: boolean
    isPending: boolean
    disabled?: boolean
}> = ({ formId, isLogin, isPending, disabled = false }) => {
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

const SellForm: React.FC = () => {
    const {
        formType,
        betOption,
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

    useEffect(() => {
        setValue(
            'amount',
            Number(((selectedOrder?.price ?? 0) * 100).toFixed(1))
        )
        setValue('size', selectedOrder?.size ?? 0)
    }, [selectedOrder?.price, selectedOrder?.size, setValue])

    const updateValue = useCallback(
        (field: keyof OrderFormValues, delta: number) => {
            const currentValue = Number(watch(field))
            const newValue = Number((currentValue + delta).toFixed(1))

            if (newValue >= 0) {
                setValue(field, newValue)
            }
        },
        [setValue, watch]
    )

    const formFields = useMemo(
        () => ({
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
                                        'text-center bg-background text-primary placeholder-gray-400',
                                        'border-none outline-none',
                                        'focus:outline-none'
                                    )}
                                    placeholder={`$0`}
                                    defaultValue={selectedOrder?.price}
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
                                    <div className={`w-full text-end`}>
                                        $0.00
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
                        className='flex flex-col gap-3 mb-3'
                        id='limitForm'
                        onSubmit={handleSubmit(handleOrder)}
                    >
                        <div>
                            <div className='mb-2 font-semibold'>
                                Limit Price
                            </div>
                            <CentsInputField
                                placeholder='0¢'
                                setValue={setValue}
                                name={'amount'}
                                onChange={(val) => updateValue('amount', val)}
                                error={errors?.amount}
                                value={watch('amount', 0)}
                            />
                        </div>
                        <div>
                            <div className='mb-2 font-semibold'>Shares</div>
                            <InputField
                                placeholder='0'
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
                                    value='$00.0'
                                    className='text-blue-500 border-dotted border-b-2 border-sky-500 cursor-pointer'
                                />
                            </DataList.Root>
                        </div>
                    </form>
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
        }),
        [
            errors?.amount,
            errors?.size,
            handleOrder,
            handleSubmit,
            isLogin,
            isSubmitting,
            register,
            selectedOrder?.price,
            setValue,
            updateValue,
            watch
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
                    {`${currentMarket?.outcomes[0]} ${formatToCents(Number(currentMarket?.outcomePrices[0]))}`}
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
                    {`${currentMarket?.outcomes[1]} ${formatToCents(Number(currentMarket?.outcomePrices[1]))}`}
                </Button>
            </div>
            {_renderFormField}
        </div>
    )
}

export default SellForm
