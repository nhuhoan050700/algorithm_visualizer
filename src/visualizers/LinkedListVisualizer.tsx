import { useEffect, useState } from 'react'
import { VisualizationState } from '../App'
import './Visualizer.css'
import './LinkedListVisualizer.css'

interface LinkedListNode {
  id: number
  value: number
  state: 'default' | 'highlight' | 'inserting' | 'deleting'
}

interface LinkedListVisualizerProps {
  state: VisualizationState
  setState: React.Dispatch<React.SetStateAction<VisualizationState>>
}

function generateInitialList(): LinkedListNode[] {
  const values = [3, 7, 2, 9, 5]
  return values.map((val, i) => ({
    id: i,
    value: val,
    state: 'default' as const,
  }))
}

export default function LinkedListVisualizer({ state, setState }: LinkedListVisualizerProps) {
  const [nodes, setNodes] = useState<LinkedListNode[]>(generateInitialList)
  const [nextId, setNextId] = useState(5)
  const [inputValue, setInputValue] = useState('')
  const [searchValue, setSearchValue] = useState('')
  const [message, setMessage] = useState<string | null>(null)

  const clearMessage = () => {
    setTimeout(() => setMessage(null), 2000)
  }

  const resetNodesState = () => {
    setNodes((prev) =>
      prev.map((n) => ({ ...n, state: 'default' as const }))
    )
  }

  const insertAtHead = () => {
    const val = parseInt(inputValue, 10)
    if (isNaN(val)) {
      setMessage('Enter a valid number')
      clearMessage()
      return
    }
    const newNode: LinkedListNode = {
      id: nextId,
      value: val,
      state: 'inserting',
    }
    setNodes((prev) => [newNode, ...prev])
    setNextId((id) => id + 1)
    setInputValue('')
    setState((prev) => ({ ...prev, step: prev.step + 1 }))
    setTimeout(resetNodesState, 400)
  }

  const insertAtTail = () => {
    const val = parseInt(inputValue, 10)
    if (isNaN(val)) {
      setMessage('Enter a valid number')
      clearMessage()
      return
    }
    const newNode: LinkedListNode = {
      id: nextId,
      value: val,
      state: 'inserting',
    }
    setNodes((prev) => [...prev, newNode])
    setNextId((id) => id + 1)
    setInputValue('')
    setState((prev) => ({ ...prev, step: prev.step + 1 }))
    setTimeout(resetNodesState, 400)
  }

  const deleteNode = () => {
    const val = parseInt(inputValue, 10)
    if (isNaN(val)) {
      setMessage('Enter a valid number')
      clearMessage()
      return
    }
    const idx = nodes.findIndex((n) => n.value === val)
    if (idx === -1) {
      setMessage(`Value ${val} not found`)
      clearMessage()
      return
    }
    setNodes((prev) =>
      prev.map((n, i) =>
        i === idx ? { ...n, state: 'deleting' as const } : n
      )
    )
    setTimeout(() => {
      setNodes((prev) => prev.filter((n) => n.value !== val || n.state !== 'deleting'))
      resetNodesState()
      setInputValue('')
      setState((prev) => ({ ...prev, step: prev.step + 1 }))
    }, 400)
  }

  const handleSearch = () => {
    const val = parseInt(searchValue, 10)
    if (isNaN(val)) {
      setMessage('Enter a valid number to search')
      clearMessage()
      return
    }
    resetNodesState()
    const idx = nodes.findIndex((n) => n.value === val)
    if (idx === -1) {
      setMessage(`Value ${val} not found`)
      clearMessage()
      return
    }
    setNodes((prev) =>
      prev.map((n, i) =>
        i === idx ? { ...n, state: 'highlight' as const } : n
      )
    )
    setMessage(`Found at position ${idx}`)
    setTimeout(() => {
      resetNodesState()
      setMessage(null)
    }, 1500)
  }

  const handleReset = () => {
    setNodes(generateInitialList())
    setNextId(5)
    setInputValue('')
    setSearchValue('')
    setMessage(null)
    setState((prev) => ({
      ...prev,
      isPlaying: false,
      step: 0,
      isComplete: false,
    }))
  }

  useEffect(() => {
    if (state.resetTrigger && state.resetTrigger > 0) {
      handleReset()
    }
  }, [state.resetTrigger])

  const getNodeClassName = (node: LinkedListNode) => {
    const base = 'linked-list-node'
    const stateClass =
      node.state === 'highlight'
        ? 'highlight'
        : node.state === 'inserting'
        ? 'inserting'
        : node.state === 'deleting'
        ? 'deleting'
        : ''
    return `${base} ${stateClass}`.trim()
  }

  return (
    <div className="visualizer linked-list-visualizer">
      <div className="visualizer-controls linked-list-controls">
        <div className="linked-list-input-group">
          <input
            type="number"
            placeholder="Value"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="linked-list-input"
          />
          <button onClick={insertAtHead} className="linked-list-btn">
            Insert Head
          </button>
          <button onClick={insertAtTail} className="linked-list-btn">
            Insert Tail
          </button>
          <button onClick={deleteNode} className="linked-list-btn delete">
            Delete
          </button>
        </div>
        <div className="linked-list-input-group">
          <input
            type="number"
            placeholder="Search value"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="linked-list-input"
          />
          <button onClick={handleSearch} className="linked-list-btn">
            Search
          </button>
        </div>
        <button onClick={handleReset} className="linked-list-btn reset">
          Reset
        </button>
      </div>

      {message && <div className="linked-list-message">{message}</div>}

      <div className="linked-list-container">
        <div className="linked-list-label">head</div>
        <div className="linked-list-nodes">
          {nodes.length === 0 ? (
            <div className="linked-list-empty">Empty list</div>
          ) : (
            nodes.map((node, index) => (
              <div key={node.id} className="linked-list-item">
                <div className={getNodeClassName(node)}>
                  <span className="node-value">{node.value}</span>
                  <span className="node-next">next</span>
                </div>
                {index < nodes.length - 1 && (
                  <div className="linked-list-arrow">
                    <svg
                      viewBox="0 0 60 24"
                      preserveAspectRatio="none"
                      className="arrow-svg"
                    >
                      <line
                        x1="0"
                        y1="12"
                        x2="45"
                        y2="12"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <polygon
                        points="45,6 60,12 45,18"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        {nodes.length > 0 && (
          <div className="linked-list-null">null</div>
        )}
      </div>
    </div>
  )
}
