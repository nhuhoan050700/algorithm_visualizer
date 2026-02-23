import { GridCell, CellType } from '../components/Grid'

export interface PathfindingStep {
  grid: GridCell[][]
  visited: Array<[number, number]>
  path?: Array<[number, number]>
}

// BFS Implementation
export function* bfs(
  grid: GridCell[][],
  startRow: number,
  startCol: number,
  endRow: number,
  endCol: number
): Generator<PathfindingStep> {
  const rows = grid.length
  const cols = grid[0].length
  const queue: Array<[number, number, Array<[number, number]>]> = [
    [startRow, startCol, [[startRow, startCol]]],
  ]
  const visited = new Set<string>()
  visited.add(`${startRow},${startCol}`)

  const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ]

  while (queue.length > 0) {
    const [row, col, path] = queue.shift()!

    const newGrid = grid.map((r) =>
      r.map((c) => {
        const key = `${c.row},${c.col}`
        if (visited.has(key)) {
          return { ...c, type: c.type === 'start' || c.type === 'end' ? c.type : 'visited' as CellType }
        }
        return { ...c }
      })
    )

    // Mark frontier
    queue.forEach(([r, c]) => {
      if (newGrid[r][c].type !== 'start' && newGrid[r][c].type !== 'end') {
        newGrid[r][c].type = 'frontier'
      }
    })

    newGrid[startRow][startCol].type = 'start'
    newGrid[endRow][endCol].type = 'end'

    yield {
      grid: newGrid,
      visited: Array.from(visited).map((s) => {
        const [r, c] = s.split(',').map(Number)
        return [r, c]
      }),
    }

    if (row === endRow && col === endCol) {
      // Found path
      const pathGrid = grid.map((r) =>
        r.map((c) => {
          const isInPath = path.some(([r, c]) => r === c.row && c === c.col)
          if (isInPath && c.type !== 'start' && c.type !== 'end') {
            return { ...c, type: 'path' as CellType }
          }
          const key = `${c.row},${c.col}`
          if (visited.has(key) && c.type !== 'start' && c.type !== 'end') {
            return { ...c, type: 'visited' as CellType }
          }
          return { ...c }
        })
      )
      pathGrid[startRow][startCol].type = 'start'
      pathGrid[endRow][endCol].type = 'end'
      yield { grid: pathGrid, visited: Array.from(visited).map((s) => {
        const [r, c] = s.split(',').map(Number)
        return [r, c]
      }), path }
      return
    }

    for (const [dr, dc] of directions) {
      const newRow = row + dr
      const newCol = col + dc
      const key = `${newRow},${newCol}`

      if (
        newRow >= 0 &&
        newRow < rows &&
        newCol >= 0 &&
        newCol < cols &&
        !visited.has(key) &&
        grid[newRow][newCol].type !== 'wall'
      ) {
        visited.add(key)
        queue.push([newRow, newCol, [...path, [newRow, newCol]]])
      }
    }
  }
}

// DFS Implementation
export function* dfs(
  grid: GridCell[][],
  startRow: number,
  startCol: number,
  endRow: number,
  endCol: number
): Generator<PathfindingStep> {
  const rows = grid.length
  const cols = grid[0].length
  const stack: Array<[number, number, Array<[number, number]>]> = [
    [startRow, startCol, [[startRow, startCol]]],
  ]
  const visited = new Set<string>()
  visited.add(`${startRow},${startCol}`)

  const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ]

  while (stack.length > 0) {
    const [row, col, path] = stack.pop()!

    const newGrid = grid.map((r) =>
      r.map((c) => {
        const key = `${c.row},${c.col}`
        if (visited.has(key)) {
          return {
            ...c,
            type:
              c.type === 'start' || c.type === 'end'
                ? c.type
                : ('visited' as CellType),
          }
        }
        return { ...c }
      })
    )

    // Mark current path
    path.forEach(([r, c]) => {
      if (newGrid[r][c].type !== 'start' && newGrid[r][c].type !== 'end') {
        newGrid[r][c].type = 'path'
      }
    })

    newGrid[startRow][startCol].type = 'start'
    newGrid[endRow][endCol].type = 'end'

    yield {
      grid: newGrid,
      visited: Array.from(visited).map((s) => {
        const [r, c] = s.split(',').map(Number)
        return [r, c]
      }),
    }

    if (row === endRow && col === endCol) {
      // Found path
      const pathGrid = grid.map((r) =>
        r.map((c) => {
          const isInPath = path.some(([pr, pc]) => pr === c.row && pc === c.col)
          if (isInPath && c.type !== 'start' && c.type !== 'end') {
            return { ...c, type: 'path' as CellType }
          }
          const key = `${c.row},${c.col}`
          if (visited.has(key) && c.type !== 'start' && c.type !== 'end') {
            return { ...c, type: 'visited' as CellType }
          }
          return { ...c }
        })
      )
      pathGrid[startRow][startCol].type = 'start'
      pathGrid[endRow][endCol].type = 'end'
      yield {
        grid: pathGrid,
        visited: Array.from(visited).map((s) => {
          const [r, c] = s.split(',').map(Number)
          return [r, c]
        }),
        path,
      }
      return
    }

    for (const [dr, dc] of directions) {
      const newRow = row + dr
      const newCol = col + dc
      const key = `${newRow},${newCol}`

      if (
        newRow >= 0 &&
        newRow < rows &&
        newCol >= 0 &&
        newCol < cols &&
        !visited.has(key) &&
        grid[newRow][newCol].type !== 'wall'
      ) {
        visited.add(key)
        stack.push([newRow, newCol, [...path, [newRow, newCol]]])
      }
    }
  }
}

