import { AlgorithmCategory, AlgorithmType } from '../App'
import './AlgorithmSelector.css'

interface AlgorithmSelectorProps {
  category: AlgorithmCategory
  algorithm: AlgorithmType
  onCategoryChange: (category: AlgorithmCategory) => void
  onAlgorithmChange: (algorithm: AlgorithmType) => void
}

export default function AlgorithmSelector({
  category,
  algorithm,
  onCategoryChange,
  onAlgorithmChange,
}: AlgorithmSelectorProps) {
  return (
    <div className="algorithm-selector">
      <div className="category-row">
        <span className="category-label">Category</span>
        <div className="category-tabs">
        <button
          className={category === 'sorting' ? 'active' : ''}
          onClick={() => onCategoryChange('sorting')}
        >
          Sorting
        </button>
        <button
          className={category === 'pathfinding' ? 'active' : ''}
          onClick={() => onCategoryChange('pathfinding')}
        >
          Pathfinding
        </button>
        <button
          className={category === 'data-structures' ? 'active' : ''}
          onClick={() => onCategoryChange('data-structures')}
        >
          Data Structures
        </button>
        </div>
      </div>

      <div className="algorithm-row">
        <span className="algorithm-label">Algorithm</span>
        <div className="algorithm-options">
        {category === 'sorting' && (
          <>
            <button
              className={`sorting-option ${algorithm === 'merge-sort' ? 'active' : ''}`}
              onClick={() => onAlgorithmChange('merge-sort')}
            >
              Merge Sort
            </button>
            <button
              className={`sorting-option ${algorithm === 'quick-sort' ? 'active' : ''}`}
              onClick={() => onAlgorithmChange('quick-sort')}
            >
              Quick Sort
            </button>
            <button
              className={`sorting-option ${algorithm === 'bubble-sort' ? 'active' : ''}`}
              onClick={() => onAlgorithmChange('bubble-sort')}
            >
              Bubble Sort
            </button>
          </>
        )}

        {category === 'pathfinding' && (
          <>
            <button
              className={`pathfinding-option ${algorithm === 'bfs' ? 'active' : ''}`}
              onClick={() => onAlgorithmChange('bfs')}
            >
              BFS
            </button>
            <button
              className={`pathfinding-option ${algorithm === 'dfs' ? 'active' : ''}`}
              onClick={() => onAlgorithmChange('dfs')}
            >
              DFS
            </button>
          </>
        )}

        {category === 'data-structures' && (
          <button
            className={`data-option ${algorithm === 'linked-list' ? 'active' : ''}`}
            onClick={() => onAlgorithmChange('linked-list')}
          >
            Linked List
          </button>
        )}
        </div>
      </div>
    </div>
  )
}
