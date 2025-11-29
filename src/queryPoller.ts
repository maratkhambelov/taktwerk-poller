import {
  getRangeIntervalError,
  ifHasInterruption,
  waitDelay,
  resolveCycle,
} from './utils'
import { MAX_TIMEOUT } from './config'
import {
  RangeInterval,
  InterruptedQueryResult,
  TimeoutExpiredQueryResult,
  DoneQueryResult,
} from './queryPoller.types'

export async function queryPoller<T>(
  fetchQuery: () => Promise<T | undefined>,
  rangeIntervals: RangeInterval[],
): Promise<DoneQueryResult<T> | TimeoutExpiredQueryResult>

export async function queryPoller<T>(
  fetchQuery: () => Promise<T | undefined>,
  rangeIntervals: RangeInterval[],
  interruptingPromise: Promise<unknown>,
): Promise<
  DoneQueryResult<T> | TimeoutExpiredQueryResult | InterruptedQueryResult
>

/**
 * Monitors an asynchronous query using multiple time intervals.
 *
 * @param fetchQuery - An asynchronous function that returns either the result
 *                     or `undefined` if the result is not yet available.
 * @param rangeIntervals - An array of tuples [durationMs, intervalMs], where:
 *                         • durationMs — maximum time allowed for this monitoring stage,
 *                         • intervalMs — delay between repeated queries in this stage.
 * @param interruptingPromise - A promise that resolves to `true` if the operation
 *                              is interrupted.
 *
 * @returns {
 *   Promise<DoneQueryResult<T> | TimeoutExpiredQueryResult> |
 *   Promise<DoneQueryResult<T> | TimeoutExpiredQueryResult | InterruptedQueryResult>
 * }
 * The final outcome of the operation: the query result (if completed), a timeout
 * status, or—if interruptions are enabled—an interruption status.
 */
export async function queryPoller<T>(
  fetchQuery: () => Promise<T | undefined>,
  rangeIntervals: RangeInterval[] = [
    { durationMs: MAX_TIMEOUT, intervalMs: 1000 },
  ],
  interruptingPromise = new Promise(function neverInterrupt() {
    void 0
  }),
): Promise<
  DoneQueryResult<T> | TimeoutExpiredQueryResult | InterruptedQueryResult
> {
  const rangeIntervalError = getRangeIntervalError(rangeIntervals)

  if (rangeIntervalError) {
    return Promise.reject(rangeIntervalError)
  }

  for (const { durationMs, intervalMs } of rangeIntervals) {
    const durationTimeoutPromise = waitDelay(durationMs)
    const createIntervalTimeoutPromise = () => waitDelay(intervalMs)

    const data = await resolveCycle(fetchQuery, () => {
      return Promise.race([
        createIntervalTimeoutPromise().then(() => true),
        durationTimeoutPromise.then(() => false),
        interruptingPromise.then(() => false),
      ])
    })

    if (data) {
      return {
        data,
        status: 'DONE' as const,
      }
    }

    if (await ifHasInterruption(durationTimeoutPromise, interruptingPromise)) {
      return {
        data: null,
        status: 'INTERRUPTED' as const,
      }
    }
  }

  return {
    data: null,
    status: 'TIMEOUT_EXPIRED' as const,
  }
}
