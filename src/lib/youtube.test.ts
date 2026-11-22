import { describe, expect, it } from 'vitest'
import { parseVideoId } from './youtube'

const ID = 'dQw4w9WgXcQ'

describe('parseVideoId', () => {
  it.each([
    ID,
    `https://www.youtube.com/watch?v=${ID}`,
    `https://youtube.com/watch?v=${ID}&t=42s&list=PL123`,
    `https://m.youtube.com/watch?v=${ID}`,
    `https://music.youtube.com/watch?v=${ID}`,
    `www.youtube.com/watch?v=${ID}`,
    `https://youtu.be/${ID}`,
    `https://youtu.be/${ID}?t=10`,
    `https://www.youtube.com/shorts/${ID}`,
    `https://www.youtube.com/embed/${ID}`,
    `https://www.youtube-nocookie.com/embed/${ID}`,
    `https://www.youtube.com/live/${ID}`,
  ])('finds the ID in %s', (input) => {
    expect(parseVideoId(input)).toBe(ID)
  })

  it.each([
    '',
    'not a url',
    'https://example.com/watch?v=dQw4w9WgXcQ',
    'https://www.youtube.com/watch?v=short',
    'https://www.youtube.com/playlist?list=PL123',
    'https://youtu.be/',
  ])('returns null for %j', (input) => {
    expect(parseVideoId(input)).toBeNull()
  })
})
