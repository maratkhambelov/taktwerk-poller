export interface DoneQueryResult<T> {
  data: T
  status: 'DONE'
}

export interface InterruptedQueryResult {
  data: null
  status: 'INTERRUPTED'
}

export interface TimeoutExpiredQueryResult {
  data: null
  status: 'TIMEOUT_EXPIRED'
}

export interface RangeInterval {
  durationMs: number
  intervalMs: number
}
