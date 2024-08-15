import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import DrawerProvider, { useDrawerContext } from '@/contexts/DrawerContext.tsx'
import { EBetOption, EFormType, ESide, OrderFormValues } from '@/types'
import { useEventContext } from '@/contexts/EventContext.tsx'
import FormSelect from '@/components/FormSelect.tsx'
import { Button } from '@/components/ui/button.tsx'
import { ArrowRightLeft, Minus, Plus, Settings } from 'lucide-react'
import { clsx } from 'clsx'
import { useAuthContext } from '@/contexts/AuthContext.tsx'
import { useForm, UseFormSetValue } from 'react-hook-form'
import TooltipIcon from '@/components/TooltipIcon.tsx'
import { LoadingSpinner } from '@/components/ui/spinner.tsx'

const InputHorizontal: React.FC<{ label: string; content: JSX.Element }> = ({
    content,
    label
}) => {
    return (
        <div className={clsx('flex justify-between items-center px-4 py-4')}>
            <div className='w-[50%] font-semibold'>{label}</div>
            <div>{content}</div>
        </div>
    )
}

enum ExpirationType {
    UntilCancelled = 'Until cancelled',
    EndOfDay = 'End of day',
    Custom = 'Custom'
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

const CentsInputField: React.FC<{
    setValue: UseFormSetValue<OrderFormValues>
    name: keyof OrderFormValues
    placeholder: string
    onChange: (value: number) => void
    value: number
}> = ({ value, placeholder, name, setValue, onChange }) => {
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
        <div className='flex justify-around'>
            <Button
                variant='secondary'
                size='icon'
                type='button'
                onClick={() => onChange(-1)}
            >
                <TooltipIcon
                    trigger={<Minus width={15} height={15} />}
                    content={`-$1`}
                />
            </Button>
            <input
                ref={inputRef}
                className={clsx(
                    'w-[100px] text-center',
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
                onClick={() => onChange(1)}
            >
                <TooltipIcon
                    trigger={<Plus width={15} height={15} />}
                    content={`+$1`}
                />
            </Button>
        </div>
    )
}

const SaleDrawer: React.FC = () => {
    const {
        changeForm,
        changeType,
        formType,
        formStatus,
        betOption,
        changeBetOption,
        currentMarket,
        handleOrder,
        selectedOrder,
        resolver
    } = useEventContext()
    const formTypeList: EFormType[] = Object.values(EFormType)
    const { openDrawer } = useDrawerContext()
    const [expiration, setExpiration] = useState<ExpirationType>(
        ExpirationType.UntilCancelled
    )

    const { isLogin } = useAuthContext()
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        watch
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

    return (
        <DrawerProvider>
            <div className='w-full h-auto flex flex-col py-2'>
                <div className={`w-full flex px-4`}>
                    <div className='flex-1 flex gap-2 items-center'>
                        <Button
                            className='rounded-3xl'
                            variant={
                                formStatus === ESide.BUY ? 'default' : 'outline'
                            }
                            onClick={() => changeForm(ESide.BUY)}
                        >
                            Buy
                        </Button>
                        <Button
                            className='rounded-3xl'
                            variant={
                                formStatus === ESide.SELL
                                    ? 'default'
                                    : 'outline'
                            }
                            onClick={() => changeForm(ESide.SELL)}
                        >
                            Sell
                        </Button>
                    </div>
                    <div className='flex gap-2 items-center'>
                        <FormSelect<EFormType>
                            selected={formType}
                            options={formTypeList}
                            onSelect={changeType}
                        />
                        <Button
                            variant={'outline'}
                            size={`icon`}
                            onClick={() => {
                                openDrawer({
                                    content: <div>Trade Settings</div>
                                })
                            }}
                        >
                            <Settings width={20} height={20} />
                        </Button>
                    </div>
                </div>
                <form
                    className='p-4 flex flex-col gap-4'
                    id='saleForm'
                    onSubmit={handleSubmit(handleOrder)}
                >
                    <div className='flex justify-between items-center'>
                        <Button
                            className='gap-2'
                            variant={
                                betOption === EBetOption.YES
                                    ? 'successGhost'
                                    : 'accentGhost'
                            }
                            size={`iconGroup`}
                            onClick={() =>
                                changeBetOption(
                                    betOption === EBetOption.YES
                                        ? EBetOption.NO
                                        : EBetOption.YES
                                )
                            }
                        >
                            {betOption === EBetOption.YES ? 'Yes' : 'No'}
                            <ArrowRightLeft width={15} height={15} />
                        </Button>
                        {formStatus === ESide.BUY && (
                            <div className=''>
                                <span className='text-gray-500'>To win: </span>
                                <span className='text-green-600'>
                                    {formatterUSD.format(
                                        Number(currentMarket?.volumeNum)
                                    )}
                                </span>
                            </div>
                        )}
                    </div>

                    <div
                        className={clsx(
                            'flex flex-col border-[1px] border-gray-200 rounded-xl'
                        )}
                    >
                        <InputHorizontal
                            label='Limit Price'
                            content={
                                <CentsInputField
                                    placeholder='0¢'
                                    setValue={setValue}
                                    name={'amount'}
                                    onChange={(val) =>
                                        updateValue('amount', val)
                                    }
                                    value={watch('amount', 0)}
                                />
                            }
                        />
                        <InputHorizontal
                            label='Shares'
                            content={
                                <div>
                                    <input
                                        className={clsx(
                                            'w-[100px] text-center',
                                            'border-none outline-none',
                                            'focus:outline-none'
                                        )}
                                        placeholder={`0`}
                                        {...register('size')}
                                    />
                                </div>
                            }
                        />
                        <InputHorizontal
                            label='Expiration'
                            content={
                                <div>
                                    <FormSelect<ExpirationType>
                                        selected={expiration}
                                        options={[
                                            ExpirationType.UntilCancelled,
                                            ExpirationType.EndOfDay,
                                            ExpirationType.Custom
                                        ]}
                                        onSelect={(value) => {
                                            setExpiration(value)
                                            if (
                                                value === ExpirationType.Custom
                                            ) {
                                                openDrawer({
                                                    content: (
                                                        <div>
                                                            Select order
                                                            expiration
                                                        </div>
                                                    )
                                                })
                                            }
                                        }}
                                    />
                                </div>
                            }
                        />
                    </div>
                    {errors?.size && (
                        <p className='text-red-600 text-[12px]'>
                            {errors.size.message}
                        </p>
                    )}
                    <div className='text-center'>{`Total: ${formatterUSD.format(
                        Number(currentMarket?.volumeNum)
                    )}`}</div>
                    <ActionButton
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