// A* Implementation
export function* aStar(
  grid: GridCell[][],
  startRow: number,
  startCol: number,
  endRow: number,
  endCol: number
): Generator<PathfindingStep> {
  const rows = grid.length
  const cols = grid[0].length

  function heuristic(row: number, col: number): number {
    return Math.abs(row - endRow) + Math.abs(col - endCol)
  }

  const openSet = new Map<string, { row: number; col: number; f: number; g: number; h: number; path: Array<[number, number]> }>()
  const closedSet = new Set<string>()

  const startKey = `${startRow},${startCol}`
  const startH = heuristic(startRow, startCol)
  openSet.set(startKey, {
    row: startRow,
    col: startCol,
    f: startH,
    g: 0,
    h: startH,
    path: [[startRow, startCol]],
  })

  const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ]

  while (openSet.size > 0) {
    // Find node with lowest f score
    let currentKey = ''
    let current = null
    let lowestF = Infinity

    for (const [key, node] of openSet.entries()) {
      if (node.f < lowestF) {
        lowestF = node.f
        currentKey = key
        current = node
      }
    }

    if (!current) break

    openSet.delete(currentKey)
    closedSet.add(currentKey)

    const newGrid = grid.map((r) =>
      r.map((c) => {
        const key = `${c.row},${c.col}`
        if (closedSet.has(key)) {
          return {
            ...c,
            type:
              c.type === 'start' || c.type === 'end'
                ? c.type
                : ('closed' as CellType),
            g: current!.g,
            h: heuristic(c.row, c.col),
            f: current!.g + heuristic(c.row, c.col),
          }
        }
        if (openSet.has(key)) {
          const node = openSet.get(key)!
          return {
            ...c,
            type:
              c.type === 'start' || c.type === 'end'
                ? c.type
                : ('open' as CellType),
            g: node.g,
            h: node.h,
            f: node.f,
          }
        }
        return { ...c }
      })
    )

    newGrid[startRow][startCol].type = 'start'
    newGrid[endRow][endCol].type = 'end'

    yield {
      grid: newGrid,
      visited: Array.from(closedSet).map((s) => {
        const [r, c] = s.split(',').map(Number)
        return [r, c]
      }),
    }

    if (current.row === endRow && current.col === endCol) {
      // Found path
      const pathGrid = grid.map((r) =>
        r.map((c) => {
          const isInPath = current!.path.some(([pr, pc]) => pr === c.row && pc === c.col)
          if (isInPath && c.type !== 'start' && c.type !== 'end') {
            return { ...c, type: 'path' as CellType }
          }
          const key = `${c.row},${c.col}`
          if (closedSet.has(key) && c.type !== 'start' && c.type !== 'end') {
            return { ...c, type: 'closed' as CellType }
          }
          return { ...c }
        })
      )
      pathGrid[startRow][startCol].type = 'start'
      pathGrid[endRow][endCol].type = 'end'
      yield {
        grid: pathGrid,
        visited: Array.from(closedSet).map((s) => {
          const [r, c] = s.split(',').map(Number)
          return [r, c]
        }),
        path: current.path,
      }
      return
    }

    for (const [dr, dc] of directions) {
      const newRow = current.row + dr
      const newCol = current.col + dc
      const key = `${newRow},${newCol}`

      if (
        newRow >= 0 &&
        newRow < rows &&
        newCol >= 0 &&
        newCol < cols &&
        !closedSet.has(key) &&
        grid[newRow][newCol].type !== 'wall'
      ) {
        const g = current.g + 1
        const h = heuristic(newRow, newCol)
        const f = g + h

        if (!openSet.has(key)) {
          openSet.set(key, {
            row: newRow,
            col: newCol,
            f,
            g,
            h,
            path: [...current.path, [newRow, newCol]],
          })
        } else {
          const existing = openSet.get(key)!
          if (g < existing.g) {
            existing.g = g
            existing.f = f
            existing.path = [...current.path, [newRow, newCol]]
          }
        }
      }
    }
  }
}

export function generatePathfindingGrid(rows: number, cols: number): GridCell[][] {
  const grid: GridCell[][] = []

  for (let r = 0; r < rows; r++) {
    grid[r] = []
    for (let c = 0; c < cols; c++) {
      grid[r][c] = {
        row: r,
        col: c,
        type: Math.random() < 0.25 ? 'wall' : 'empty',
      }
    }
  }

  grid[0][0].type = 'start'
  grid[rows - 1][cols - 1].type = 'end'

  return grid
}
