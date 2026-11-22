import { floorToTenths, roundToTenths } from './time'

export interface LoopRange {
  start: number
  end: number
}

/** Shortest loop allowed, in seconds. */
export const MIN_LOOP_LENGTH = 0.5

/**
 * Keeps a range inside `[0, duration]` with `start` at least
 * `MIN_LOOP_LENGTH` before `end`. The end never passes the real video length.
 */
export function clampRange(range: LoopRange, duration: number): LoopRange {
  const max = floorToTenths(duration)
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

/** Plays done after playback reaches the end. A jump caused by a range change (`counted` false) is not a finished play. */
export function playsAfterEnd(counted: boolean, playsDone: number, repeats: number): number {
  return counted ? finishPlay(playsDone, repeats) : playsDone
}

/**
 * Whether playback has reached the end of the section. At the end of the
 * video YouTube reports `ended` before the time reaches `end`, so that counts
 * too.
 */
export function hasReachedEnd(state: 'playing' | 'ended' | 'other', time: number, end: number): boolean {
  return state === 'ended' || (state === 'playing' && time >= end)
}

/** Whether moving the start knob to `next` should seek. `committed` is undefined until the range is known. */
export function shouldSeekToStart(committed: number | undefined, next: number): boolean {
  return committed !== undefined && next !== committed
}
