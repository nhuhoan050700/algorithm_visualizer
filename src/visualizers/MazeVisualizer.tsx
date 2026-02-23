import { useEffect, useRef, useState } from 'react'
import { VisualizationState } from '../App'
import Grid from '../components/Grid'
import { generateMaze, solveMaze } from '../algorithms/mazeSolver'
import './Visualizer.css'

interface MazeVisualizerProps {
  state: VisualizationState
  setState: React.Dispatch<React.SetStateAction<VisualizationState>>
}

export default function MazeVisualizer({ state, setState }: MazeVisualizerProps) {
  const [grid, setGrid] = useState(generateMaze(20, 20))
  const [showBacktracking, setShowBacktracking] = useState(true)
  const generatorRef = useRef<Generator<any> | null>(null)
  const intervalRef = useRef<number | null>(null)

  const startRow = 0
  const startCol = 0
  const endRow = grid.length - 1
  const endCol = grid[0].length - 1

  useEffect(() => {
    if (state.isPlaying) {
      // Ensure generator exists
      if (!generatorRef.current) {
        generatorRef.current = solveMaze(grid, startRow, startCol, endRow, endCol)
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
          setGrid(result.value.grid)
          setState(prev => ({ ...prev, step: prev.step + 1 }))
        }
      }, state.speed)
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
  }, [state.isPlaying, state.speed, setState, grid, startRow, startCol, endRow, endCol])

  const handleReset = () => {
    setGrid(generateMaze(20, 20))
    generatorRef.current = null
    setState(prev => ({ ...prev, isPlaying: false, step: 0, isComplete: false }))
  }

  useEffect(() => {
    if (state.resetTrigger && state.resetTrigger > 0) {
      setGrid(generateMaze(20, 20))
      generatorRef.current = null
      setState(prev => ({ ...prev, isPlaying: false, step: 0, isComplete: false }))
    }
  }, [state.resetTrigger, setState])

  const handlePlay = () => {
    if (!generatorRef.current) {
      generatorRef.current = solveMaze(grid, startRow, startCol, endRow, endCol)
    }
    setState(prev => ({ ...prev, isPlaying: true, isComplete: false }))
  }

  const handleStep = () => {
    if (!generatorRef.current) {
      generatorRef.current = solveMaze(grid, startRow, startCol, endRow, endCol)
    }
    const result = generatorRef.current.next()
    if (result.done) {
      setState(prev => ({ ...prev, isComplete: true }))
    } else {
      setGrid(result.value.grid)
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
        <button onClick={handleReset}>🔀 New Maze</button>
        <label>
          <input
            type="checkbox"
            checked={showBacktracking}
            onChange={(e) => setShowBacktracking(e.target.checked)}
          />
          Show Backtracking Steps
        </label>
      </div>
      <Grid grid={grid} />
    </div>
  )
}
