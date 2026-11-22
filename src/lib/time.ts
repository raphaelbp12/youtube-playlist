/** Times are stored in seconds, rounded to tenths. */
export function roundToTenths(seconds: number): number {
  return Math.round(seconds * 10) / 10
}

/** Rounds down to tenths; the epsilon absorbs float error on exact tenths (100.1*10 = 1000.9999999999999). */
export function floorToTenths(seconds: number): number {
  return Math.floor(seconds * 10 + 1e-9) / 10
}

/**
 * Formats seconds as `m:ss.s` (or `h:mm:ss.s` for an hour or more).
 */
export function formatTime(seconds: number): string {
  const tenths = Math.round(Math.max(0, seconds) * 10)
  const h = Math.floor(tenths / 36000)
  const m = Math.floor((tenths % 36000) / 600)
  const s = (tenths % 600) / 10
  const ss = s.toFixed(1).padStart(4, '0')
  return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${ss}` : `${m}:${ss}`
}

/**
 * Parses `90`, `90.5`, `1:30`, `1:30.5` or `1:02:03.4` into seconds.
 * Returns `null` when the text is not a valid time.
 */
export function parseTime(text: string): number | null {
  const parts = text.trim().split(':')
  if (parts.length > 3) return null

  const secondsPart = parts.pop()!
  if (!/^\d+(\.\d+)?$/.test(secondsPart)) return null
  if (!parts.every((p) => /^\d+$/.test(p))) return null

  const seconds = Number(secondsPart)
  // Seconds and minutes below a larger unit must be < 60.
  if (parts.length > 0 && seconds >= 60) return null
  if (parts.length === 2 && Number(parts[1]) >= 60) return null

  const [minutes = 0, hours = 0] = parts.map(Number).reverse()
  return roundToTenths(hours * 3600 + minutes * 60 + seconds)
}
