/**
 * Game board component
 */

import React from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import { Board as BoardType, PlayerColor } from '@/types/game'
import { Cell } from './Cell'
import { isValidMove } from '@/utils/gameLogic'
import { BOARD_SIZE } from '@/constants/GameConstants'

const { width } = Dimensions.get('window')
const BOARD_WIDTH = Math.min(width - 40, 600)

interface GameBoardProps {
  board: BoardType
  currentPlayer: PlayerColor
  gameActive: boolean
  lastComputerMove: { row: number; col: number } | null
  onCellPress: (row: number, col: number) => void
  boardColor: string
  cellBorderColor: string
  validMoveColor: string
  lastMoveColor: string
  customBlackColor?: string
  customWhiteColor?: string
}

export const GameBoard: React.FC<GameBoardProps> = ({
  board,
  currentPlayer,
  gameActive,
  lastComputerMove,
  onCellPress,
  boardColor,
  cellBorderColor,
  validMoveColor,
  lastMoveColor,
  customBlackColor,
  customWhiteColor,
}) => {
  const renderCell = (row: number, col: number) => {
    const value = board[row][col]
    const isValid = gameActive && isValidMove(board, row, col, currentPlayer)
    const isLast =
      lastComputerMove?.row === row && lastComputerMove?.col === col

    return (
      <Cell
        key={`${row}-${col}`}
        value={value}
        isValidMove={isValid}
        isLastMove={isLast}
        onPress={() => onCellPress(row, col)}
        boardColor={boardColor}
        validMoveColor={validMoveColor}
        lastMoveColor={lastMoveColor}
        customBlackColor={customBlackColor}
        customWhiteColor={customWhiteColor}
      />
    )
  }

  return (
    <View style={[styles.boardContainer, { backgroundColor: cellBorderColor }]}>
      <View style={styles.board}>
        {Array.from({ length: BOARD_SIZE }, (_, row) => (
          <View key={`row-${row}`} style={styles.row}>
            {Array.from({ length: BOARD_SIZE }, (_, col) =>
              renderCell(row, col)
            )}
          </View>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  boardContainer: {
    width: BOARD_WIDTH,
    alignSelf: 'center',
    borderRadius: 10,
    padding: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  board: {
    width: '100%',
    aspectRatio: 1,
  },
  row: {
    flexDirection: 'row',
    flex: 1,
  },
})
