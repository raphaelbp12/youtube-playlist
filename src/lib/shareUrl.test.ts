import { describe, expect, it } from 'vitest'
import { buildShareParams, readShareParams } from './shareUrl'

describe('share URL', () => {
  it('round-trips a video and range', () => {
    const params = buildShareParams('dQw4w9WgXcQ', { start: 83.5, end: 97 })
    expect(params).toBe('?v=dQw4w9WgXcQ&start=83.5&end=97')
    expect(readShareParams(params)).toEqual({
      videoId: 'dQw4w9WgXcQ',
      range: { start: 83.5, end: 97 },
      repeats: 1,
    })
  })

  it('treats a missing end as the end of the video', () => {
    expect(readShareParams('?v=dQw4w9WgXcQ&start=10').range).toEqual({ start: 10, end: Infinity })
    expect(buildShareParams('dQw4w9WgXcQ', { start: 10, end: Infinity })).toBe(
      '?v=dQw4w9WgXcQ&start=10',
    )
  })

  it('ignores bad or missing values', () => {
    expect(readShareParams('')).toEqual({ videoId: null, range: null, repeats: 1 })
    expect(readShareParams('?v=nope')).toEqual({ videoId: null, range: null, repeats: 1 })
    expect(readShareParams('?v=dQw4w9WgXcQ&start=abc').range).toBeNull()
  })

  it('keeps the repeat count, leaving out the default of 1', () => {
    const params = buildShareParams('dQw4w9WgXcQ', { start: 1, end: 2 }, 3)
    expect(params).toBe('?v=dQw4w9WgXcQ&start=1&end=2&repeat=3')
    expect(readShareParams(params).repeats).toBe(3)
    expect(buildShareParams('dQw4w9WgXcQ', { start: 1, end: 2 }, 1)).not.toContain('repeat')
    expect(readShareParams('?v=dQw4w9WgXcQ&repeat=abc').repeats).toBe(1)
  })
})
