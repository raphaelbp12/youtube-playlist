import { TextInput } from '@mantine/core'
import { useState, type KeyboardEvent } from 'react'
import { formatTime, parseTime } from '../lib/time'

interface Props {
  label: string
  value: number
  disabled?: boolean
  onCommit: (seconds: number) => void
}

/**
 * Shows a time as `m:ss.s`. While focused it keeps the typed text as a draft
 * and applies it on Enter or blur, so partial input doesn't move the slider.
 */
export function TimeInput({ label, value, disabled, onCommit }: Props) {
  const [draft, setDraft] = useState<string | null>(null)
  const [invalid, setInvalid] = useState(false)

  const commit = () => {
    if (draft === null) return
    const seconds = parseTime(draft)
    if (seconds === null) {
      setInvalid(true)
      return
    }
    setInvalid(false)
    setDraft(null)
    onCommit(seconds)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') commit()
    if (event.key === 'Escape') {
      setInvalid(false)
      setDraft(null)
    }
  }

  return (
    <TextInput
      label={label}
      w={130}
      disabled={disabled}
      value={draft ?? formatTime(value)}
      onChange={(event) => setDraft(event.currentTarget.value)}
      onBlur={() => {
        commit()
        // An invalid draft is discarded on blur; the field shows the last good value.
        setDraft(null)
        setInvalid(false)
      }}
      onKeyDown={handleKeyDown}
      error={invalid ? 'Use m:ss.s' : undefined}
    />
  )
}
