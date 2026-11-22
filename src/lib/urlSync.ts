export const URL_SYNC_DELAY_MS = 300

/**
 * Debounces writes to the page URL. Browsers rate-limit `history.replaceState`
 * (Safari throws a SecurityError past 100 calls / 10 s), so a drag must not write per step.
 */
export function createUrlWriter(replace: (params: string) => void, delayMs = URL_SYNC_DELAY_MS) {
  let pending: string | null = null
  let timer: ReturnType<typeof setTimeout> | undefined

  const clear = () => {
    if (timer !== undefined) clearTimeout(timer)
    timer = undefined
  }

  const flush = () => {
    clear()
    if (pending === null) return
    const value = pending
    pending = null
    try {
      replace(value)
    } catch (err) {
      console.warn('Could not update the page URL', err)
    }
  }

  const schedule = (params: string) => {
    pending = params
    clear()
    timer = setTimeout(flush, delayMs)
  }

  const cancel = () => {
    clear()
    pending = null
  }

  return { schedule, flush, cancel }
}
