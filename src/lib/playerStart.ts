/** The YouTube `start` player parameter only accepts whole seconds. */
export function playerStartParam(startAt: number): number {
  return Math.floor(startAt)
}

/** True when the floored `start` parameter lands before the real start. */
export function needsFractionalSeek(startAt: number): boolean {
  return Number.isFinite(startAt) && startAt > 0 && startAt % 1 !== 0
}
