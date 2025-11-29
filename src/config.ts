export enum TIME_UNITS {
  SECOND = 1000,
  MINUTE = 60 * TIME_UNITS.SECOND,
  HOUR = 60 * TIME_UNITS.MINUTE,
}

export interface RangeInterval {
  durationMs: number
  intervalMs: number
}
export const MAX_TIMEOUT = 24 * TIME_UNITS.HOUR
