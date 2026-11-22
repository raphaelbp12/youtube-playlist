const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/

/**
 * Extracts the 11-character video ID from a YouTube URL or a bare ID.
 * Returns `null` when no ID can be found.
 */
export function parseVideoId(input: string): string | null {
  const text = input.trim()
  if (VIDEO_ID.test(text)) return text

  let url: URL
  try {
    url = new URL(/^https?:\/\//i.test(text) ? text : `https://${text}`)
  } catch {
    return null
  }

  const host = url.hostname.replace(/^(www|m|music)\./, '')
  let id: string | null = null

  if (host === 'youtu.be') {
    id = url.pathname.split('/')[1] ?? null
  } else if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
    if (url.pathname === '/watch') {
      id = url.searchParams.get('v')
    } else {
      const match = url.pathname.match(/^\/(?:embed|shorts|live|v)\/([^/]+)/)
      id = match?.[1] ?? null
    }
  }

  return id && VIDEO_ID.test(id) ? id : null
}
