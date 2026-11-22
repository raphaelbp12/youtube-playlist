import { describe, expect, it } from 'vitest'
import { initialPlayerState, playerReducer } from './playerState'

const player = {} as YT.Player

describe('playerReducer', () => {
  it('drops the player when an error follows ready', () => {
    const ready = playerReducer(initialPlayerState, { type: 'ready', player, duration: 120 })
    const next = playerReducer(ready, { type: 'error', message: 'nope' })
    expect(next).toEqual({ player: null, duration: 0, error: 'nope' })
  })

  it('handles an error before ready', () => {
    const next = playerReducer(initialPlayerState, { type: 'error', message: 'nope' })
    expect(next).toEqual({ player: null, duration: 0, error: 'nope' })
  })

  it('resets to the initial state after an error', () => {
    const errored = playerReducer(initialPlayerState, { type: 'error', message: 'nope' })
    expect(playerReducer(errored, { type: 'reset' })).toEqual(initialPlayerState)
  })

  it('sets player and duration on ready and clears the error', () => {
    const errored = playerReducer(initialPlayerState, { type: 'error', message: 'nope' })
    const next = playerReducer(errored, { type: 'ready', player, duration: 90 })
    expect(next).toEqual({ player, duration: 90, error: null })
  })
})
