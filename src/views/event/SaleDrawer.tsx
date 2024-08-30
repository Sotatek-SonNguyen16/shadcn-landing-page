import React, { useEffect, useMemo, useRef, useState } from 'react'
import DrawerProvider, { useDrawerContext } from '@/contexts/DrawerContext.tsx'
import { EBetOption, EFormType, ESide, OrderFormValues } from '@/types'
import { useEventContext } from '@/contexts/EventContext.tsx'
import { Button } from '@/components/ui/button.tsx'
import { ArrowRightLeft, ChevronLeft, Delete, RefreshCcw } from 'lucide-react'
import { useAuthContext } from '@/contexts/AuthContext.tsx'
import { useForm } from 'react-hook-form'
import { LoadingSpinner } from '@/components/ui/spinner.tsx'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx'
import { formatToCents } from '@/lib/utils.ts'
import { useEventWebSocket } from '@/contexts/WebSocketContext.tsx'

const ActionButton: React.FC<{
    content: JSX.Element
    formId: string
    isLogin: boolean
    isPending: boolean
    disabled?: boolean
}> = ({ content, formId, isLogin, isPending, disabled = false }) => {
    return (
        <div className='flex'>
            <Button
                form={formId}
                className='w-full h-auto px-4 py-2.5 rounded-lg justify-center items-center gap-2 inline-flex'
                variant='default'
                type={isLogin ? 'submit' : 'button'}
                disabled={isPending || disabled}
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
}> = ({ value, handleChange }) => {
    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'x']

    const handleKeyClick = (key: string) => {
        if (key === 'x') {
            handleChange(value.slice(0, -1))
        } else {
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
    value: string
    handleChange: (value: string) => void
}> = ({ value, handleChange }) => {
    const { selectedOrder } = useEventContext()
    const { resetOrderBook } = useEventWebSocket()
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.scrollLeft = inputRef.current.scrollWidth
        }
    }, [value])
    return (
        <div className='flex-col justify-start items-center gap-2 inline-flex'>
            <div className='h-40 pt-2 pb-7 flex-col justify-center items-center gap-2 inline-flex'>
                <div className='self-stretch justify-center items-center gap-1 inline-flex'>
                    <input
                        type='string'
                        value={value}
                        onChange={(e) => {
                            handleChange(e.target.value)
                        }}
                        readOnly={true}
                        autoFocus={true}
                        placeholder='0'
                        className='text-end w-[25%] text-white text-5xl font-normal leading-10 bg-transparent outline-none caret-color-brand-500'
                        ref={inputRef}
                        style={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            direction: 'ltr',
                            paddingRight: '1px'
                        }}
                    />
                    <div className='text-color-neutral-250 text-3xl font-light leading-10'>
                        ¢
                    </div>
                </div>
                <div className='self-stretch rounded-lg justify-center items-center gap-2 inline-flex'>
                    <div className='rounded-lg justify-start items-center gap-1 flex'>
                        <div className='text-color-neutral-700 text-sm font-light leading-tight'>
                            Your balance:
                        </div>
                        <div className='text-color-neutral-700 text-sm font-light leading-tight'>
                            $22,578.66
                        </div>
                    </div>
                    <div className='justify-center items-center gap-1 flex'>
                        <div className='h-4 pb-0.5 rounded-lg flex-col justify-center items-start inline-flex'>
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
            className='self-stretch text-center text-color-neutral-900 text-xs font-normal leading-3'
            onClick={onClickSettingButton}
        >
            {formType}
        </div>
    )
}

const SettingTransactionDrawer = () => {
    const { changeType } = useEventContext()

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
                    onClick={() => changeType(EFormType.LIMIT)}
                >
                    <div className='grow shrink basis-0 pb-0.5 rounded-lg flex-col justify-center items-start inline-flex'>
                        <div className='self-stretch text-color-neutral-900 text-base font-normal leading-normal'>
                            Limit Order
                        </div>
                        <div className='self-stretch text-color-neutral-500 text-xs font-light leading-none'>
                            Buy or sell at a specified price or better
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const SaleDrawer: React.FC = () => {
    const {
        formStatus,
        betOption,
        changeBetOption,
        currentMarket,
        handleOrder,
        selectedOrder,
        resolver
    } = useEventContext()
    const { closeDrawer } = useDrawerContext()
    const { isLogin } = useAuthContext()
    const {
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue
    } = useForm<OrderFormValues>({ resolver })

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
        if (!isNaN(parsedValue)) {
            setInput(newValue)
            setValue('size', Number(selectedOrder?.size))
            setValue('amount', parsedValue)
        }
    }

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
                            {/*<FormSelect<EFormType>*/}
                            {/*    selected={formType}*/}
                            {/*    options={formTypeList}*/}
                            {/*    onSelect={changeType}*/}
                            {/*/>*/}
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
                    onSubmit={handleSubmit(handleOrder)}
                >
                    <BuyBetInput
                        value={input}
                        handleChange={handleChangeInput}
                    />
                    <BetEventInfo />
                    <KeyPad value={input} handleChange={handleChangeInput} />

                    {errors?.size && (
                        <p className='text-color-accent-red-900 text-[12px]'>
                            {errors.size.message}
                        </p>
                    )}
                    <ActionButton
                        content={
                            <div className='rounded-lg flex-col justify-center items-center inline-flex'>
                                <div className='self-stretch text-center text-color-neutral-alpha-900 text-sm font-semibold leading-tight'>
                                    {formStatus === ESide.BUY ? 'Bet' : 'Sell'}{' '}
                                    now
                                </div>
                                <div className='self-stretch text-color-neutral-alpha-700 text-xs font-light leading-3'>
                                    {Number(selectedOrder?.size ?? 0) *
                                        Number(input)}{' '}
                                    shares
                                </div>
                            </div>
                        }
                        formId={`saleForm`}
                        isLogin={isLogin}
                        isPending={isSubmitting}
                    />
                </form>
            </div>
        </DrawerProvider>
    )
}

export default SaleDrawer
