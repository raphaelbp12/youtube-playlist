import { Button, Group, TextInput } from '@mantine/core'
import { useState, type FormEvent } from 'react'
import { parseVideoId } from '../lib/youtube'

interface Props {
  onSubmit: (videoId: string) => void
}

export function UrlForm({ onSubmit }: Props) {
  const [text, setText] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const videoId = parseVideoId(text)
    if (!videoId) {
      setError('Enter a YouTube link, e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ')
      return
    }
    setError(null)
    onSubmit(videoId)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Group align="flex-start" wrap="nowrap">
        <TextInput
          flex={1}
          aria-label="YouTube URL"
          placeholder="Paste a YouTube link"
          value={text}
          onChange={(event) => setText(event.currentTarget.value)}
          error={error}
        />
        <Button type="submit">Load</Button>
      </Group>
    </form>
  )
}
