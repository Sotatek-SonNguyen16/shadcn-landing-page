import React from 'react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select.tsx'

interface FormSelectProps<T extends string> {
    selected: T
    options: T[]
    onSelect: (option: T) => void
}

const FormSelect = <T extends string>({
    options,
    onSelect,
    selected
}: FormSelectProps<T>): React.ReactElement => {
    return (
        <Select
            onValueChange={(value) => {
                onSelect(value as T)
            }}
        >
            <SelectTrigger className='w-auto gap-1 rounded-full font-semibold'>
                <SelectValue placeholder={selected} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {options.map((option, index) => (
                        <SelectItem
                            key={`${option}-${index}`}
                            value={`${option}`}
                        >
                            {option}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}

export default FormSelect
