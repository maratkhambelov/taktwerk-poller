/**
 * Waits for a specified delay before resolving.
 *
 * @param delayMs - The delay duration in milliseconds.
 * @returns A promise that resolves after the given delay.
 */
export const waitDelay = (delayMs: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, delayMs))
