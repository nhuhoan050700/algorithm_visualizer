import InfoPanel from './components/InfoPanel'
import { useState } from 'react'
import AlgorithmSelector from './components/AlgorithmSelector'
import Controls from './components/Controls'
import MergeSortVisualizer from './visualizers/MergeSortVisualizer'
import QuickSortVisualizer from './visualizers/QuickSortVisualizer'
import BubbleSortVisualizer from './visualizers/BubbleSortVisualizer'
import BFSVisualizer from './visualizers/BFSVisualizer'
import DFSVisualizer from './visualizers/DFSVisualizer'
import LinkedListVisualizer from './visualizers/LinkedListVisualizer'
import './App.css'

export type AlgorithmCategory = 'sorting' | 'pathfinding' | 'data-structures'
export type AlgorithmType = 
  | 'merge-sort' 
  | 'quick-sort' 
  | 'bubble-sort'
  | 'bfs' 
  | 'dfs' 
  | 'linked-list'

export interface VisualizationState {
  isPlaying: boolean
  speed: number
  step: number
  isComplete: boolean
  stepTrigger?: number
  resetTrigger?: number
  speedDelay?: number
}

function App() {
  const [category, setCategory] = useState<AlgorithmCategory>('sorting')
  const [algorithm, setAlgorithm] = useState<AlgorithmType>('merge-sort')
  const [state, setState] = useState<VisualizationState>({
    isPlaying: false,
    speed: 50,
    step: 0,
    isComplete: false,
  })

  const handlePlayPause = () => {
    setState(prev => ({ ...prev, isPlaying: !prev.isPlaying }))
  }

  const handleStep = () => {
    setState(prev => ({ ...prev, stepTrigger: (prev.stepTrigger || 0) + 1 }))
  }

  const handleReset = () => {
    setState(prev => ({ 
      isPlaying: false, 
      speed: 50, 
      step: 0, 
      isComplete: false, 
      stepTrigger: 0,
      resetTrigger: (prev.resetTrigger || 0) + 1
    }))
  }

  // Convert speed (0-100) to delay in milliseconds
  // Higher speed = lower delay = faster animation
  const getSpeedDelay = (speed: number): number => {
    // Speed 0 = 200ms delay (slowest)
    // Speed 100 = 10ms delay (fastest)
    return 200 - (speed / 100) * 190
  }

  const handleCategoryChange = (newCategory: AlgorithmCategory) => {
    setCategory(newCategory)
    if (newCategory === 'sorting') {
      setAlgorithm('merge-sort')
    } else if (newCategory === 'pathfinding') {
      setAlgorithm('bfs')
    } else {
      setAlgorithm('linked-list')
    }
    handleReset()
  }

  const handleAlgorithmChange = (newAlgorithm: AlgorithmType) => {
    setAlgorithm(newAlgorithm)
    handleReset()
  }

  const renderVisualizer = () => {
    const visualizerState = {
      ...state,
      speedDelay: getSpeedDelay(state.speed)
    }
    
    switch (algorithm) {
      case 'merge-sort':
        return <MergeSortVisualizer state={visualizerState} setState={setState} />
      case 'quick-sort':
        return <QuickSortVisualizer state={visualizerState} setState={setState} />
      case 'bubble-sort':
        return <BubbleSortVisualizer state={visualizerState} setState={setState} />
      case 'bfs':
        return <BFSVisualizer state={visualizerState} setState={setState} />
      case 'dfs':
        return <DFSVisualizer state={visualizerState} setState={setState} />
      case 'linked-list':
        return <LinkedListVisualizer state={visualizerState} setState={setState} />
      default:
        return null
    }
  }

  return (
    <div className="app">
      <div className="header">
        <h1>Algorithm Visualizer</h1>
        <AlgorithmSelector
          category={category}
          algorithm={algorithm}
          onCategoryChange={handleCategoryChange}
          onAlgorithmChange={handleAlgorithmChange}
        />
        <Controls
          isPlaying={state.isPlaying}
          onPlayPause={handlePlayPause}
          onStep={handleStep}
          onReset={handleReset}
        />
      </div>
      
      <div className="main-content">
        <div className="visualization-container">
          {renderVisualizer()}
        </div>
        <div className="info-section">
          <InfoPanel algorithm={algorithm} state={state} />
        </div>
      </div>
    </div>
  )
}

export default App
