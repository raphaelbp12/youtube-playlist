import { clampRepeats, type LoopRange } from './loop'
import { parseVideoId } from './youtube'

export interface SharedState {
  videoId: string | null
  /** `end` is `Infinity` when the link has no end, meaning "end of video". */
  range: LoopRange | null
  /** How many times the section plays. */
  repeats: number
}

/** Reads `?v=ID&start=83.5&end=97&repeat=3` from a query string. */
export function readShareParams(search: string): SharedState {
  const params = new URLSearchParams(search)
  const repeats = clampRepeats(Number(params.get('repeat') ?? 1))
  const videoId = parseVideoId(params.get('v') ?? '')
  if (!videoId) return { videoId: null, range: null, repeats }

  const start = Number(params.get('start') ?? 0)
  const endParam = params.get('end')
  const end = endParam === null ? Infinity : Number(endParam)
  if (!Number.isFinite(start) || Number.isNaN(end)) return { videoId, range: null, repeats }

  return { videoId, range: { start, end }, repeats }
}

/** Builds the query string for a video, loop range and repeat count. */
export function buildShareParams(videoId: string, range: LoopRange | null, repeats = 1): string {
  const params = new URLSearchParams({ v: videoId })
  if (range) {
    params.set('start', String(range.start))
    if (Number.isFinite(range.end)) params.set('end', String(range.end))
  }
  if (repeats !== 1) params.set('repeat', String(repeats))
  return `?${params}`
}
