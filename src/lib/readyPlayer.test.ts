import { describe, expect, it } from 'vitest'
import { buildShareParams } from './shareUrl'
import { clampRange } from './loop'
import { readyFor } from './readyPlayer'

describe('readyFor', () => {
  const player = {}
  const ready = { videoId: 'a', player, duration: 100 }

  it('returns the player and duration when the video matches', () => {
    expect(readyFor(ready, 'a')).toEqual({ player, duration: 100 })
  })

  it('returns null and 0 when the video differs', () => {
    expect(readyFor(ready, 'b')).toEqual({ player: null, duration: 0 })
  })

  it('returns null and 0 for null state or null videoId', () => {
    expect(readyFor(null, 'a')).toEqual({ player: null, duration: 0 })
    expect(readyFor(ready, null)).toEqual({ player: null, duration: 0 })
  })

  it('never pairs a new video with the old duration in the share URL', () => {
    const { player: p, duration } = readyFor(ready, 'b')
    const range = null
    const loopRange = p ? clampRange({ start: 0, end: duration }, duration) : null
    const params = buildShareParams('b', loopRange ?? range, 1)
    expect(params).toBe(buildShareParams('b', null, 1))
    expect(params).not.toContain('end=')
  })
})
