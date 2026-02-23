import { GridCell } from '../components/Grid'

export interface MazeStep {
  grid: GridCell[][]
  currentRow: number
  currentCol: number
  path: Array<[number, number]>
  callStackDepth: number
}

export function* solveMaze(
  grid: GridCell[][],
  startRow: number,
  startCol: number,
  endRow: number,
  endCol: number
): Generator<MazeStep> {
  const rows = grid.length
  const cols = grid[0].length
  const visited: boolean[][] = Array(rows).fill(null).map(() => Array(cols).fill(false))
  const path: Array<[number, number]> = []
  let callStackDepth = 0

  function* backtrack(row: number, col: number, depth: number): Generator<MazeStep> {
    callStackDepth = depth
    
    // Base case: reached end
    if (row === endRow && col === endCol) {
      const newGrid = grid.map(r => r.map(c => ({ ...c })))
      path.forEach(([r, c]) => {
        newGrid[r][c].type = 'path'
      })
      newGrid[row][col].type = 'end'
      yield {
        grid: newGrid,
        currentRow: row,
        currentCol: col,
        path: [...path, [row, col]],
        callStackDepth: depth,
      }
      return true
    }

    // Mark as visited
    visited[row][col] = true
    path.push([row, col])

    const newGrid = grid.map(r => r.map(c => ({ ...c })))
    path.forEach(([r, c]) => {
      if (r === row && c === col) {
        newGrid[r][c].type = 'current'
      } else {
        newGrid[r][c].type = 'path'
      }
    })
    
    // Mark visited cells
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (visited[r][c] && newGrid[r][c].type === 'empty') {
          newGrid[r][c].type = 'visited'
        }
      }
    }
    
    newGrid[startRow][startCol].type = 'start'
    newGrid[endRow][endCol].type = 'end'

    yield {
      grid: newGrid,
      currentRow: row,
      currentCol: col,
      path: [...path],
      callStackDepth: depth,
    }

    // Try all 4 directions
    const directions = [
      [0, 1], [1, 0], [0, -1], [-1, 0]
    ]

    for (const [dr, dc] of directions) {
      const newRow = row + dr
      const newCol = col + dc

      if (
        newRow >= 0 && newRow < rows &&
        newCol >= 0 && newCol < cols &&
        !visited[newRow][newCol] &&
        grid[newRow][newCol].type !== 'wall'
      ) {
        const result = yield* backtrack(newRow, newCol, depth + 1)
        if (result) {
          return true
        }
      }
    }

    // Backtrack
    path.pop()
    const backtrackGrid = grid.map(r => r.map(c => ({ ...c })))
    path.forEach(([r, c]) => {
      backtrackGrid[r][c].type = 'path'
    })
    
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (visited[r][c] && backtrackGrid[r][c].type === 'empty') {
          backtrackGrid[r][c].type = 'visited'
        }
      }
    }
    
    backtrackGrid[row][col].type = 'backtracked'
    backtrackGrid[startRow][startCol].type = 'start'
    backtrackGrid[endRow][endCol].type = 'end'

    yield {
      grid: backtrackGrid,
      currentRow: row,
      currentCol: col,
      path: [...path],
      callStackDepth: depth,
    }

    return false
  }

  yield* backtrack(startRow, startCol, 0)
}

export function generateMaze(rows: number, cols: number): GridCell[][] {
  const grid: GridCell[][] = []
  
  for (let r = 0; r < rows; r++) {
    grid[r] = []
    for (let c = 0; c < cols; c++) {
      grid[r][c] = {
        row: r,
        col: c,
        type: Math.random() < 0.3 ? 'wall' : 'empty',
      }
    }
  }

  // Ensure start and end are not walls
  grid[0][0].type = 'start'
  grid[rows - 1][cols - 1].type = 'end'

  return grid
}
