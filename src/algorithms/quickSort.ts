import { Bar } from '../components/ArrayVisualizer'

export interface QuickSortStep {
  bars: Bar[]
  pivot?: number
  left?: number
  right?: number
  comparing?: number[]
}

export function* quickSort(arr: number[]): Generator<QuickSortStep> {
  const bars: Bar[] = arr.map((val, idx) => ({
    value: val,
    state: 'default',
    index: idx,
  }))

  function* sort(bars: Bar[], left: number, right: number): Generator<QuickSortStep> {
    if (left < right) {
      const pivotIdx = yield* partition(bars, left, right)
      yield* sort(bars, left, pivotIdx - 1)
      yield* sort(bars, pivotIdx + 1, right)
    } else if (left === right) {
      // Single element is sorted
      const single: Bar[] = bars.map((bar, idx) => ({
        ...bar,
        state: idx === left ? 'sorted' : bar.state,
      }))
      yield { bars: single, pivot: left, left, right }
    }
  }

  function* partition(
    bars: Bar[],
    left: number,
    right: number
  ): Generator<QuickSortStep> {
    const pivot = bars[right]
    let i = left - 1

    // Highlight pivot
    const pivotHighlight: Bar[] = bars.map((bar, idx) => ({
      ...bar,
      state: idx === right ? 'pivot' : idx >= left && idx < right ? 'default' : bar.state,
    }))
    yield { bars: pivotHighlight, pivot: right, left, right }

    for (let j = left; j < right; j++) {
      // Highlight comparing elements
      const comparing: Bar[] = bars.map((bar, idx) => ({
        ...bar,
        state:
          idx === right
            ? 'pivot'
            : idx === j
            ? 'comparing'
            : idx === i + 1
            ? 'comparing'
            : idx >= left && idx <= right
            ? 'default'
            : bar.state,
      }))
      yield { bars: comparing, pivot: right, left, right, comparing: [j, i + 1] }

      if (bars[j].value < pivot.value) {
        i++
        // Swap
        if (i !== j) {
          const temp = bars[i]
          bars[i] = bars[j]
          bars[j] = temp

          const swapped: Bar[] = bars.map((bar, idx) => ({
            ...bar,
            state:
              idx === right
                ? 'pivot'
                : idx === i || idx === j
                ? 'swapping'
                : idx >= left && idx <= right
                ? 'default'
                : bar.state,
          }))
          yield { bars: swapped, pivot: right, left, right, comparing: [i, j] }
        }
      }
    }

    // Place pivot in correct position
    const temp = bars[i + 1]
    bars[i + 1] = bars[right]
    bars[right] = temp

    const pivotPlaced: Bar[] = bars.map((bar, idx) => ({
      ...bar,
      state:
        idx === i + 1
          ? 'sorted'
          : idx >= left && idx <= right
          ? 'default'
          : bar.state,
    }))
    yield { bars: pivotPlaced, pivot: i + 1, left, right }

    return i + 1
  }

  yield* sort(bars, 0, bars.length - 1)

  // Final sorted state
  const final: Bar[] = bars.map((bar) => ({
    ...bar,
    state: 'sorted',
  }))
  yield { bars: final }
}

export function generateRandomArray(size: number, max: number = 100): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * max) + 1)
}
