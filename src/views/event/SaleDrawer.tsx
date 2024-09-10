import React, { useEffect, useMemo, useState } from 'react'
import DrawerProvider, { useDrawerContext } from '@/contexts/DrawerContext.tsx'
import {
    EBetOption,
    EFormType,
    ESide,
    KeyPadOptions,
    OrderFormValues
} from '@/types'
import { useEventContext } from '@/contexts/EventContext.tsx'
import { Button } from '@/components/ui/button.tsx'
import {
    ArrowRightLeft,
    Check,
    ChevronDown,
    ChevronLeft,
    CircleCheck,
    Delete,
    Minus,
    Plus,
    RefreshCcw
} from 'lucide-react'
import { useAuthContext } from '@/contexts/AuthContext.tsx'
import { FieldErrors, useForm } from 'react-hook-form'
import { LoadingSpinner } from '@/components/ui/spinner.tsx'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx'
import { formatToCents } from '@/lib/utils.ts'
import { useEventWebSocket } from '@/contexts/WebSocketContext.tsx'
import DateTimePicker from '@/components/DateTimePicker.tsx'
import CheckBoxGroup from '@/components/CheckBoxGroup.tsx'
import TimePicker from '@/components/TimePicker.tsx'
import ResponsiveInput from '@/views/event/ResponsiveInput.tsx'
import useBalance from '@/hooks/useBalance.ts'

const ActionButton: React.FC<{
    content: JSX.Element
    formId: string
    isLogin: boolean
    onClickLogin: () => void
    isPending: boolean
    disabled?: boolean
}> = ({
    content,
    formId,
    isLogin,
    isPending,
    disabled = false,
    onClickLogin
}) => {
    return (
        <div className='flex'>
            <Button
                form={formId}
                className='w-full h-auto px-4 py-2.5 rounded-lg justify-center items-center gap-2 inline-flex'
                variant='default'
                type={isLogin ? 'submit' : 'button'}
                disabled={isPending || disabled}
                onClick={onClickLogin}
            >
                {isLogin ? isPending ? <LoadingSpinner /> : content : 'Login'}
            </Button>
        </div>
    )
}

