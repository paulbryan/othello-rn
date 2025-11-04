/**
 * Game state management hook using useReducer
 */

import { useReducer, useCallback, useEffect, useRef } from 'react'
import { GameState, GameAction, GameMode, PlayerColor } from '@/types/game'
import {
  createInitialBoard,
  makeMove,
  getValidMoves,
  calculateScore,
  isGameOver,
  calculateComputerMove,
  getOpponent,
} from '@/utils/gameLogic'
import { COMPUTER_TURN_DELAY } from '@/constants/GameConstants'

const initialState: GameState = {
  board: createInitialBoard(),
  currentPlayer: 'black',
  gameMode: 'pvc',
  playerColor: 'black',
  computerColor: 'white',
  gameActive: true,
  lastComputerMove: null,
  blackPlayerName: 'Black',
  whitePlayerName: 'White',
  score: { black: 2, white: 2 },
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'NEW_GAME': {
      const playerColor = action.playerColor || 'black'
      const computerColor = playerColor === 'black' ? 'white' : 'black'

      return {
        ...state,
        board: createInitialBoard(),
        currentPlayer: 'black',
        gameMode: action.mode,
        playerColor,
        computerColor,
        gameActive: true,
        lastComputerMove: null,
        blackPlayerName: action.blackName || state.blackPlayerName,
        whitePlayerName: action.whiteName || state.whitePlayerName,
        score: { black: 2, white: 2 },
      }
    }

    case 'MAKE_MOVE': {
      const newBoard = makeMove(
        state.board,
        action.row,
        action.col,
        state.currentPlayer
      )
      if (!newBoard) return state // Invalid move

      const newScore = calculateScore(newBoard)

      return {
        ...state,
        board: newBoard,
        score: newScore,
        lastComputerMove: null, // Clear computer move highlight on player move
      }
    }

    case 'COMPUTER_MOVE': {
      const newBoard = makeMove(
        state.board,
        action.row,
        action.col,
        state.currentPlayer
      )
      if (!newBoard) return state

      const newScore = calculateScore(newBoard)

      return {
        ...state,
        board: newBoard,
        score: newScore,
        lastComputerMove: { row: action.row, col: action.col },
      }
    }

    case 'SWITCH_PLAYER': {
      const opponent = getOpponent(state.currentPlayer)

      // Check if opponent has valid moves
      if (getValidMoves(state.board, opponent).length > 0) {
        return {
          ...state,
          currentPlayer: opponent,
        }
      }
      // If opponent has no moves but current player does, current player goes again
      else if (getValidMoves(state.board, state.currentPlayer).length > 0) {
        return state // Same player continues
      }
      // No valid moves for either player - game over
      else {
        return {
          ...state,
          gameActive: false,
        }
      }
    }

    case 'END_GAME': {
      return {
        ...state,
        gameActive: false,
      }
    }

    case 'UPDATE_SCORE': {
      return {
        ...state,
        score: calculateScore(state.board),
      }
    }

    default:
      return state
  }
}

export function useGame() {
  const [state, dispatch] = useReducer(gameReducer, initialState)
  const computerMoveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isComputerThinkingRef = useRef(false)

  // Handle computer move scheduling
  useEffect(() => {
    if (
      state.gameActive &&
      state.gameMode === 'pvc' &&
      state.currentPlayer === state.computerColor &&
      !isComputerThinkingRef.current
    ) {
      // Mark that computer is thinking to prevent duplicate moves
      isComputerThinkingRef.current = true

      // Schedule computer move
      computerMoveTimeoutRef.current = setTimeout(() => {
        const move = calculateComputerMove(state.board, state.computerColor)
        if (move) {
          // Simulate the move to check the resulting board
          const newBoard = makeMove(
            state.board,
            move.row,
            move.col,
            state.computerColor
          )

          if (newBoard) {
            dispatch({ type: 'COMPUTER_MOVE', row: move.row, col: move.col })

            // Check game over after computer move with the NEW board
            setTimeout(() => {
              isComputerThinkingRef.current = false
              if (isGameOver(newBoard)) {
                dispatch({ type: 'END_GAME' })
              } else {
                dispatch({ type: 'SWITCH_PLAYER' })
              }
            }, 100)
          } else {
            // Move failed somehow, switch anyway
            isComputerThinkingRef.current = false
            dispatch({ type: 'SWITCH_PLAYER' })
          }
        } else {
          // Computer has no valid moves
          isComputerThinkingRef.current = false
          dispatch({ type: 'SWITCH_PLAYER' })
        }
      }, COMPUTER_TURN_DELAY)
    }

    return () => {
      if (computerMoveTimeoutRef.current) {
        clearTimeout(computerMoveTimeoutRef.current)
      }
    }
  }, [
    state.gameActive,
    state.gameMode,
    state.currentPlayer,
    state.computerColor,
    state.board,
    // NOTE: We use isComputerThinkingRef to prevent duplicate moves
    // when the board changes during computer's turn
  ])

  const handleCellPress = useCallback(
    (row: number, col: number) => {
      if (!state.gameActive) return
      if (
        state.gameMode === 'pvc' &&
        state.currentPlayer === state.computerColor
      )
        return

      // Check if this is a valid move before proceeding
      const newBoard = makeMove(state.board, row, col, state.currentPlayer)
      if (!newBoard) return // Invalid move - do nothing

      dispatch({ type: 'MAKE_MOVE', row, col })

      // Check game over
      setTimeout(() => {
        if (isGameOver(newBoard)) {
          dispatch({ type: 'END_GAME' })
        } else {
          dispatch({ type: 'SWITCH_PLAYER' })
        }
      }, 100)
    },
    [
      state.gameActive,
      state.gameMode,
      state.currentPlayer,
      state.computerColor,
      state.board,
    ]
  )

  const startNewGame = useCallback(
    (
      mode: GameMode,
      playerColor?: PlayerColor,
      blackName?: string,
      whiteName?: string
    ) => {
      dispatch({ type: 'NEW_GAME', mode, playerColor, blackName, whiteName })
    },
    []
  )

  return {
    state,
    handleCellPress,
    startNewGame,
    dispatch,
  }
}
