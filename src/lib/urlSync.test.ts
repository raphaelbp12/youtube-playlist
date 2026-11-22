import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createUrlWriter } from './urlSync'

describe('createUrlWriter', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('collapses a burst of updates into one write with the last value', () => {
    const replace = vi.fn()
    const w = createUrlWriter(replace)
    for (let i = 0; i < 150; i++) {
      w.schedule(`?v=${i}`)
      vi.advanceTimersByTime(1)
    }
    expect(replace).not.toHaveBeenCalled()
    vi.advanceTimersByTime(300)
    expect(replace).toHaveBeenCalledTimes(1)
    expect(replace).toHaveBeenCalledWith('?v=149')
  })

  it('writes each update that is spaced out', () => {
    const replace = vi.fn()
    const w = createUrlWriter(replace)
    w.schedule('?a')
    vi.advanceTimersByTime(400)
    w.schedule('?b')
    vi.advanceTimersByTime(400)
    expect(replace.mock.calls).toEqual([['?a'], ['?b']])
  })

  it('flush writes immediately and only once', () => {
    const replace = vi.fn()
    const w = createUrlWriter(replace)
    w.schedule('?a')
    w.flush()
    expect(replace).toHaveBeenCalledWith('?a')
    vi.advanceTimersByTime(1000)
    w.flush()
    expect(replace).toHaveBeenCalledTimes(1)
  })

  it('cancel prevents the write', () => {
    const replace = vi.fn()
    const w = createUrlWriter(replace)
    w.schedule('?a')
    w.cancel()
    vi.advanceTimersByTime(1000)
    w.flush()
    expect(replace).not.toHaveBeenCalled()
  })

  it('swallows errors from replace and keeps working', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const replace = vi.fn().mockImplementationOnce(() => {
      throw new Error('SecurityError')
    })
    const w = createUrlWriter(replace)
    w.schedule('?a')
    expect(() => vi.advanceTimersByTime(300)).not.toThrow()
    w.schedule('?b')
    expect(() => w.flush()).not.toThrow()
    expect(replace).toHaveBeenLastCalledWith('?b')
    warn.mockRestore()
  })
})
