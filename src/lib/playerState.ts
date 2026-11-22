export interface PlayerState {
  /** The video `player` was created for; guards against a stale player after a switch. */
  videoId: string | null
  player: YT.Player | null
  duration: number
  error: string | null
}

export type PlayerAction =
  | { type: 'reset' }
  | { type: 'ready'; videoId: string; player: YT.Player; duration: number }
  | { type: 'error'; message: string }

export const initialPlayerState: PlayerState = { videoId: null, player: null, duration: 0, error: null }

/** `player` and `error` are mutually exclusive: an error always drops the player. */
export function playerReducer(_state: PlayerState, action: PlayerAction): PlayerState {
  switch (action.type) {
    case 'reset':
      return initialPlayerState
    case 'ready':
      return { videoId: action.videoId, player: action.player, duration: action.duration, error: null }
    case 'error':
      return { videoId: null, player: null, duration: 0, error: action.message }
  }
}
