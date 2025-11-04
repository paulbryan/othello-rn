/**
 * Disc (game piece) component
 */

import React from 'react'
import { View, StyleSheet } from 'react-native'
import { PlayerColor } from '@/types/game'
import { DefaultColors } from '@/constants/Colors'

interface DiscProps {
  color: PlayerColor
  customBlackColor?: string
  customWhiteColor?: string
}

export const Disc: React.FC<DiscProps> = ({
  color,
  customBlackColor = DefaultColors.blackPiece,
  customWhiteColor = DefaultColors.whitePiece,
}) => {
  const backgroundColor =
    color === 'black' ? customBlackColor : customWhiteColor

  return (
    <View style={[styles.disc, { backgroundColor }]}>
      <View
        style={[
          styles.innerShadow,
          color === 'black' ? styles.blackShadow : styles.whiteShadow,
        ]}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  disc: {
    width: '80%',
    height: '80%',
    borderRadius: 1000,
    borderWidth: 2,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerShadow: {
    width: '100%',
    height: '100%',
    borderRadius: 1000,
  },
  blackShadow: {
    // Simulate inner shadow for black pieces
  },
  whiteShadow: {
    // Simulate inner shadow for white pieces
  },
})