const FormSideButton: React.FC<{
    active: boolean
    text: string
    onClick: () => void
}> = ({ active, text, onClick }) => {
    if (active) {
        return (
            <div className='h-7 py-0.5 bg-color-neutral-alpha-500 rounded-full shadow flex-col justify-center items-center gap-2 inline-flex'>
                <div className='px-3 rounded-lg justify-center items-center gap-2 inline-flex'>
                    <div className='rounded-lg flex-col justify-center items-start inline-flex'>
                        <div className='text-color-neutral-900 text-xs font-normal leading-none'>
                            {text}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div
            className='h-7 py-0.5 rounded-full flex-col justify-center items-center gap-2 inline-flex cursor-pointer'
            onClick={onClick}
        >
            <div className='px-3 rounded-lg justify-center items-center gap-2 inline-flex'>
                <div className='rounded-lg flex-col justify-center items-start inline-flex'>
                    <div className='text-color-neutral-900 text-xs font-normal leading-none'>
                        {text}
                    </div>
                </div>
            </div>
        </div>
    )
}

const FormSideGroupButton = () => {
    const { changeForm, formStatus } = useEventContext()

    return (
        <div className='flex justify-between items-center'>
            <div className='w-fit h-8 p-0.5 bg-color-neutral-100 rounded-full justify-start items-center gap-0.5 inline-flex'>
                <FormSideButton
                    text='Buy'
                    active={formStatus === ESide.BUY}
                    onClick={() => changeForm(ESide.BUY)}
                />
                <FormSideButton
                    text='Sell'
                    active={formStatus === ESide.SELL}
                    onClick={() => changeForm(ESide.SELL)}
                />
            </div>
        </div>
    )
}

const BetEventInfo = () => {
    const { currentMarket } = useEventContext()

    return (
        <div className='w-full flex gap-2 py-3 px-2 items-center overflow-x-hidden scrollbar-hidden border-t border-color-neutral-100'>
            <Avatar className='relative inline-flex h-7 w-7'>
                <AvatarImage
                    src={currentMarket?.icon}
                    className='h-full w-full object-cover rounded-full'
                />
                <AvatarFallback className='flex h-full w-full items-center justify-center bg-white dark:bg-gray-900 rounded-full' />
            </Avatar>
            <div className='h-auto rounded-lg flex-col justify-center items-start inline-flex'>
                <div className='self-stretch text-color-neutral-900 text-xs font-normal leading-none break-words'>
                    Betting for "{currentMarket?.question}"
                </div>
            </div>
        </div>
    )
}

const KeyPad: React.FC<{
    value: string
    handleChange: (value: string) => void
    keyPadOptions: KeyPadOptions
}> = ({ value, handleChange, keyPadOptions }) => {
    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'x']

    function hasOneDecimalPlace(value: string | number): boolean {
        const strValue = value.toString()
        const parts = strValue.split('.')
        return parts.length === 2 ? parts[1].length <= 1 : true
    }

    const handleKeyClick = (key: string) => {
        if (key === 'x') {
            handleChange(value.slice(0, -1))
        } else {
            if (isNaN(Number(value + key))) return
            if (keyPadOptions.decimal && !hasOneDecimalPlace(value + key))
                return
            handleChange(value + key)
        }
    }

    return (
        <div className='grid grid-cols-3'>
            {keys.map((key) => (
                <div
                    key={key}
                    className='cursor-pointer h-12 pt-2 pb-4 justify-center items-center inline-flex'
                    onClick={() => handleKeyClick(key)}
                >
                    {key === 'x' ? (
                        <Delete size={28} />
                    ) : (
                        <div className='text-center text-color-neutral-900 text-xl font-semibold leading-normal'>
                            {key}
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}

const BuyBetInput: React.FC<{
    errors: FieldErrors<OrderFormValues>
    input: string
    setInput: (value: string) => void
    handleChange: (value: string) => void
}> = ({ input, setInput, handleChange, errors }) => {
    const { selectedOrder } = useEventContext()
    const { resetOrderBook } = useEventWebSocket()
    const [focus, setFocus] = useState<'amount' | 'size' | 'none'>('amount')
    const { balance } = useBalance()
    const formatterUSD = useMemo(
        () =>
            new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 5
            }),
        []
    )

    const value = useMemo(() => {
        if (focus === 'amount') {
            handleChange(input)
            return input
        }
        return ''
    }, [focus, input])

    const onFocus = (focusType: 'amount' | 'size' | 'none') => {
        if (value === 'amount') {
            setInput(value)
        }
        setFocus(focusType)
    }

    useEffect(() => {
        setInput('')
    }, [])

    return (
        <div className='flex-col justify-start items-center gap-2 inline-flex'>
            <div className='h-40 pt-2 pb-7 flex-col justify-center items-center gap-2 inline-flex'>
                <div className='self-stretch justify-center items-center gap-1 inline-flex'>
                    <ResponsiveInput
                        value={value}
                        name='amount'
                        focus={focus}
                        onFocus={onFocus}
                        className='text-end text-white text-5xl font-normal leading-10'
                    />
                    <div className='text-color-neutral-250 text-3xl font-light leading-10'>
                        $
                    </div>
                </div>
                {errors?.size && (
                    <div className='text-center text-color-accent-red-900 text-xs font-normal leading-none'>
                        {errors.size?.message}
                    </div>
                )}
                <div className='self-stretch rounded-lg justify-center items-center gap-2 inline-flex'>
                    <div className='rounded-lg justify-start items-center gap-1 flex'>
                        <div className='text-color-neutral-700 text-sm font-light leading-tight'>
                            Your balance:
                        </div>
                        <div className='text-color-neutral-700 text-sm font-light leading-tight'>
                            {formatterUSD.format(
                                Number(balance?.cashUsd || '0')
                            )}
                        </div>
                    </div>
                    <div className='justify-center items-center gap-1 flex'>
                        <div className='h-4 pb-0.5 rounded-lg flex-col justify-center items-start inline-flex cursor-pointer'>
                            <div className='self-stretch text-center text-color-brand-500 text-sm font-normal leading-tight'>
                                Max
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='h-4 rounded-lg justify-center items-center gap-1 inline-flex'>
                <div className='rounded-lg flex-col justify-center items-start inline-flex'>
                    <div className='text-color-neutral-700 text-xs font-light leading-none'>
                        {formatToCents(selectedOrder?.price ?? 0)}/share
                    </div>
                </div>
                <RefreshCcw
                    size={16}
                    className='text-color-neutral-700 cursor-pointer'
                    onClick={resetOrderBook}
                />
            </div>
        </div>
    )
}

const SplitLine = () => {
    return (
        <div className='h-[1px] w-full border border-color-neutral-100'></div>
    )
}

const LimitInput: React.FC<{
    errors: FieldErrors<OrderFormValues>
    input: string
    setInput: (value: string) => void
    handleChangeAmount: (value: string) => void
    handleChangeSize: (value: string) => void
}> = ({ input, setInput, handleChangeSize, handleChangeAmount, errors }) => {
    const { openDrawer } = useDrawerContext()
    const { selectedOrder } = useEventContext()
    const [amountS, setAmountS] = useState<string>('')
    const [sizeS, setSizeS] = useState<string>('')
    const [focus, setFocus] = useState<'amount' | 'size' | 'none'>('amount')
    const [expirationTime, setExpirationTime] =
        useState<string>('Until cancelled')
    const { balance } = useBalance()
    const formatterUSD = useMemo(
        () =>
            new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 5
            }),
        []
    )

    const amount = useMemo(() => {
        if (focus === 'amount') {
            setAmountS(input)
            handleChangeAmount(input)
            return input
        }
        return amountS
    }, [focus, input])
    const size = useMemo(() => {
        if (focus === 'size') {
            setSizeS(input)
            handleChangeSize(input)
            return input
        }
        return sizeS
    }, [focus, input])

    const onFocus = (value: 'amount' | 'size' | 'none') => {
        if (value === 'amount') {
            setInput(amount)
        } else if (value === 'size') {
            setInput(size)
        }
        setFocus(value)
    }

    const onClickAutoFillLimitPrice = () => {
        setFocus('amount')
        setInput(`${(Number(selectedOrder?.price || 0) * 100).toFixed(1)}`)
    }

    const onClickExpirationTimeButton = () => {
        openDrawer({
            background: 'bg-color-neutral-alpha-800',
            content: (
                <ExpirationTimeDrawer setExpirationTime={setExpirationTime} />
            )
        })
    }

    useEffect(() => {
        setInput('')
        handleChangeSize('')
    }, [])

    return (
        <>
            <div className='pt-2 pb-7 flex-col justify-center items-center gap-2 inline-flex'>
                <div className='self-stretch justify-start items-start gap-1.5 inline-flex'>
                    <div className='grow shrink basis-0 self-stretch justify-start items-center gap-1 flex'>
                        <div className='justify-start items-center gap-0.5 flex'>
                            <div className='text-color-neutral-900 text-xs font-normal leading-none'>
                                Limit Price
                            </div>
                        </div>
                        <div>
                            <RefreshCcw
                                className='text-color-neutral-500 cursor-pointer'
                                onClick={onClickAutoFillLimitPrice}
                                size={14}
                            />
                        </div>
                    </div>
                    <div className='flex-col justify-start items-start gap-1 inline-flex'>
                        <div className='py-2.5 rounded-lg justify-start items-center gap-4 inline-flex'>
                            <div className='rounded-lg justify-center items-center flex cursor-pointer'>
                                <Minus
                                    size={16}
                                    className='text-color-brand-500'
                                    onClick={() => {
                                        setFocus('amount')
                                        const parsedAmount = parseFloat(amount)
                                        if (!isNaN(parsedAmount)) {
                                            const minusAmount =
                                                parsedAmount - 10
                                            if (minusAmount > 0) {
                                                setInput(minusAmount.toString())
                                            }
                                        } else {
                                            setInput('0')
                                        }
                                    }}
                                />
                            </div>
                            <div className='text-color-neutral-900 text-sm font-light leading-tight'>
                                <ResponsiveInput
                                    value={amount}
                                    name='amount'
                                    focus={focus}
                                    onFocus={onFocus}
                                />
                                {' ¢'}
                            </div>
                            <div className='rounded-lg justify-center items-center flex cursor-pointer'>
                                <Plus
                                    size={16}
                                    className='text-color-brand-500'
                                    onClick={() => {
                                        setFocus('amount')
                                        const parsedAmount = parseFloat(amount)
                                        if (!isNaN(parsedAmount)) {
                                            const minusAmount =
                                                parsedAmount + 10
                                            setInput(minusAmount.toString())
                                        } else {
                                            setInput('10')
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <SplitLine />
                <div className='self-stretch justify-start items-start gap-1.5 inline-flex'>
                    <div className='self-stretch justify-start items-center gap-1 flex'>
                        <div className='justify-start items-center gap-0.5 flex'>
                            <div className='text-color-neutral-900 text-xs font-normal leading-none'>
                                Share
                            </div>
                        </div>
                    </div>
                    <div className='grow shrink basis-0 flex-col justify-start items-start gap-1 flex'>
                        <div className='w-full self-stretch py-2.5 rounded-lg justify-end items-center gap-2 flex'>
                            <div className='rounded-full justify-center items-center gap-1 flex text-nowrap'>
                                <Check
                                    size={16}
                                    className='text-color-brand-400'
                                />
                                <div className='pb-0.5 rounded-lg flex-col justify-center items-start inline-flex'>
                                    <div className='self-stretch text-color-brand-400 text-xs font-normal leading-none'>
                                        0 matching
                                    </div>
                                </div>
                            </div>
                            <div className='text-right text-color-neutral-900 text-sm font-light leading-tight'>
                                <ResponsiveInput
                                    value={size}
                                    name='size'
                                    focus={focus}
                                    onFocus={onFocus}
                                />
                            </div>
                        </div>
                        {errors?.size && (
                            <div className='w-full text-end text-color-accent-red-900 text-xs font-normal leading-none'>
                                {errors.size?.message}
                            </div>
                        )}
                    </div>
                </div>
                <SplitLine />
                <div className='self-stretch h-10 justify-start items-center gap-1.5 inline-flex'>
                    <div className='grow shrink basis-0 self-stretch justify-start items-center gap-1 flex'>
                        <div className='justify-start items-center gap-0.5 flex'>
                            <div className='text-color-neutral-900 text-xs font-normal leading-none'>
                                Expiration
                            </div>
                        </div>
                    </div>
                    <div className='flex-col justify-start items-start gap-1 inline-flex'>
                        <div
                            className='py-1 rounded-lg justify-start items-center gap-2 inline-flex cursor-pointer'
                            onClick={onClickExpirationTimeButton}
                        >
                            <div className='text-color-neutral-900 text-sm font-light leading-tight'>
                                {expirationTime}
                            </div>
                            <div className='rounded-lg justify-center items-center flex'>
                                <ChevronDown size={12} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='self-stretch rounded-lg justify-center items-center gap-2 inline-flex'>
                <div className='rounded-lg justify-start items-center gap-1 flex'>
                    <div className='text-color-neutral-700 text-sm font-light leading-tight'>
                        Your balance:
                    </div>
                    <div className='text-color-neutral-700 text-sm font-light leading-tight'>
                        {formatterUSD.format(Number(balance?.cashUsd || '0'))}
                    </div>
                </div>
                <div className='justify-center items-center gap-1 flex'>
                    <div className='h-4 pb-0.5 rounded-lg flex-col justify-center items-start inline-flex cursor-pointer'>
                        <div className='self-stretch text-center text-color-brand-500 text-sm font-normal leading-tight'>
                            Max
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

const ExpirationTimeDrawer: React.FC<{
    setExpirationTime: (value: string) => void
}> = ({ setExpirationTime }) => {
    const [date, setDate] = useState<Date | undefined>(undefined)
    const [time, setTime] = useState<string | undefined>(undefined)

    const [expiration, setExpiration] = useState<'UNTIL' | 'END' | 'CUSTOM'>(
        'UNTIL'
    )

    useEffect(() => {
        if (date && time) {
            const formattedDate = date
                .toLocaleDateString('en-GB')
                .split('/')
                .join('/')

            const expirationTime = `${formattedDate} - ${time}`
            setExpirationTime(expirationTime)
        }
    }, [date, time])

    return (
        <div className='h-full w-full flex flex-col px-4 pb-7'>
            <div className='w-full h-10 grid grid-cols-5 items-center gap-1'>
                <div className='py-0.5 flex-col justify-start items-start gap-2 inline-flex'></div>
                <div className='grow shrink basis-0 flex-col justify-center items-center inline-flex col-span-3'>
                    <div className='self-stretch rounded-lg justify-center items-start gap-2 inline-flex'>
                        Expiration
                    </div>
                </div>
                <div className='py-0.5 justify-end items-center flex'></div>
            </div>
            <div className='mb-4'>
                <CheckBoxGroup
                    value={expiration}
                    name='Expiration'
                    items={[
                        { name: 'Until Cancelled', value: 'UNTIL' },
                        { name: 'End of day', value: 'END' },
                        { name: 'Custom', value: 'CUSTOM' }
                    ]}
                    onChange={(value) => {
                        setExpiration(value as 'UNTIL' | 'END' | 'CUSTOM')
                        switch (value) {
                            case 'CUSTOM':
                                if (date && time) {
                                    const formattedDate = date
                                        .toLocaleDateString('en-GB')
                                        .split('/')
                                        .join('/')

                                    const expirationTime = `${formattedDate} - ${time}`
                                    setExpirationTime(expirationTime)
                                }
                                return
                            case 'UNTIL':
                                setExpirationTime('Until cancelled')
                                return
                            case 'END':
                                setExpirationTime('End of day')
                                return
                            default:
                                return
                        }
                    }}
                />
            </div>
            <div className='flex justify-center items-center gap-2 select-none'>
                <DateTimePicker
                    placeholder='DD/MM/YYYY'
                    value={date}
                    onChange={setDate}
                    disabled={expiration !== 'CUSTOM'}
                />
                <div>-</div>
                <TimePicker
                    value={time}
                    onChange={setTime}
                    disabled={expiration !== 'CUSTOM'}
                />
            </div>
        </div>
    )
}

const FormStatusSelectButton = () => {
    const { openDrawer } = useDrawerContext()
    const { formType } = useEventContext()
    const onClickSettingButton = () => {
        openDrawer({
            background: 'bg-color-neutral-alpha-800',
            content: <SettingTransactionDrawer />
        })
    }
    return (
        <div
            className='h-5 pl-2 pr-1 py-1 rounded-3xl border border-color-neutral-900 justify-end items-center gap-1 inline-flex cursor-pointer'
            onClick={onClickSettingButton}
        >
            <div className='h-3 pb-px rounded-lg flex-col justify-center items-start inline-flex'>
                <div className='self-stretch text-center text-color-neutral-900 text-xs font-normal leading-3'>
                    {formType}
                </div>
            </div>
            <ChevronDown size={12} />
        </div>
    )
}

const SettingTransactionDrawer = () => {
    const { changeType, formType } = useEventContext()
    const { closeDrawer } = useDrawerContext()

    return (
        <div className='px-4 flex flex-col gap-2'>
            <div className='h-4 rounded-lg flex-col justify-center items-start inline-flex'>
                <div className='self-stretch text-color-neutral-500 text-xs font-light leading-none'>
                    Setting Transaction
                </div>
            </div>
            <div className='flex flex-col'>
                <div
                    className='h-20 py-4 border-b border-color-neutral-50 justify-start items-center gap-1 inline-flex cursor-pointer'
                    onClick={() => {
                        changeType(EFormType.MARKET)
                        closeDrawer()
                    }}
                >
                    <div className='grow shrink basis-0 pb-0.5 rounded-lg flex-col justify-center items-start inline-flex'>
                        <div className='self-stretch text-color-neutral-900 text-base font-normal leading-normal'>
                            Market Order
                        </div>
                        <div className='self-stretch text-color-neutral-500 text-xs font-light leading-none'>
                            Buy or sell at the best price in the current market
                        </div>
                    </div>
                    <div>
                        {formType === EFormType.MARKET && (
                            <CircleCheck size={18} />
                        )}
                    </div>
                </div>
                <div
                    className='h-20 py-4 border-b border-color-neutral-50 justify-start items-center gap-1 inline-flex cursor-pointer'
                    onClick={() => {
                        changeType(EFormType.LIMIT)
                        closeDrawer()
                    }}
                >
                    <div className='grow shrink basis-0 pb-0.5 rounded-lg flex-col justify-center items-start inline-flex'>
                        <div className='self-stretch text-color-neutral-900 text-base font-normal leading-normal'>
                            Limit Order
                        </div>
                        <div className='self-stretch text-color-neutral-500 text-xs font-light leading-none'>
                            Buy or sell at a specified price or better
                        </div>
                    </div>
                    <div>
                        {formType === EFormType.LIMIT && (
                            <CircleCheck size={18} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

const SaleDrawer: React.FC = () => {
    const {
        formType,
        formStatus,
        betOption,
        changeBetOption,
        currentMarket,
        handleOrder,
        selectedOrder,
        createOrderResult,
        setCreateOrderResult,
        keyPadOptions,
        updateKeyPadOptions
    } = useEventContext()
    const { closeDrawer } = useDrawerContext()
    const { isLogin, handleLogin } = useAuthContext()
    const {
        handleSubmit,
        formState: { errors, isSubmitting, isSubmitted },
        watch,
        setValue,
        setError,
        clearErrors
    } = useForm<OrderFormValues>()

    const validateForm = (field: keyof OrderFormValues, value: number) => {
        if (field === 'amount') {
            if (!value || isNaN(value) || value <= 0) {
                setError('amount', {
                    type: 'manual',
                    message: 'Amount is required and must be a positive number.'
                })
            } else {
                clearErrors('amount')
            }
        }

        if (field === 'size') {
            if (!value || isNaN(value) || value < 5) {
                setError('size', {
                    type: 'manual',
                    message: 'Minimum 5 shares for limit orders'
                })
            } else {
                clearErrors('size')
            }
        }
    }

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

    const [input, setInput] = useState<string>('')

    const handleChangeInput = (newValue: string) => {
        const parsedValue = Number(newValue)
        updateKeyPadOptions({ decimal: false })

        if (!isNaN(parsedValue)) {
            setValue('size', Number(selectedOrder?.size))
            setValue('amount', parsedValue)
            clearErrors('size')
            if (isSubmitted) validateForm('amount', parsedValue)
        }
    }

    const handleChangeAmount = (newValue: string) => {
        const parsedValue = Number(newValue)
        updateKeyPadOptions({ decimal: true })

        if (!isNaN(parsedValue)) {
            setValue('amount', parsedValue)
            if (isSubmitted) validateForm('amount', parsedValue)
        }
    }

    const handleChangeSize = (newValue: string) => {
        const parsedValue = Number(newValue)
        updateKeyPadOptions({ decimal: false })

        if (!isNaN(parsedValue)) {
            setValue('size', parsedValue)
            if (isSubmitted) validateForm('size', parsedValue)
        }
    }

    const calculatedValue = useMemo(() => {
        const amount = Number(watch('amount')) || 0
        const size = Number(watch('size')) || 0
        return formType === EFormType.MARKET
            ? `${amount * size} shares`
            : `$${amount * size}`
    }, [watch('amount'), watch('size'), formType])

    useEffect(() => {
        if (createOrderResult === 'success') {
            closeDrawer()
            setCreateOrderResult('none')
        }
    }, [createOrderResult])

    return (
        <DrawerProvider>
            <div className='w-full h-auto flex flex-col px-4 gap-4'>
                <div className='w-full h-10 grid grid-cols-5 items-center gap-1'>
                    <div className='py-0.5 flex-col justify-start items-start gap-2 inline-flex'>
                        <div
                            className='h-5 justify-start items-center gap-1 inline-flex cursor-pointer'
                            onClick={closeDrawer}
                        >
                            <ChevronLeft size={18} />
                            <div className='h-5 pb-0.5 rounded-lg flex-col justify-center items-start inline-flex'>
                                <div className='self-stretch text-center text-color-neutral-900 text-sm font-normal leading-tight'>
                                    Back
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='grow shrink basis-0 flex-col justify-center items-center inline-flex col-span-3'>
                        <div className='self-stretch rounded-lg justify-center items-start gap-2 inline-flex'>
                            <FormSideGroupButton />
                        </div>
                    </div>
                    <div className='py-0.5 justify-end items-center flex'>
                        <div className='w-auto'>
                            <FormStatusSelectButton />
                        </div>
                    </div>
                </div>
                <div className='flex justify-between items-center'>
                    <Button
                        className='gap-1'
                        variant={
                            betOption === EBetOption.YES
                                ? 'successGhost'
                                : 'accentGhost'
                        }
                        type='button'
                        size={`iconGroup`}
                        onClick={() =>
                            changeBetOption(
                                betOption === EBetOption.YES
                                    ? EBetOption.NO
                                    : EBetOption.YES
                            )
                        }
                    >
                        {formStatus === ESide.BUY ? 'Bet' : 'Sell'}{' '}
                        {betOption === EBetOption.YES ? 'Yes' : 'No'}
                        <ArrowRightLeft width={15} height={15} />
                    </Button>
                    {formStatus === ESide.BUY && (
                        <div className=''>
                            <span className='text-color-neutral-500 text-xs font-light leading-none'>
                                To win:{' '}
                            </span>
                            <span className='text-color-accent-green-900 text-xs font-normal leading-none'>
                                {formatterUSD.format(
                                    Number(currentMarket?.volumeNum)
                                )}
                            </span>
                        </div>
                    )}
                </div>
                <form
                    className='flex flex-col gap-4'
                    id='saleForm'
                    onSubmit={handleSubmit((data) =>
                        handleOrder(data, setError)
                    )}
                >
                    {formType === EFormType.MARKET ? (
                        <BuyBetInput
                            errors={errors}
                            input={input}
                            setInput={setInput}
                            handleChange={handleChangeInput}
                        />
                    ) : (
                        <LimitInput
                            errors={errors}
                            input={input}
                            setInput={setInput}
                            handleChangeAmount={handleChangeAmount}
                            handleChangeSize={handleChangeSize}
                        />
                    )}
                    <BetEventInfo />
                    <KeyPad
                        value={input}
                        handleChange={setInput}
                        keyPadOptions={keyPadOptions}
                    />
                    <ActionButton
                        content={
                            <div className='rounded-lg flex-col justify-center items-center inline-flex'>
                                <div className='self-stretch text-center text-color-neutral-alpha-900 text-sm font-semibold leading-tight'>
                                    {formStatus === ESide.BUY ? 'Bet' : 'Sell'}{' '}
                                    now
                                </div>
                                <div className='self-stretch text-color-neutral-alpha-700 text-xs font-light leading-3'>
                                    {calculatedValue}
                                </div>
                            </div>
                        }
                        formId={`saleForm`}
                        isLogin={isLogin}
                        onClickLogin={() => {
                            if (!isLogin) {
                                closeDrawer()
                                handleLogin()
                            }
                        }}
                        isPending={isSubmitting}
                        disabled={!!errors.size}
                    />
                </form>
            </div>
        </DrawerProvider>
    )
}

export default SaleDrawer
