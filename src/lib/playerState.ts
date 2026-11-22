export interface PlayerState {
  player: YT.Player | null
  duration: number
  error: string | null
}

export type PlayerAction =
  | { type: 'reset' }
  | { type: 'ready'; player: YT.Player; duration: number }
  | { type: 'error'; message: string }

export const initialPlayerState: PlayerState = { player: null, duration: 0, error: null }

/** `player` and `error` are mutually exclusive: an error always drops the player. */
export function playerReducer(_state: PlayerState, action: PlayerAction): PlayerState {
  switch (action.type) {
    case 'reset':
      return initialPlayerState
    case 'ready':
      return { player: action.player, duration: action.duration, error: null }
    case 'error':
      return { player: null, duration: 0, error: action.message }
  }
}
