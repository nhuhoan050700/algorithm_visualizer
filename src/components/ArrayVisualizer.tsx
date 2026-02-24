import { useState } from 'react'
import type React from 'react'
import './ArrayVisualizer.css'

export type BarState = 'default' | 'comparing' | 'pivot' | 'subarray' | 'sorted' | 'swapping'

export interface Bar {
  value: number
  state: BarState
  index?: number
}

interface ArrayVisualizerProps {
  bars: Bar[]
  maxValue: number
  draggable?: boolean
  onReorder?: (newBars: Bar[]) => void
}

export default function ArrayVisualizer({ bars, maxValue, draggable = false, onReorder }: ArrayVisualizerProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const handleDragStart = (index: number) => (event: React.DragEvent<HTMLDivElement>) => {
    if (!draggable || !onReorder) return
    setDraggedIndex(index)
    event.dataTransfer.effectAllowed = 'move'
  }

  const reorderAtIndex = (targetIndex: number) => {
    if (!onReorder || draggedIndex === null) return

    const clampedIndex = Math.max(0, Math.min(bars.length - 1, targetIndex))

    if (clampedIndex === draggedIndex) {
      setDraggedIndex(null)
      return
    }

    const updated = [...bars]
    const [moved] = updated.splice(draggedIndex, 1)
    updated.splice(clampedIndex, 0, moved)

    onReorder(
      updated.map((bar) => ({
        ...bar,
        state: 'default' as BarState,
      })),
    )

    setDraggedIndex(null)
  }

  const handleContainerDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    if (!draggable || !onReorder || draggedIndex === null) return
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }

  const handleContainerDrop = (event: React.DragEvent<HTMLDivElement>) => {
    if (!draggable || !onReorder || draggedIndex === null) return
    event.preventDefault()

    const rect = (event.currentTarget as HTMLDivElement).getBoundingClientRect()
    const offsetX = event.clientX - rect.left
    const barWidth = rect.width / bars.length

    const index = barWidth > 0 ? Math.floor(offsetX / barWidth) : draggedIndex
    reorderAtIndex(index)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }
  const getBarColor = (state: BarState): string => {
    switch (state) {
      case 'default':
        return '#3b82f6'
      case 'comparing':
        return '#fbbf24'
      case 'pivot':
        return '#ef4444'
      case 'subarray':
        return '#a855f7'
      case 'sorted':
        return '#10b981'
      case 'swapping':
        return '#f59e0b'
      default:
        return '#3b82f6'
    }
  }

  return (
    <div className="array-visualizer">
      <div
        className="bars-container"
        onDragOver={handleContainerDragOver}
        onDrop={handleContainerDrop}
      >
        {bars.map((bar, index) => (
          <div
            key={index}
            className={`bar${draggedIndex === index ? ' dragging' : ''}`}
            draggable={draggable && !!onReorder}
            onDragStart={handleDragStart(index)}
            onDragEnd={handleDragEnd}
            style={{
              height: `${(bar.value / maxValue) * 100}%`,
              backgroundColor: getBarColor(bar.state),
              width: `${100 / bars.length}%`,
            }}
            title={`Value: ${bar.value}`}
          >
            <span className="bar-value">{bar.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
