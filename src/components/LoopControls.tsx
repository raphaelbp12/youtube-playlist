import { Group, NumberInput, RangeSlider, Stack } from '@mantine/core'
import { clampRange, clampRepeats, MAX_REPEATS, MIN_LOOP_LENGTH, type LoopRange } from '../lib/loop'
import { formatTime } from '../lib/time'
import { TimeInput } from './TimeInput'

interface Props {
  range: LoopRange
  duration: number
  /** How many times the section plays before moving on to the next one. */
  repeats: number
  /** Plays finished so far in the current run. */
  playsDone: number
  disabled?: boolean
  onChange: (range: LoopRange) => void
  /** Called once a change is finished (knob released or time entered). */
  onChangeEnd?: (range: LoopRange) => void
  onRepeatsChange: (repeats: number) => void
}

export function LoopControls({
  range,
  duration,
  repeats,
  playsDone,
  disabled,
  onChange,
  onChangeEnd,
  onRepeatsChange,
}: Props) {
  const apply = (next: LoopRange) => {
    const clamped = clampRange(next, duration)
    onChange(clamped)
    onChangeEnd?.(clamped)
  }

  return (
    <Stack gap="md">
      <RangeSlider
        min={0}
        max={duration}
        step={0.1}
        precision={1}
        minRange={MIN_LOOP_LENGTH}
        disabled={disabled}
        label={formatTime}
        value={[range.start, range.end]}
        onChange={([start, end]) => onChange({ start, end })}
        onChangeEnd={([start, end]) => onChangeEnd?.({ start, end })}
        aria-label="Loop range"
      />
      <Group justify="space-between" align="flex-start">
        <TimeInput
          label="Start"
          value={range.start}
          disabled={disabled}
          onCommit={(start) => apply({ ...range, start })}
        />
        <NumberInput
          label="Repeats"
          description={`Play ${playsDone + 1} of ${repeats}`}
          inputWrapperOrder={['label', 'input', 'description', 'error']}
          w={130}
          min={1}
          max={MAX_REPEATS}
          allowDecimal={false}
          allowNegative={false}
          clampBehavior="strict"
          disabled={disabled}
          value={repeats}
          onChange={(value) => {
            // Ignore the empty field while the user is retyping.
            if (typeof value === 'number') onRepeatsChange(clampRepeats(value))
          }}
        />
        <TimeInput
          label="End"
          value={range.end}
          disabled={disabled}
          onCommit={(end) => apply({ ...range, end })}
        />
      </Group>
    </Stack>
  )
}
