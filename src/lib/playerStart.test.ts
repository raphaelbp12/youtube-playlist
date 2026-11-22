import { describe, expect, it } from 'vitest'
import { needsFractionalSeek, playerStartParam } from './playerStart'

describe('playerStartParam', () => {
  it.each([
    [83.9, 83],
    [83, 83],
    [0, 0],
  ])('floors %s to %s', (startAt, expected) => {
    expect(playerStartParam(startAt)).toBe(expected)
  })
})

describe('needsFractionalSeek', () => {
  it.each([83.9, 0.5])('is true for %s', (startAt) => {
    expect(needsFractionalSeek(startAt)).toBe(true)
  })
  it.each([83, 0, NaN, Infinity, -1.5])('is false for %s', (startAt) => {
    expect(needsFractionalSeek(startAt)).toBe(false)
  })
})
