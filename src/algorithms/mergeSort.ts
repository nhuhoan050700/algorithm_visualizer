import { Bar } from '../components/ArrayVisualizer'

export interface MergeSortStep {
  bars: Bar[]
  left?: number
  right?: number
  mid?: number
  merging?: boolean
}

export function* mergeSort(arr: number[]): Generator<MergeSortStep> {
  const bars: Bar[] = arr.map((val, idx) => ({
    value: val,
    state: 'default',
    index: idx,
  }))

  function* sort(
    bars: Bar[],
    left: number,
    right: number
  ): Generator<MergeSortStep> {
    if (left < right) {
      const mid = Math.floor((left + right) / 2)

      // Highlight subarrays
      const step1: Bar[] = bars.map((bar, idx) => ({
        ...bar,
        state:
          idx >= left && idx <= right
            ? 'subarray'
            : idx >= left && idx <= mid
            ? 'subarray'
            : 'default',
      }))
      yield { bars: step1, left, right, mid }

      yield* sort(bars, left, mid)
      yield* sort(bars, mid + 1, right)
      yield* merge(bars, left, mid, right)
    }
  }

  function* merge(
    bars: Bar[],
    left: number,
    mid: number,
    right: number
  ): Generator<MergeSortStep> {
    const leftArr = bars.slice(left, mid + 1)
    const rightArr = bars.slice(mid + 1, right + 1)

    let i = 0,
      j = 0,
      k = left

    while (i < leftArr.length && j < rightArr.length) {
      // Highlight comparing elements
      const comparing: Bar[] = bars.map((bar, idx) => ({
        ...bar,
        state:
          idx === left + i
            ? 'comparing'
            : idx === mid + 1 + j
            ? 'comparing'
            : idx >= left && idx <= right
            ? 'subarray'
            : 'default',
      }))
      yield { bars: comparing, left, right, mid, merging: true }

      if (leftArr[i].value <= rightArr[j].value) {
        bars[k] = { ...leftArr[i], state: 'sorted' }
        i++
      } else {
        bars[k] = { ...rightArr[j], state: 'sorted' }
        j++
      }
      k++

      const merged: Bar[] = bars.map((bar, idx) => ({
        ...bar,
        state:
          idx < k && idx >= left
            ? 'sorted'
            : idx === left + i || idx === mid + 1 + j
            ? 'comparing'
            : idx >= left && idx <= right
            ? 'subarray'
            : 'default',
      }))
      yield { bars: merged, left, right, mid, merging: true }
    }

    while (i < leftArr.length) {
      bars[k] = { ...leftArr[i], state: 'sorted' }
      i++
      k++
    }

    while (j < rightArr.length) {
      bars[k] = { ...rightArr[j], state: 'sorted' }
      j++
      k++
    }

    const final: Bar[] = bars.map((bar, idx) => ({
      ...bar,
      state: idx >= left && idx <= right ? 'sorted' : bar.state,
    }))
    yield { bars: final, left, right, mid }
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
