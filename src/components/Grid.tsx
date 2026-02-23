import { useState, useRef } from 'react'
import './Grid.css'

export type CellType = 'empty' | 'wall' | 'start' | 'end' | 'path' | 'visited' | 'current' | 'backtracked' | 'frontier' | 'open' | 'closed'

export interface GridCell {
  row: number
  col: number
  type: CellType
  g?: number
  h?: number
  f?: number
}

interface GridProps {
  grid: GridCell[][]
  onCellClick?: (row: number, col: number) => void
  onCellDrag?: (row: number, col: number) => void
  onMoveStartEnd?: (row: number, col: number, type: 'start' | 'end') => void
  showValues?: boolean
}

export default function Grid({ grid, onCellClick, onCellDrag, onMoveStartEnd, showValues = false }: GridProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [draggingType, setDraggingType] = useState<'start' | 'end' | null>(null)
  const lastCellRef = useRef<{ row: number; col: number } | null>(null)

  const handleMouseDown = (row: number, col: number) => {
    if (!onCellClick) return
    
    const cell = grid[row]?.[col]
    // Check if clicking on start or end
    if (cell?.type === 'start' || cell?.type === 'end') {
      setIsDragging(true)
      setDraggingType(cell.type)
      lastCellRef.current = { row, col }
      // Don't call onCellClick for start/end, we'll handle movement in drag
      return
    }
    
    setIsDragging(true)
    setDraggingType(null)
    lastCellRef.current = { row, col }
    onCellClick(row, col)
  }

  const handleMouseMove = (row: number, col: number) => {
    if (!isDragging) return
    
    // Avoid processing the same cell multiple times
    if (lastCellRef.current?.row === row && lastCellRef.current?.col === col) {
      return
    }
    
    lastCellRef.current = { row, col }
    
    // If dragging start/end, use onMoveStartEnd
    if (draggingType && onMoveStartEnd) {
      onMoveStartEnd(row, col, draggingType)
    } else if (onCellDrag) {
      onCellDrag(row, col)
    } else if (onCellClick) {
      onCellClick(row, col)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setDraggingType(null)
    lastCellRef.current = null
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
    setDraggingType(null)
    lastCellRef.current = null
  }
  const getCellClass = (cell: GridCell) => {
    return `cell cell-${cell.type}`
  }

  const getCellColor = (cell: GridCell): string => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark'
    
    switch (cell.type) {
      case 'empty':
        return isDark ? '#2a2a3e' : '#ffffff'
      case 'wall':
        return isDark ? '#0a0a1a' : '#1f2937'
      case 'start':
        return '#10b981'
      case 'end':
        return '#ef4444'
      case 'path':
        return isDark ? '#4a90e2' : '#3b82f6'
      case 'visited':
        return isDark ? '#d4a017' : '#fbbf24'
      case 'current':
        return isDark ? '#9d6ff5' : '#8b5cf6'
      case 'backtracked':
        return isDark ? '#3a3a4e' : '#e5e7eb'
      case 'frontier':
        return isDark ? '#5aa0f0' : '#60a5fa'
      case 'open':
        return isDark ? '#4a90e2' : '#3b82f6'
      case 'closed':
        return isDark ? '#d4a017' : '#fbbf24'
      default:
        return isDark ? '#2a2a3e' : '#ffffff'
    }
  }

  return (
    <div className="grid-container">
      <div 
        className="grid" 
        style={{ 
          gridTemplateColumns: `repeat(${grid[0]?.length || 0}, 1fr)`,
        }}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {grid.map((row, rowIdx) =>
          row.map((cell, colIdx) => (
            <div
              key={`${rowIdx}-${colIdx}`}
              className={getCellClass(cell)}
              style={{
                backgroundColor: getCellColor(cell),
              }}
              onClick={() => onCellClick?.(rowIdx, colIdx)}
              onMouseDown={() => handleMouseDown(rowIdx, colIdx)}
              onMouseEnter={() => handleMouseMove(rowIdx, colIdx)}
              title={
                showValues && cell.g !== undefined
                  ? `g: ${cell.g}, h: ${cell.h}, f: ${cell.f}`
                  : ''
              }
            >
              {cell.type === 'start' && 'S'}
              {cell.type === 'end' && 'E'}
              {showValues && cell.f !== undefined && (
                <div className="cell-values">
                  <div className="f-value">{cell.f}</div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
