/**
 * Repeatedly executes a query until it produces a result or until
 * `shouldFetchMore` returns `true`. Executed at least once.
 *
 * @param fetchQuery - An asynchronous function that returns either the result
 *                     or `undefined`.
 * @param shouldFetchMore - An asynchronous function that returns `true` if the
 *                          query should be repeated.
 *
 * @returns {Promise<T | undefined>} The query result or `undefined`.
 */
export const resolveCycle = async <T>(
  fetchQuery: () => Promise<T | undefined>,
  shouldFetchMore: () => Promise<boolean>,
): Promise<T | undefined> => {
  do {
    const data: T | undefined = await fetchQuery()

    if (data) {
      return data
    }
  } while (await shouldFetchMore())
}
