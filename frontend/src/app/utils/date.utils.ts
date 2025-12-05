/**
 * Utility functions for date and timestamp operations
 */

/**
 * Formats a blockchain timestamp to a readable date string
 * @param timestamp - Blockchain timestamp (seconds since epoch)
 * @returns Formatted date string in Spanish locale
 */
export function formatTimestamp(timestamp: bigint): string {
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Converts a blockchain timestamp to a Date object
 * @param timestamp - Blockchain timestamp (seconds since epoch)
 * @returns Date object
 */
export function timestampToDate(timestamp: bigint): Date {
    return new Date(Number(timestamp) * 1000);
}

/**
 * Converts a Date object to a blockchain timestamp
 * @param date - Date object
 * @returns Blockchain timestamp (seconds since epoch)
 */
export function dateToTimestamp(date: Date): bigint {
    return BigInt(Math.floor(date.getTime() / 1000));
}

/**
 * Checks if a timestamp is in the past (expired)
 * @param timestamp - Blockchain timestamp to check
 * @returns true if the timestamp is in the past
 */
export function isTimestampExpired(timestamp: bigint): boolean {
    return Date.now() > Number(timestamp) * 1000;
}
