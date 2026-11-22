import { roundToTenths } from './time'

export interface LoopRange {
  start: number
  end: number
}

/** Shortest loop allowed, in seconds. */
export const MIN_LOOP_LENGTH = 0.5

/**
 * Keeps a range inside `[0, duration]` with `start` at least
 * `MIN_LOOP_LENGTH` before `end`.
 */
export function clampRange(range: LoopRange, duration: number): LoopRange {
  const max = roundToTenths(duration)
  const end = roundToTenths(Math.min(Math.max(range.end, MIN_LOOP_LENGTH), max))
  const start = roundToTenths(Math.min(Math.max(range.start, 0), end - MIN_LOOP_LENGTH))
  return { start: Math.max(0, start), end }
}

/** Most plays of a section the user can ask for. */
export const MAX_REPEATS = 99

/** Turns any value into a whole number of plays in `[1, MAX_REPEATS]`. */
export function clampRepeats(repeats: number): number {
  if (!Number.isFinite(repeats)) return 1
  return Math.min(Math.max(Math.round(repeats), 1), MAX_REPEATS)
}

/**
 * Called when playback reaches the end of the section. `playsDone` counts the
 * plays already finished before this one. Returns the new count, which goes
 * back to 0 once the section has played `repeats` times: playback moves on to
 * the next section, and a playlist wraps around to its first section.
 */
export function finishPlay(playsDone: number, repeats: number): number {
  const done = playsDone + 1
  return done >= repeats ? 0 : done
}
