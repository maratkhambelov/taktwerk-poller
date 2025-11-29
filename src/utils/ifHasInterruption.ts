/**
 * Checks whether the query has been interrupted.
 *
 * @precondition  At least one of the promises (`ifTimeout` or `ifQueryInterrupted`)
 *                must already be in a fulfilled state.
 *
 * @postcondition Returns a promise that resolves to `true` if the query was
 *                interrupted, and `false` otherwise.
 *
 * @invariant  (ifTimeout: Promise<pending>, ifQueryInterrupted: Promise<fulfilled>)  => true
 * @invariant  (ifTimeout: Promise<fulfilled>, ifQueryInterrupted: Promise<pending>)  => false
 * @invariant  (ifTimeout: Promise<fulfilled>, ifQueryInterrupted: Promise<fulfilled>) => true
 */
export function ifHasInterruption(
  ifTimeout: Promise<unknown>,
  ifQueryInterrupted: Promise<unknown>,
): Promise<boolean> {
  return Promise.race([
    ifQueryInterrupted.then(() => true),
    ifTimeout.then(() => false),
  ])
}
