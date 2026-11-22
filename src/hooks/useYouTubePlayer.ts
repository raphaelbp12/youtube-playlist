import { useEffect, useEffectEvent, useRef, useState } from 'react'
import { loadYouTubeApi } from '../lib/loadYouTubeApi'

const ERROR_MESSAGES: Record<number, string> = {
  2: 'That video ID is not valid.',
  5: 'This video cannot be played in the browser player.',
  100: 'This video was not found. It may be private or deleted.',
  101: 'The owner of this video does not allow it to be embedded.',
  150: 'The owner of this video does not allow it to be embedded.',
}

interface Options {
  videoId: string | null
  /** Where playback starts when the video loads, in seconds. */
  startAt: number
}

/**
 * Creates a YouTube player inside the returned container ref.
 * A new player is created whenever `videoId` changes.
 */
export function useYouTubePlayer({ videoId, startAt }: Options) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [player, setPlayer] = useState<YT.Player | null>(null)
  const [duration, setDuration] = useState(0)
  const [error, setError] = useState<string | null>(null)

  // Only read when a new video loads, so it doesn't recreate the player.
  const getStartAt = useEffectEvent(() => startAt)

  useEffect(() => {
    const container = containerRef.current
    if (!videoId || !container) return

    let cancelled = false
    let instance: YT.Player | null = null
    setPlayer(null)
    setDuration(0)
    setError(null)

    loadYouTubeApi()
      .then((api) => {
        if (cancelled) return
        // The API replaces this element with an iframe, so React must not own it.
        const target = document.createElement('div')
        container.append(target)
        instance = new api.Player(target, {
          videoId,
          width: '100%',
          height: '100%',
          playerVars: { playsinline: 1, start: Math.floor(getStartAt()) },
          events: {
            onReady: (event) => {
              if (cancelled) return
              const length = event.target.getDuration()
              if (length > 0) {
                setDuration(length)
                setPlayer(event.target)
              } else {
                setError('Live streams are not supported because they have no fixed length.')
              }
            },
            onError: (event) => {
              if (cancelled) return
              setError(ERROR_MESSAGES[event.data] ?? 'This video could not be played.')
            },
          },
        })
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message)
      })

    return () => {
      cancelled = true
      instance?.destroy()
      container.replaceChildren()
    }
  }, [videoId])

  return { containerRef, player, duration, error }
}
