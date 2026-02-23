import { AlgorithmType, VisualizationState } from '../App'
import './InfoPanel.css'

interface InfoPanelProps {
  algorithm: AlgorithmType
  state: VisualizationState
}

const algorithmInfo: Record<AlgorithmType, {
  name: string
  timeComplexity: string
  spaceComplexity: string
  description: string
}> = {
  'merge-sort': {
    name: 'Merge Sort',
    timeComplexity: 'O(N log N)',
    spaceComplexity: 'O(N)',
    description: 'Divide and conquer: splits array, sorts recursively, then merges.',
  },
  'quick-sort': {
    name: 'Quick Sort',
    timeComplexity: 'O(N log N) avg',
    spaceComplexity: 'O(log N)',
    description: 'Picks pivot, partitions array, recursively sorts subarrays.',
  },
  'bubble-sort': {
    name: 'Bubble Sort',
    timeComplexity: 'O(N^2)',
    spaceComplexity: 'O(1)',
    description: 'Repeatedly compares adjacent elements and swaps them until the array is sorted.',
  },
  'bfs': {
    name: 'Breadth-First Search',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    description: 'Explores level by level, guaranteeing shortest path.',
  },
  'dfs': {
    name: 'Depth-First Search',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    description: 'Explores as deep as possible before backtracking.',
  },
  'linked-list': {
    name: 'Singly Linked List',
    timeComplexity: 'O(1) insert/delete head, O(n) search',
    spaceComplexity: 'O(n)',
    description: 'Nodes with value and next pointer. Insert/delete at head in O(1); traverse for tail and search.',
  },
}

export default function InfoPanel({ algorithm, state }: InfoPanelProps) {
  const categoryClass =
    algorithm === 'merge-sort' || algorithm === 'quick-sort' || algorithm === 'bubble-sort'
      ? 'sorting'
      : algorithm === 'bfs' || algorithm === 'dfs'
      ? 'pathfinding'
      : 'data'

  const info = algorithmInfo[algorithm]

  return (
    <div className={`info-panel info-panel-${categoryClass}`}>
      <h2>{info.name}</h2>
      
      <div className="info-section">
        <h3>Complexity</h3>
        <div className="complexity-item">
          <span className="label">Time:</span>
          <span className="value">{info.timeComplexity}</span>
        </div>
        <div className="complexity-item">
          <span className="label">Space:</span>
          <span className="value">{info.spaceComplexity}</span>
        </div>
      </div>

      <div className="info-section">
        <h3>Description</h3>
        <p>{info.description}</p>
      </div>

    </div>
  )
}
