import { useEffect, useRef, useState } from 'react'
import { VisualizationState } from '../App'
import Grid from '../components/Grid'
import { generatePathfindingGrid, bfs } from '../algorithms/pathfinding'
import './Visualizer.css'

interface BFSVisualizerProps {
  state: VisualizationState
  setState: React.Dispatch<React.SetStateAction<VisualizationState>>
}

type DrawMode = 'brush' | 'eraser'

export default function BFSVisualizer({ state, setState }: BFSVisualizerProps) {
  const [gridSize, setGridSize] = useState(20)
  const [grid, setGrid] = useState(generatePathfindingGrid(20, 20))
  const [drawMode, setDrawMode] = useState<DrawMode>('brush')
  const generatorRef = useRef<Generator<any> | null>(null)
  const intervalRef = useRef<number | null>(null)

  // Find start and end positions dynamically
  const getStartEnd = () => {
    let startRow = 0, startCol = 0, endRow = grid.length - 1, endCol = grid[0].length - 1
    
    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[r].length; c++) {
        if (grid[r][c].type === 'start') {
          startRow = r
          startCol = c
        } else if (grid[r][c].type === 'end') {
          endRow = r
          endCol = c
        }
      }
    }
    
    return { startRow, startCol, endRow, endCol }
  }

  useEffect(() => {
    if (state.isPlaying) {
      // Ensure generator exists
      if (!generatorRef.current) {
        const { startRow, startCol, endRow, endCol } = getStartEnd()
        generatorRef.current = bfs(grid, startRow, startCol, endRow, endCol)
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
  }, [state.isPlaying, state.speedDelay, setState, grid])

  const handleReset = () => {
    setGrid(generatePathfindingGrid(gridSize, gridSize))
    generatorRef.current = null
    setState(prev => ({ ...prev, isPlaying: false, step: 0, isComplete: false }))
  }

  const handleSizeChange = (newSize: number) => {
    setGridSize(newSize)
    setGrid(generatePathfindingGrid(newSize, newSize))
    generatorRef.current = null
    setState(prev => ({ ...prev, isPlaying: false, step: 0, isComplete: false }))
  }

  useEffect(() => {
    if (state.resetTrigger && state.resetTrigger > 0) {
      setGrid(generatePathfindingGrid(gridSize, gridSize))
      generatorRef.current = null
      setState(prev => ({ ...prev, isPlaying: false, step: 0, isComplete: false }))
    }
  }, [state.resetTrigger, setState, gridSize])

  const handlePlay = () => {
    if (!generatorRef.current) {
      const { startRow, startCol, endRow, endCol } = getStartEnd()
      generatorRef.current = bfs(grid, startRow, startCol, endRow, endCol)
    }
    setState(prev => ({ ...prev, isPlaying: true, isComplete: false }))
  }

  const handleStep = () => {
    if (!generatorRef.current) {
      const { startRow, startCol, endRow, endCol } = getStartEnd()
      generatorRef.current = bfs(grid, startRow, startCol, endRow, endCol)
    }
    const result = generatorRef.current.next()
    if (result.done) {
      setState(prev => ({ ...prev, isComplete: true }))
    } else {
      setGrid(result.value.grid)
      setState(prev => ({ ...prev, step: prev.step + 1 }))
    }
  }

  const handleCellClick = (row: number, col: number) => {
    const newGrid = grid.map(r => r.map(c => ({ ...c })))
    // Don't modify start or end cells (they're moved via drag)
    if (newGrid[row][col].type === 'start' || newGrid[row][col].type === 'end') {
      return
    }
    
    if (drawMode === 'brush') {
      // Brush mode: create walls
      if (newGrid[row][col].type === 'empty') {
        newGrid[row][col].type = 'wall'
        setGrid(newGrid)
      }
    } else {
      // Eraser mode: remove walls
      if (newGrid[row][col].type === 'wall') {
        newGrid[row][col].type = 'empty'
        setGrid(newGrid)
      }
    }
  }

  const handleCellDrag = (row: number, col: number) => {
    const newGrid = grid.map(r => r.map(c => ({ ...c })))
    // Don't modify start or end cells (they're moved via drag)
    if (newGrid[row][col].type === 'start' || newGrid[row][col].type === 'end') {
      return
    }
    
    if (drawMode === 'brush') {
      // Brush mode: create walls
      if (newGrid[row][col].type === 'empty') {
        newGrid[row][col].type = 'wall'
        setGrid(newGrid)
      }
    } else {
      // Eraser mode: remove walls
      if (newGrid[row][col].type === 'wall') {
        newGrid[row][col].type = 'empty'
        setGrid(newGrid)
      }
    }
  }

  const handleMoveStartEnd = (row: number, col: number, type: 'start' | 'end') => {
    const newGrid = grid.map(r => r.map(c => ({ ...c })))
    
    // Don't move to a wall
    if (newGrid[row][col].type === 'wall') {
      return
    }
    
    // Don't move start onto end or vice versa
    if ((type === 'start' && newGrid[row][col].type === 'end') ||
        (type === 'end' && newGrid[row][col].type === 'start')) {
      return
    }
    
    // Find and clear old position
    for (let r = 0; r < newGrid.length; r++) {
      for (let c = 0; c < newGrid[r].length; c++) {
        if (newGrid[r][c].type === type) {
          newGrid[r][c].type = 'empty'
        }
      }
    }
    
    // Set new position
    newGrid[row][col].type = type
    setGrid(newGrid)
    
    // Reset generator so next run uses new positions
    generatorRef.current = null
  }

  useEffect(() => {
    if (state.stepTrigger && !state.isPlaying) {
      handleStep()
    }
  }, [state.stepTrigger])


  return (
    <div className="visualizer">
      <div className="visualizer-controls">
        <button
          className={drawMode === 'brush' ? 'active' : ''}
          onClick={() => setDrawMode('brush')}
        >
          🖌️ Brush
        </button>
        <button
          className={drawMode === 'eraser' ? 'active' : ''}
          onClick={() => setDrawMode('eraser')}
        >
          🧹 Eraser
        </button>
        <div className="size-control">
          <label htmlFor="grid-size-slider">Grid Size:</label>
          <input
            id="grid-size-slider"
            type="range"
            min="10"
            max="40"
            value={gridSize}
            onChange={(e) => handleSizeChange(Number(e.target.value))}
            className="size-slider"
          />
          <span className="size-value">{gridSize}×{gridSize}</span>
        </div>
        <div className="size-control">
          <label htmlFor="bfs-speed-slider">Speed:</label>
          <input
            id="bfs-speed-slider"
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
      <Grid grid={grid} onCellClick={handleCellClick} onCellDrag={handleCellDrag} onMoveStartEnd={handleMoveStartEnd} />
    </div>
  )
}
