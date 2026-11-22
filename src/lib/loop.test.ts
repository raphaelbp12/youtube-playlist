import { describe, expect, it } from 'vitest'
import { clampRange, clampRepeats, finishPlay, hasReachedEnd, shouldSeekToStart } from './loop'

describe('clampRange', () => {
  it('keeps a valid range', () => {
    expect(clampRange({ start: 10, end: 20 }, 100)).toEqual({ start: 10, end: 20 })
  })

  it('limits the range to the video length', () => {
    expect(clampRange({ start: -5, end: Infinity }, 100.04)).toEqual({ start: 0, end: 100 })
  })

  it('never lets the end pass the real video length', () => {
    expect(clampRange({ start: 0, end: Infinity }, 100.06)).toEqual({ start: 0, end: 100 })
    expect(clampRange({ start: 0, end: Infinity }, 100.1).end).toBe(100.1)
    expect(clampRange({ start: 0, end: Infinity }, 100).end).toBe(100)
    expect(clampRange({ start: 0, end: 500 }, 100.06).end).toBe(100)
    for (const d of [100.01, 100.05, 100.06, 100.09, 0.7, 59.99]) {
      expect(clampRange({ start: 0, end: Infinity }, d).end).toBeLessThanOrEqual(d)
    }
  })

  it('keeps start at least half a second before end', () => {
    expect(clampRange({ start: 20, end: 20 }, 100)).toEqual({ start: 19.5, end: 20 })
    expect(clampRange({ start: 50, end: 10 }, 100)).toEqual({ start: 9.5, end: 10 })
  })
})

describe('clampRepeats', () => {
  it('keeps whole numbers between 1 and 99', () => {
    expect(clampRepeats(3)).toBe(3)
    expect(clampRepeats(2.6)).toBe(3)
    expect(clampRepeats(0)).toBe(1)
    expect(clampRepeats(500)).toBe(99)
    expect(clampRepeats(NaN)).toBe(1)
  })
})

describe('finishPlay', () => {
  it('starts the count over after every play by default', () => {
    expect(finishPlay(0, 1)).toBe(0)
  })

  it('counts plays and starts over once the section has played the chosen number of times', () => {
    expect(finishPlay(0, 3)).toBe(1)
    expect(finishPlay(1, 3)).toBe(2)
    expect(finishPlay(2, 3)).toBe(0)
  })
})

describe('hasReachedEnd', () => {
  it('is true once a playing video reaches the end time', () => {
    expect(hasReachedEnd('playing', 19.9, 20)).toBe(false)
    expect(hasReachedEnd('playing', 20, 20)).toBe(true)
  })

  it('is true when the video has ended before the end time', () => {
    expect(hasReachedEnd('ended', 99.8, 100)).toBe(true)
  })

  it('is false for other states', () => {
    expect(hasReachedEnd('other', 50, 20)).toBe(false)
  })
})

describe('shouldSeekToStart', () => {
  it('does not seek before the start is known', () => {
    expect(shouldSeekToStart(undefined, 0)).toBe(false)
  })

  it('does not seek when the start is unchanged', () => {
    expect(shouldSeekToStart(0, 0)).toBe(false)
    expect(shouldSeekToStart(12, 12)).toBe(false)
  })

  it('seeks when the start changed', () => {
    expect(shouldSeekToStart(0, 12)).toBe(true)
  })
})
