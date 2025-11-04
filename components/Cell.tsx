/**
 * Individual cell component
 */

import React from 'react'
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native'
import { CellValue, PlayerColor } from '@/types/game'
import { Disc } from './Disc'

interface CellProps {
  value: CellValue
  isValidMove: boolean
  isLastMove: boolean
  onPress: () => void
  boardColor: string
  validMoveColor: string
  lastMoveColor: string
  customBlackColor?: string
  customWhiteColor?: string
}

export const Cell: React.FC<CellProps> = ({
  value,
  isValidMove,
  isLastMove,
  onPress,
  boardColor,
  validMoveColor,
  lastMoveColor,
  customBlackColor,
  customWhiteColor,
}) => {
  const getCellStyle = (): ViewStyle => {
    if (isLastMove) {
      return { backgroundColor: lastMoveColor }
    }
    if (isValidMove) {
      return { backgroundColor: validMoveColor }
    }
    return { backgroundColor: boardColor }
  }

  return (
    <TouchableOpacity
      style={[styles.cell, getCellStyle()]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {value && (
        <Disc
          color={value}
          customBlackColor={customBlackColor}
          customWhiteColor={customWhiteColor}
        />
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  cell: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
