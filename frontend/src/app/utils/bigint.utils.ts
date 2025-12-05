/**
 * Utility functions for BigInt operations
 */

/**
 * Safely converts a value to BigInt
 * @param value - Value to convert (number, string, or bigint)
 * @returns BigInt value
 */
export function toBigInt(value: number | string | bigint): bigint {
    return BigInt(value.toString());
}

/**
 * Converts an array of contract values to BigInt array
 * @param values - Array of values from contract
 * @returns Array of BigInt values
 */
export function bigIntArrayFromContract(values: any[]): bigint[] {
    return values.map(value => toBigInt(value));
}
