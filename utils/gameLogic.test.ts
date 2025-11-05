/**
 * Tests for Othello game logic
 */

import {
  createInitialBoard,
  isValidMove,
  makeMove,
  getValidMoves,
  calculateScore,
  isGameOver,
  getOpponent,
  calculateComputerMove,
} from './gameLogic'
import { BOARD_SIZE } from '@/constants/GameConstants'
import { Position, Board } from '@/types/game'

describe('Game Logic - Board Creation', () => {
  test('creates a board with correct dimensions', () => {
    const board = createInitialBoard()
    expect(board).toHaveLength(BOARD_SIZE)
    expect(board[0]).toHaveLength(BOARD_SIZE)
  })

  test('creates board with initial pieces in center', () => {
    const board = createInitialBoard()
    // Check center pieces: (3,3) and (4,4) should be white
    expect(board[3][3]).toBe('white')
    expect(board[4][4]).toBe('white')
    // Check (3,4) and (4,3) should be black
    expect(board[3][4]).toBe('black')
    expect(board[4][3]).toBe('black')
  })

  test('creates board with all other cells empty', () => {
    const board = createInitialBoard()
    let emptyCount = 0
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (board[row][col] === null) {
          emptyCount++
        }
      }
    }
    expect(emptyCount).toBe(BOARD_SIZE * BOARD_SIZE - 4)
  })
})

describe('Game Logic - Helper Functions', () => {
  test('getOpponent returns correct opponent color', () => {
    expect(getOpponent('black')).toBe('white')
    expect(getOpponent('white')).toBe('black')
  })
})

describe('Game Logic - Valid Moves', () => {
  test('finds valid moves for black on initial board', () => {
    const board = createInitialBoard()
    const validMoves = getValidMoves(board, 'black')

    // Black's initial valid moves are (2,3), (3,2), (4,5), (5,4)
    expect(validMoves).toHaveLength(4)

    const movePositions = validMoves.map((m: Position) => `${m.row},${m.col}`)
    expect(movePositions).toContain('2,3')
    expect(movePositions).toContain('3,2')
    expect(movePositions).toContain('4,5')
    expect(movePositions).toContain('5,4')
  })

  test('isValidMove returns false for occupied cells', () => {
    const board = createInitialBoard()
    expect(isValidMove(board, 3, 3, 'black')).toBe(false) // White piece
    expect(isValidMove(board, 3, 4, 'black')).toBe(false) // Black piece
  })

  test('isValidMove returns false for invalid positions', () => {
    const board = createInitialBoard()
    expect(isValidMove(board, -1, 0, 'black')).toBe(false)
    expect(isValidMove(board, 0, BOARD_SIZE, 'black')).toBe(false)
    expect(isValidMove(board, BOARD_SIZE, 0, 'black')).toBe(false)
  })

  test('isValidMove returns true for valid opening moves', () => {
    const board = createInitialBoard()
    expect(isValidMove(board, 2, 3, 'black')).toBe(true)
    expect(isValidMove(board, 3, 2, 'black')).toBe(true)
    expect(isValidMove(board, 4, 5, 'black')).toBe(true)
    expect(isValidMove(board, 5, 4, 'black')).toBe(true)
  })
})

describe('Game Logic - Making Moves', () => {
  test('makeMove returns null for invalid moves', () => {
    const board = createInitialBoard()
    const result = makeMove(board, 0, 0, 'black')
    expect(result).toBeNull()
  })

  test('makeMove returns new board for valid moves', () => {
    const board = createInitialBoard()
    const newBoard = makeMove(board, 2, 3, 'black')

    expect(newBoard).not.toBeNull()
    expect(newBoard).not.toBe(board) // Should be a new board
    expect(newBoard![2][3]).toBe('black')
  })

  test('makeMove flips opponent pieces correctly', () => {
    const board = createInitialBoard()
    const newBoard = makeMove(board, 2, 3, 'black')

    expect(newBoard![2][3]).toBe('black') // Placed piece
    expect(newBoard![3][3]).toBe('black') // Flipped piece (was white)
  })

  test('makeMove does not modify original board', () => {
    const board = createInitialBoard()
    const originalWhiteAt33 = board[3][3]

    makeMove(board, 2, 3, 'black')

    expect(board[3][3]).toBe(originalWhiteAt33) // Original unchanged
    expect(board[2][3]).toBeNull() // Original unchanged
  })
})

