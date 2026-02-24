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
}

export default function ArrayVisualizer({ bars, maxValue }: ArrayVisualizerProps) {
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
      <div className="bars-container">
        {bars.map((bar, index) => (
          <div
            key={index}
            className="bar"
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
