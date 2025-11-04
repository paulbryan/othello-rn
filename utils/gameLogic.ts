/**
 * Pure game logic functions for Othello
 * Ported from vanilla JavaScript implementation
 */

import { Board, CellValue, PlayerColor, Position } from '@/types/game'
import {
  BOARD_SIZE,
  DIRECTIONS,
  POSITION_WEIGHTS,
} from '@/constants/GameConstants'

/**
 * Create an empty board with initial pieces
 */
export function createInitialBoard(): Board {
  const board: Board = Array(BOARD_SIZE)
    .fill(null)
    .map(() => Array(BOARD_SIZE).fill(null))

  // Set initial pieces
  const mid = BOARD_SIZE / 2
  board[mid - 1][mid - 1] = 'white'
  board[mid - 1][mid] = 'black'
  board[mid][mid - 1] = 'black'
  board[mid][mid] = 'white'

  return board
}

/**
 * Check if a move is valid
 */
export function isValidMove(
  board: Board,
  row: number,
  col: number,
  player: PlayerColor
): boolean {
  if (board[row][col] !== null) return false

  const opponent: PlayerColor = player === 'black' ? 'white' : 'black'

  for (const [dx, dy] of DIRECTIONS) {
    let x = row + dx
    let y = col + dy
    let hasOpponent = false

    while (x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE) {
      if (board[x][y] === null) break
      if (board[x][y] === opponent) {
        hasOpponent = true
      } else if (board[x][y] === player) {
        if (hasOpponent) return true
        break
      }
      x += dx
      y += dy
    }
  }

  return false
}

/**
 * Get all valid moves for a player
 */
export function getValidMoves(board: Board, player: PlayerColor): Position[] {
  const validMoves: Position[] = []
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (isValidMove(board, row, col, player)) {
        validMoves.push({ row, col })
      }
    }
  }
  return validMoves
}

/**
 * Make a move and flip discs (returns new board)
 */
export function makeMove(
  board: Board,
  row: number,
  col: number,
  player: PlayerColor
): Board | null {
  if (!isValidMove(board, row, col, player)) {
    return null
  }

  // Create a deep copy of the board
  const newBoard = board.map((row) => [...row])

  newBoard[row][col] = player
  flipDiscs(newBoard, row, col, player)

  return newBoard
}

/**
 * Flip discs after a valid move (mutates board)
 */
function flipDiscs(
  board: Board,
  row: number,
  col: number,
  player: PlayerColor
): void {
  const opponent: PlayerColor = player === 'black' ? 'white' : 'black'

  for (const [dx, dy] of DIRECTIONS) {
    let x = row + dx
    let y = col + dy
    const toFlip: Position[] = []

    while (x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE) {
      if (board[x][y] === null) break
      if (board[x][y] === opponent) {
        toFlip.push({ row: x, col: y })
      } else if (board[x][y] === player) {
        toFlip.forEach(({ row: fx, col: fy }) => {
          board[fx][fy] = player
        })
        break
      }
      x += dx
      y += dy
    }
  }
}

/**
 * Calculate score for both players
 */
export function calculateScore(board: Board): { black: number; white: number } {
  let blackCount = 0
  let whiteCount = 0

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col] === 'black') blackCount++
      if (board[row][col] === 'white') whiteCount++
    }
  }

  return { black: blackCount, white: whiteCount }
}

/**
 * Check if the game is over
 */
export function isGameOver(board: Board): boolean {
  const blackMoves = getValidMoves(board, 'black').length
  const whiteMoves = getValidMoves(board, 'white').length

  if (blackMoves === 0 && whiteMoves === 0) {
    return true
  }

  // Check if board is full
  let emptyCells = 0
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col] === null) emptyCells++
    }
  }

  return emptyCells === 0
}

/**
 * Evaluate a move by counting how many discs would be flipped
 */
function evaluateMove(
  board: Board,
  row: number,
  col: number,
  player: PlayerColor
): number {
  const opponent: PlayerColor = player === 'black' ? 'white' : 'black'
  let flips = 0

  for (const [dx, dy] of DIRECTIONS) {
    let x = row + dx
    let y = col + dy
    let tempFlips = 0

    while (x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE) {
      if (board[x][y] === null) break
      if (board[x][y] === opponent) {
        tempFlips++
      } else if (board[x][y] === player) {
        flips += tempFlips
        break
      }
      x += dx
      y += dy
    }
  }

  return flips
}

/**
 * Check if position is next to an empty corner
 */
function isNextToEmptyCorner(board: Board, row: number, col: number): boolean {
  const corners = [
    {
      corner: [0, 0],
      adjacent: [
        [0, 1],
        [1, 0],
        [1, 1],
      ],
    },
    {
      corner: [0, BOARD_SIZE - 1],
      adjacent: [
        [0, BOARD_SIZE - 2],
        [1, BOARD_SIZE - 1],
        [1, BOARD_SIZE - 2],
      ],
    },
    {
      corner: [BOARD_SIZE - 1, 0],
      adjacent: [
        [BOARD_SIZE - 2, 0],
        [BOARD_SIZE - 1, 1],
        [BOARD_SIZE - 2, 1],
      ],
    },
    {
      corner: [BOARD_SIZE - 1, BOARD_SIZE - 1],
      adjacent: [
        [BOARD_SIZE - 2, BOARD_SIZE - 1],
        [BOARD_SIZE - 1, BOARD_SIZE - 2],
        [BOARD_SIZE - 2, BOARD_SIZE - 2],
      ],
    },
  ]

  for (const { corner, adjacent } of corners) {
    if (board[corner[0]][corner[1]] === null) {
      for (const [ax, ay] of adjacent) {
        if (row === ax && col === ay) {
          return true
        }
      }
    }
  }

  return false
}

/**
 * Calculate best computer move using AI strategy
 */
export function calculateComputerMove(
  board: Board,
  computerColor: PlayerColor
): Position | null {
  const validMoves = getValidMoves(board, computerColor)
  if (validMoves.length === 0) {
    return null
  }

  let bestMove: Position | null = null
  let bestScore = -Infinity

  for (const { row, col } of validMoves) {
    let score = evaluateMove(board, row, col, computerColor)

    // Prioritize corners
    if (
      (row === 0 || row === BOARD_SIZE - 1) &&
      (col === 0 || col === BOARD_SIZE - 1)
    ) {
      score += POSITION_WEIGHTS.CORNER
    }
    // Prioritize edges
    else if (
      row === 0 ||
      row === BOARD_SIZE - 1 ||
      col === 0 ||
      col === BOARD_SIZE - 1
    ) {
      score += POSITION_WEIGHTS.EDGE
    }
    // Avoid cells next to corners if corner is empty
    else if (isNextToEmptyCorner(board, row, col)) {
      score += POSITION_WEIGHTS.NEAR_CORNER_PENALTY
    }

    if (score > bestScore) {
      bestScore = score
      bestMove = { row, col }
    }
  }

  return bestMove
}

/**
 * Get the opponent color
 */
export function getOpponent(player: PlayerColor): PlayerColor {
  return player === 'black' ? 'white' : 'black'
}