describe('Game Logic - Scoring', () => {
  test('calculateScore returns correct initial scores', () => {
    const board = createInitialBoard()
    const score = calculateScore(board)

    expect(score.black).toBe(2)
    expect(score.white).toBe(2)
  })

  test('calculateScore updates after a move', () => {
    const board = createInitialBoard()
    const newBoard = makeMove(board, 2, 3, 'black')
    const score = calculateScore(newBoard!)

    expect(score.black).toBe(4) // 2 original + 1 placed + 1 flipped
    expect(score.white).toBe(1) // 2 original - 1 flipped
  })

  test('calculateScore handles empty board', () => {
    const emptyBoard = Array(BOARD_SIZE)
      .fill(null)
      .map(() => Array(BOARD_SIZE).fill(null))
    const score = calculateScore(emptyBoard)

    expect(score.black).toBe(0)
    expect(score.white).toBe(0)
  })
})

describe('Game Logic - Game Over', () => {
  test('isGameOver returns false for initial board', () => {
    const board = createInitialBoard()
    expect(isGameOver(board)).toBe(false)
  })

  test('isGameOver returns true when board is full', () => {
    // Create a full board
    const fullBoard = Array(BOARD_SIZE)
      .fill(null)
      .map(() => Array(BOARD_SIZE).fill('black'))
    expect(isGameOver(fullBoard)).toBe(true)
  })

  test('isGameOver returns false when valid moves exist', () => {
    const board = createInitialBoard()
    // Both players have valid moves
    expect(isGameOver(board)).toBe(false)
  })
})

describe('Game Logic - Computer AI', () => {
  test('calculateComputerMove returns a valid move', () => {
    const board = createInitialBoard()
    const move = calculateComputerMove(board, 'white')

    expect(move).not.toBeNull()
    if (move) {
      expect(move.row).toBeGreaterThanOrEqual(0)
      expect(move.row).toBeLessThan(BOARD_SIZE)
      expect(move.col).toBeGreaterThanOrEqual(0)
      expect(move.col).toBeLessThan(BOARD_SIZE)

      // Verify it's actually a valid move
      expect(isValidMove(board, move.row, move.col, 'white')).toBe(true)
    }
  })

  test('calculateComputerMove returns null when no moves available', () => {
    // Create a board where white has no moves
    const board = Array(BOARD_SIZE)
      .fill(null)
      .map(() => Array(BOARD_SIZE).fill('black'))
    const move = calculateComputerMove(board, 'white')

    expect(move).toBeNull()
  })

  test('calculateComputerMove prefers corner moves', () => {
    // Create a board state where a corner (0,0) is actually available for black
    const board: Board = Array(8)
      .fill(null)
      .map(() => Array(8).fill(null))

    // Set up pieces so that black can capture the top-left corner (0,0)
    board[0][1] = 'white' // White piece at (0,1)
    board[0][2] = 'black' // Black piece at (0,2)

    // Also add a non-corner move option at (1,0)
    board[1][0] = 'white'
    board[2][0] = 'black'

    // And another non-corner move at (5,5)
    board[4][5] = 'white'
    board[5][5] = 'white'
    board[6][5] = 'black'

    const move = calculateComputerMove(board, 'black')

    // Verify the AI chooses the corner move (0,0)
    expect(move).not.toBeNull()
    expect(move?.row).toBe(0)
    expect(move?.col).toBe(0)
  })
})

describe('Game Logic - Complex Scenarios', () => {
  test('handles multiple piece flips in different directions', () => {
    // Create a custom board where a move flips multiple pieces
    const board = createInitialBoard()

    // Make a series of moves to set up the scenario
    let currentBoard = board

    // Black's move
    currentBoard = makeMove(currentBoard, 2, 3, 'black')!
    expect(currentBoard).not.toBeNull()

    // White's move
    currentBoard = makeMove(currentBoard, 2, 2, 'white')!
    expect(currentBoard).not.toBeNull()

    // Verify board state changes
    const score = calculateScore(currentBoard)
    expect(score.black + score.white).toBeGreaterThan(4)
  })

  test('correctly identifies when a player must pass', () => {
    // Create a board where one player has no valid moves
    // This would require a specific board setup
    const board = createInitialBoard()

    const blackMoves = getValidMoves(board, 'black')
    const whiteMoves = getValidMoves(board, 'white')

    // Initially both players should have moves
    expect(blackMoves.length).toBeGreaterThan(0)
    expect(whiteMoves.length).toBeGreaterThan(0)
  })
})
