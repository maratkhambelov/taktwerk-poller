import { describe, expect, it, vi } from 'vitest'
import { resolveCycle } from '../src/utils/resolveCycle'

describe(resolveCycle, () => {
  it('should NOT call shouldFetchMore if fetchQuery returned data', async () => {
    const EXPECTED_RESULT = 'EXPECTED_RESULT'

    const fetchQuery = vi.fn().mockResolvedValue(EXPECTED_RESULT)
    const shouldFetchMore = vi.fn().mockResolvedValue(false)

    const result = await resolveCycle(fetchQuery, shouldFetchMore)

    expect(result).toStrictEqual(EXPECTED_RESULT)
    expect(fetchQuery).toHaveBeenCalledTimes(1)
    expect(shouldFetchMore).toHaveBeenCalledTimes(0)
  })

  it('should throw an error if fetchQuery fails', async () => {
    const EXPECTED_ERROR_MESSAGE = 'EXPECTED_ERROR'

    const fetchQuery = vi
      .fn()
      .mockRejectedValue(new Error(EXPECTED_ERROR_MESSAGE))
    const shouldFetchMore = vi.fn().mockResolvedValue(false)

    await expect(resolveCycle(fetchQuery, shouldFetchMore)).rejects.toThrow(
      EXPECTED_ERROR_MESSAGE,
    )
  })

  it('should NOT re-run fetchQuery if shouldFetchMore returned false', async () => {
    const EXPECTED_RESULT = undefined

    const fetchQuery = vi.fn().mockResolvedValue(EXPECTED_RESULT)
    const shouldFetchMore = vi.fn().mockResolvedValue(false)

    const result = await resolveCycle(fetchQuery, shouldFetchMore)

    expect(result).toStrictEqual(EXPECTED_RESULT)
    expect(fetchQuery).toHaveBeenCalledTimes(1)
    expect(shouldFetchMore).toHaveBeenCalledTimes(1)
  })
})
