import { describe, expect, it } from 'vitest'
import { floorToTenths, formatTime, parseTime } from './time'

describe('floorToTenths', () => {
  it.each([
    [100.06, 100],
    [100.1, 100.1],
    [0.3, 0.3],
    [0.29, 0.2],
    [0, 0],
  ])('floors %s to %s', (seconds, expected) => {
    expect(floorToTenths(seconds)).toBe(expected)
  })
})

describe('formatTime', () => {
  it.each([
    [0, '0:00.0'],
    [5.25, '0:05.3'],
    [83.5, '1:23.5'],
    [599.96, '10:00.0'],
    [3723.4, '1:02:03.4'],
  ])('formats %s as %s', (seconds, text) => {
    expect(formatTime(seconds)).toBe(text)
  })
})

describe('parseTime', () => {
  it.each([
    ['90', 90],
    ['90.55', 90.6],
    ['1:30', 90],
    ['1:30.5', 90.5],
    [' 0:05.0 ', 5],
    ['1:02:03.4', 3723.4],
  ])('parses %s as %s', (text, seconds) => {
    expect(parseTime(text)).toBe(seconds)
  })

  it.each(['', '1:', ':30', 'abc', '1:60', '1:60:00', '-5', '1:2:3:4', '1.5:00'])(
    'rejects %j',
    (text) => {
      expect(parseTime(text)).toBeNull()
    },
  )

  it('round-trips with formatTime', () => {
    for (const seconds of [0, 0.1, 59.9, 61.2, 3599.9, 3600]) {
      expect(parseTime(formatTime(seconds))).toBe(seconds)
    }
  })
})
