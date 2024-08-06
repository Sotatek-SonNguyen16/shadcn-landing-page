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
