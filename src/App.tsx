import { Alert, AspectRatio, Button, Container, CopyButton, Group, Paper, Stack, Text, Title } from '@mantine/core'
import { useEffect, useRef, useState } from 'react'
import { LoopControls } from './components/LoopControls'
import { UrlForm } from './components/UrlForm'
import { useLoop } from './hooks/useLoop'
import { useYouTubePlayer } from './hooks/useYouTubePlayer'
import { clampRange, shouldSeekToStart, type LoopRange } from './lib/loop'
import { buildShareParams, readShareParams } from './lib/shareUrl'

const initial = readShareParams(window.location.search)

function App() {
  const [videoId, setVideoId] = useState(initial.videoId)
  // What the user (or a shared link) asked for; `null` means the whole video.
  const [range, setRange] = useState<LoopRange | null>(initial.range)
  const [repeats, setRepeats] = useState(initial.repeats)
  const { containerRef, player, duration, error } = useYouTubePlayer({
    videoId,
    startAt: range?.start ?? 0,
  })
  // Once the length is known, fit the range to it (whole video by default).
  const loopRange = player ? clampRange(range ?? { start: 0, end: duration }, duration) : null
  const playsDone = useLoop(player, loopRange, repeats)

  const shareParams = videoId ? buildShareParams(videoId, loopRange ?? range, repeats) : ''
  const shareUrl = `${window.location.origin}${window.location.pathname}${shareParams}`

  // Keep the page URL shareable.
  useEffect(() => {
    if (shareParams) window.history.replaceState(null, '', shareParams)
  }, [shareParams])

  // Jump to the new start whenever the user moves it, so they hear the loop point.
  const committedStart = useRef(range?.start)
  // Seed it once the range is known, so an end-only change doesn't count as a start change.
  useEffect(() => {
    if (loopRange && committedStart.current === undefined) committedStart.current = loopRange.start
  }, [loopRange])
  const handleChangeEnd = (next: LoopRange) => {
    if (shouldSeekToStart(committedStart.current, next.start)) player?.seekTo(next.start, true)
    committedStart.current = next.start
  }

  const handleLoad = (id: string) => {
    setRange(null)
    committedStart.current = undefined
    setVideoId(id)
  }

  return (
    <Container size="md" py="xl">
      <Stack gap="lg">
        <Title order={1}>YouTube Looper</Title>
        <UrlForm onSubmit={handleLoad} />

        {error && (
          <Alert color="red" title="Can't play this video">
            {error}
          </Alert>
        )}

        {videoId && (
          <AspectRatio ratio={16 / 9}>
            <div ref={containerRef} />
          </AspectRatio>
        )}

        {videoId && (
          <Paper withBorder p="md">
            {loopRange ? (
              <Stack gap="md">
                <LoopControls
                  range={loopRange}
                  duration={duration}
                  repeats={repeats}
                  playsDone={playsDone}
                  onChange={setRange}
                  onChangeEnd={handleChangeEnd}
                  onRepeatsChange={setRepeats}
                />
                <Group justify="flex-end">
                  <CopyButton value={shareUrl}>
                    {({ copied, copy }) => (
                      <Button variant="light" onClick={copy}>
                        {copied ? 'Link copied' : 'Copy link to this loop'}
                      </Button>
                    )}
                  </CopyButton>
                </Group>
              </Stack>
            ) : (
              <Text c="dimmed">{error ? 'No loop controls available.' : 'Loading video…'}</Text>
            )}
          </Paper>
        )}
      </Stack>
    </Container>
  )
}

export default App
