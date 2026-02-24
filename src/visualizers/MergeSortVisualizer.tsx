import { useEffect, useRef, useState } from 'react'
import { VisualizationState } from '../App'
import ArrayVisualizer from '../components/ArrayVisualizer'
import { generateRandomArray, mergeSort } from '../algorithms/mergeSort'
import './Visualizer.css'

interface MergeSortVisualizerProps {
  state: VisualizationState
  setState: React.Dispatch<React.SetStateAction<VisualizationState>>
}

export default function MergeSortVisualizer({ state, setState }: MergeSortVisualizerProps) {
  const [arraySize, setArraySize] = useState(20)
  const [bars, setBars] = useState(() => {
    const arr = generateRandomArray(20, 100)
    return arr.map((val) => ({ value: val, state: 'default' as const }))
  })
  const generatorRef = useRef<Generator<any> | null>(null)
  const intervalRef = useRef<number | null>(null)
  const maxValue = Math.max(...bars.map(b => b.value))

  useEffect(() => {
    if (state.isPlaying) {
      // Ensure generator exists
      if (!generatorRef.current) {
        const arr = bars.map(b => b.value)
        generatorRef.current = mergeSort(arr)
      }
      
      intervalRef.current = window.setInterval(() => {
        if (!generatorRef.current) return
        
        const result = generatorRef.current.next()
        if (result.done) {
          setState(prev => ({ ...prev, isPlaying: false, isComplete: true }))
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
          }
        } else {
          setBars(result.value.bars)
          setState(prev => ({ ...prev, step: prev.step + 1 }))
        }
      }, state.speedDelay || 50)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [state.isPlaying, state.speedDelay, setState, bars])

  const handleSizeChange = (newSize: number) => {
    setArraySize(newSize)
    const arr = generateRandomArray(newSize, 100)
    setBars(arr.map((val) => ({ value: val, state: 'default' as const })))
    generatorRef.current = null
    setState(prev => ({ ...prev, isPlaying: false, step: 0, isComplete: false }))
  }

  useEffect(() => {
    if (state.resetTrigger && state.resetTrigger > 0) {
      const arr = generateRandomArray(arraySize, 100)
      setBars(arr.map((val) => ({ value: val, state: 'default' as const })))
      generatorRef.current = null
      setState(prev => ({ ...prev, isPlaying: false, step: 0, isComplete: false }))
    }
  }, [state.resetTrigger, setState, arraySize])

  const handleStep = () => {
    if (!generatorRef.current) {
      const arr = bars.map(b => b.value)
      generatorRef.current = mergeSort(arr)
    }
    const result = generatorRef.current.next()
    if (result.done) {
      setState(prev => ({ ...prev, isComplete: true }))
    } else {
      setBars(result.value.bars)
      setState(prev => ({ ...prev, step: prev.step + 1 }))
    }
  }

  useEffect(() => {
    if (state.stepTrigger && !state.isPlaying) {
      handleStep()
    }
  }, [state.stepTrigger])


  return (
    <div className="visualizer">
      <div className="visualizer-controls">
        <div className="size-control">
          <label htmlFor="size-slider">Array Size:</label>
          <input
            id="size-slider"
            type="range"
            min="5"
            max="50"
            value={arraySize}
            onChange={(e) => handleSizeChange(Number(e.target.value))}
            className="size-slider"
          />
          <span className="size-value">{arraySize}</span>
        </div>
        <div className="size-control">
          <label htmlFor="merge-speed-slider">Speed:</label>
          <input
            id="merge-speed-slider"
            type="range"
            min="0"
            max="100"
            value={state.speed}
            onChange={(e) =>
              setState(prev => ({ ...prev, speed: Number(e.target.value) }))
            }
            className="size-slider"
          />
          <span className="size-value">{state.speed}%</span>
        </div>
      </div>
      <ArrayVisualizer bars={bars} maxValue={maxValue} />
    </div>
  )
}
