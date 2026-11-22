import { useEffect, useEffectEvent, useRef, useState } from 'react'
import { finishPlay, type LoopRange } from '../lib/loop'

const CHECK_INTERVAL_MS = 50
/** Ignore the end for a moment after jumping, while the seek takes effect. */
const SEEK_SETTLE_MS = 300

/**
 * While the video plays, jumps back to `range.start` whenever playback
 * reaches `range.end`, so it loops forever. With a single section, finishing
 * its `repeats` plays wraps around to the same section and the count starts
 * over. Seeking before the start is left alone.
 *
 * Returns how many plays have finished in the current run.
 */
export function useLoop(player: YT.Player | null, range: LoopRange | null, repeats: number) {
  // The count starts over whenever the section or repeat count changes.
  const key = range ? `${range.start}-${range.end}-${repeats}` : ''
  const [run, setRun] = useState({ key, playsDone: 0 })
  const playsDone = run.key === key ? run.playsDone : 0
  const lastSeekAt = useRef(0)

  const check = useEffectEvent((player: YT.Player) => {
    if (!range || player.getPlayerState() !== YT.PlayerState.PLAYING) return
    if (performance.now() - lastSeekAt.current < SEEK_SETTLE_MS) return
    if (player.getCurrentTime() < range.end) return

    player.seekTo(range.start, true)
    lastSeekAt.current = performance.now()
    setRun({ key, playsDone: finishPlay(playsDone, repeats) })
  })

  useEffect(() => {
    if (!player) return

    const id = window.setInterval(() => check(player), CHECK_INTERVAL_MS)

    return () => window.clearInterval(id)
  }, [player])

  return playsDone
}
