/** A player that finished loading, tagged with the video it belongs to. */
export interface Ready<P> {
  videoId: string
  player: P
  duration: number
}

/**
 * Returns the player and duration only if they belong to `videoId`.
 * Otherwise they are stale (from a previous video) and must not be used.
 */
export function readyFor<P>(
  ready: Ready<P> | null,
  videoId: string | null,
): { player: P | null; duration: number } {
  if (ready && ready.videoId === videoId) return { player: ready.player, duration: ready.duration }
  return { player: null, duration: 0 }
}
