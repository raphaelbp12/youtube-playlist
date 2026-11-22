import { useEffect, useEffectEvent, useRef, useState } from 'react'
import { hasReachedEnd, playsAfterEnd, type LoopRange } from '../lib/loop'

const CHECK_INTERVAL_MS = 50
/** Ignore the end for a moment after jumping, while the seek takes effect. */
const SEEK_SETTLE_MS = 300

/**
 * While the video plays (or when it ends), jumps back to `range.start` whenever playback
 * reaches `range.end`, so it loops forever. With a single section, finishing
 * its `repeats` plays wraps around to the same section and the count starts
 * over. Seeking before the start is left alone. A jump right after a range change
 * (playhead already past the new end) is not counted as a finished play.
 *
 * Returns how many plays have finished in the current run.
 */
export function useLoop(player: YT.Player | null, range: LoopRange | null, repeats: number) {
  // The count starts over whenever the section or repeat count changes.
  const key = range ? `${range.start}-${range.end}-${repeats}` : ''
  const [run, setRun] = useState({ key, playsDone: 0 })
  const playsDone = run.key === key ? run.playsDone : 0
  const lastSeekAt = useRef(0)
  // The key for which playback was last seen inside the range.
  const armedKey = useRef<string | null>(null)

  const check = useEffectEvent((player: YT.Player) => {
    if (!range) return
    if (performance.now() - lastSeekAt.current < SEEK_SETTLE_MS) return
    const playerState = player.getPlayerState()
    const state =
      playerState === YT.PlayerState.PLAYING
        ? 'playing'
        : playerState === YT.PlayerState.ENDED
          ? 'ended'
          : 'other'
    if (state === 'playing' && player.getCurrentTime() < range.end) armedKey.current = key
    if (!hasReachedEnd(state, player.getCurrentTime(), range.end)) return

    const counted = armedKey.current === key
    armedKey.current = null

    player.seekTo(range.start, true)
    // An ended video stays stopped after seeking.
    player.playVideo()
    lastSeekAt.current = performance.now()
    setRun({ key, playsDone: playsAfterEnd(counted, playsDone, repeats) })
  })

  useEffect(() => {
    if (!player) return

    const id = window.setInterval(() => check(player), CHECK_INTERVAL_MS)

    return () => window.clearInterval(id)
  }, [player])

  return playsDone
}
