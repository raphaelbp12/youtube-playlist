import { describe, expect, it } from 'vitest'
import { clampRange, clampRepeats, finishPlay } from './loop'

describe('clampRange', () => {
  it('keeps a valid range', () => {
    expect(clampRange({ start: 10, end: 20 }, 100)).toEqual({ start: 10, end: 20 })
  })

  it('limits the range to the video length', () => {
    expect(clampRange({ start: -5, end: Infinity }, 100.04)).toEqual({ start: 0, end: 100 })
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
