import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/**
 * Converts an ISO date string to a human-readable format.
 * @param isoDate - The ISO date string (e.g., '2024-11-05T00:00:00Z').
 * @returns The formatted date string (e.g., 'Nov 5, 2024').
 */
export function formatDate(isoDate: string): string {
    const date = new Date(isoDate)

    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    }).format(date)
}

export function formatCurrency(value: number): string {
    if (value >= 1_000_000_000) {
        // Format billions
        return `$${(value / 1_000_000_000).toFixed(1)}b`
    } else if (value >= 1_000_000) {
        // Format millions
        return `$${(value / 1_000_000).toFixed(1)}m`
    } else if (value >= 1_000) {
        // Format thousands
        return `$${(value / 1_000).toFixed(1)}k`
    } else {
        // Format small numbers
        return `$${value.toFixed(0)}`
    }
}

export function formatToCents(value: number, digit: number = 5): string {
    const formatterCents = new Intl.NumberFormat('default', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
        maximumFractionDigits: digit
    })

    const formattedValue = formatterCents.format(value * 100)
    return formattedValue.replace('€', '¢')
}
