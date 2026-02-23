import { Bar } from '../components/ArrayVisualizer'

export interface BubbleSortStep {
  bars: Bar[]
  i?: number
  j?: number
}

export function* bubbleSort(arr: number[]): Generator<BubbleSortStep> {
  const bars: Bar[] = arr.map((val, idx) => ({
    value: val,
    state: 'default',
    index: idx,
  }))

  const n = bars.length
  let swapped: boolean

  for (let i = 0; i < n - 1; i++) {
    swapped = false

    for (let j = 0; j < n - i - 1; j++) {
      const comparing: Bar[] = bars.map((bar, idx) => ({
        ...bar,
        state:
          idx === j || idx === j + 1
            ? 'comparing'
            : idx >= n - i
            ? 'sorted'
            : 'default',
      }))
      yield { bars: comparing, i, j }

      if (bars[j].value > bars[j + 1].value) {
        const temp = bars[j]
        bars[j] = bars[j + 1]
        bars[j + 1] = temp

        const swappedBars: Bar[] = bars.map((bar, idx) => ({
          ...bar,
          state:
            idx === j || idx === j + 1
              ? 'swapping'
              : idx >= n - i
              ? 'sorted'
              : 'default',
        }))
        swapped = true
        yield { bars: swappedBars, i, j }
      }
    }

    // Mark the last element of this pass as sorted
    const passSorted: Bar[] = bars.map((bar, idx) => ({
      ...bar,
      state: idx >= n - i - 1 ? 'sorted' : 'default',
    }))
    yield { bars: passSorted, i }

    if (!swapped) {
      break
    }
  }

  const final: Bar[] = bars.map((bar) => ({
    ...bar,
    state: 'sorted',
  }))
  yield { bars: final }
}

export function generateRandomArray(size: number, max: number = 100): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * max) + 1)
}

