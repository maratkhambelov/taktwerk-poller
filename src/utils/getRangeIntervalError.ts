import { MAX_TIMEOUT, RangeInterval } from '../config'

/**
 * Validates a list of range interval configurations and returns the first
 * encountered error, if any.
 *
 * A valid range interval must satisfy:
 *  - `durationMs >= 0`
 *  - `intervalMs >= 0`
 *  - `intervalMs !== Infinity`
 *  - `durationMs <= MAX_TIMEOUT`
 *
 * @param rangeIntervals - An array of range interval objects to validate.
 *
 * @returns {RangeError | undefined}
 *          The first validation error found, or `undefined` if all intervals
 *          are valid.
 */
export function getRangeIntervalError(rangeIntervals: RangeInterval[]) {
  for (const rangeInterval of rangeIntervals) {
    const error = validateRangeInterval(rangeInterval)

    if (!error) {
      continue
    }

    console.error(error)

    return error
  }
}

const INTERVAL_INFINITY_ERROR = "intervalMs can't be Infinity"
const MIN_TIME_VALUE_ERROR = 'timeout values must be positive value'
const INTERVAL_MAX_TIMEOUT_ERROR = `durationMs can't be higher than ${MAX_TIMEOUT}`

function validateRangeInterval({ durationMs, intervalMs }: RangeInterval) {
  if (durationMs < 0 || intervalMs < 0) {
    return new RangeError(MIN_TIME_VALUE_ERROR)
  }

  if (intervalMs === Infinity) {
    return new RangeError(INTERVAL_INFINITY_ERROR)
  }

  if (durationMs > MAX_TIMEOUT) {
    return new RangeError(INTERVAL_MAX_TIMEOUT_ERROR)
  }
}
