import React, { useEffect, useMemo, useState } from 'react'
import DrawerProvider, { useDrawerContext } from '@/contexts/DrawerContext.tsx'
import { EBetOption, EFormType, ESide, OrderFormValues } from '@/types'
import { useEventContext } from '@/contexts/EventContext.tsx'
import FormSelect from '@/components/FormSelect.tsx'
import { Button } from '@/components/ui/button.tsx'
import { ArrowRightLeft, Minus, Plus, Settings } from 'lucide-react'
import { clsx } from 'clsx'
import { useAuthContext } from '@/contexts/AuthContext.tsx'
import { FieldErrors, Resolver, useForm } from 'react-hook-form'
import { Tooltip } from '@/components/ui/tooltip.tsx'

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

const resolver: Resolver<OrderFormValues> = async (values) => {
    const errors: FieldErrors = {}

    if (
        values.amount === undefined ||
        values.amount === null ||
        isNaN(values.amount) ||
        values.amount <= 0
    ) {
        errors.amount = {
            type: 'required',
            message: 'Amount is required and must be a positive number.'
        }
    }

    if (
        values.size === undefined ||
        values.size === null ||
        isNaN(values.size) ||
        values.size <= 0
    ) {
        errors.size = {
            type: 'required',
            message: 'Size is required and must be a positive number.'
        }
    }

    return {
        values: Object.keys(errors).length ? {} : values,
        errors: errors
    }
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
        selectedOrder
    } = useEventContext()
    const formTypeList: EFormType[] = Object.values(EFormType)
    const { openDrawer } = useDrawerContext()
    const [expiration, setExpiration] = useState<ExpirationType>(
        ExpirationType.UntilCancelled
    )

    const { isLogin, userAddress } = useAuthContext()
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch
    } = useForm<OrderFormValues>({ resolver })
    const onSubmit = handleSubmit((data) => {
        handleOrder({
            userAddress: userAddress ?? '',
            assetId:
                formStatus === ESide.BUY
                    ? (currentMarket?.clobTokenIds[0] ?? '')
                    : (currentMarket?.clobTokenIds[1] ?? ''),
            side: formStatus,
            price: data.amount,
            size: data.size
        })
    })

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
                    onSubmit={onSubmit}
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
                                <div className={`flex justify-around`}>
                                    <Button
                                        variant={`secondary`}
                                        size={`icon`}
                                        type={`button`}
                                        onClick={() => {
                                            setValue(
                                                'amount',
                                                Number(
                                                    (amount > 1
                                                        ? amount - 1
                                                        : amount
                                                    ).toFixed(1)
                                                )
                                            )
                                        }}
                                    >
                                        <Tooltip
                                            trigger={
                                                <Minus width={15} height={15} />
                                            }
                                            content='-$1'
                                        />
                                    </Button>
                                    <input
                                        className={clsx(
                                            'w-[100px] text-center',
                                            'border-none outline-none',
                                            'focus:outline-none'
                                        )}
                                        placeholder={`$0`}
                                        {...register('amount')}
                                    />
                                    <Button
                                        variant={`secondary`}
                                        size={`icon`}
                                        type={`button`}
                                        onClick={() =>
                                            setValue(
                                                'amount',
                                                Number((amount + 1).toFixed(1))
                                            )
                                        }
                                    >
                                        <Tooltip
                                            trigger={
                                                <Plus width={15} height={15} />
                                            }
                                            content='+$1'
                                        />
                                    </Button>
                                </div>
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
                    {isLogin ? (
                        <Button
                            variant={'primary'}
                            type={'submit'}
                            form={'saleForm'}
                        >
                            Buy
                        </Button>
                    ) : (
                        <Button variant={'primary'}>Login</Button>
                    )}
                </form>
            </div>
        </DrawerProvider>
    )
}

export default SaleDrawer
