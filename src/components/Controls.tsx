import './Controls.css'

interface ControlsProps {
  isPlaying: boolean
  onPlayPause: () => void
  onStep: () => void
  onReset: () => void
}

export default function Controls({
  isPlaying,
  onPlayPause,
  onStep,
  onReset,
}: ControlsProps) {
  return (
    <div className="controls">
      <div className="control-buttons">
        <button onClick={onPlayPause} className="play-pause-btn">
          {isPlaying ? '⏸ Pause' : '▶️ Play'}
        </button>
        <button onClick={onStep} className="step-btn">
          ⏭ Step
        </button>
        <button onClick={onReset} className="reset-btn">
          🔁 Reset
        </button>
      </div>
    </div>
  )
}
