declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void
  }
}

let apiPromise: Promise<typeof YT> | null = null

/** Loads the YouTube IFrame Player API script once and resolves with `YT`. */
export function loadYouTubeApi(): Promise<typeof YT> {
  if (apiPromise) return apiPromise

  apiPromise = new Promise((resolve, reject) => {
    if (window.YT?.Player) {
      resolve(window.YT)
      return
    }
    const previous = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      previous?.()
      resolve(window.YT)
    }
    const script = document.createElement('script')
    script.src = 'https://www.youtube.com/iframe_api'
    script.onerror = () => {
      apiPromise = null
      reject(new Error('Could not load the YouTube player.'))
    }
    document.head.append(script)
  })
  return apiPromise
}
