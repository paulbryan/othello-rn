/**
 * Score board component
 */

import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { GameScore, PlayerColor } from '@/types/game'
import { DefaultColors } from '@/constants/Colors'

interface ScoreBoardProps {
  score: GameScore
  currentPlayer: PlayerColor
  currentPlayerName: string
  blackPlayerName: string
  whitePlayerName: string
  textColor: string
  cardBackground: string
  customBlackColor?: string
  customWhiteColor?: string
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  score,
  currentPlayer,
  currentPlayerName,
  blackPlayerName,
  whitePlayerName,
  textColor,
  cardBackground,
  customBlackColor = DefaultColors.blackPiece,
  customWhiteColor = DefaultColors.whitePiece,
}) => {
  return (
    <View style={[styles.container, { backgroundColor: cardBackground }]}>
      <View style={styles.scoreSection}>
        <View style={styles.playerScore}>
          <View style={styles.scoreLabel}>
            <View
              style={[styles.piece, { backgroundColor: customBlackColor }]}
            />
            <Text style={[styles.playerName, { color: textColor }]}>
              {blackPlayerName}
            </Text>
          </View>
          <Text style={[styles.score, { color: textColor }]}>
            {score.black}
          </Text>
        </View>

        <View style={styles.playerScore}>
          <View style={styles.scoreLabel}>
            <View
              style={[styles.piece, { backgroundColor: customWhiteColor }]}
            />
            <Text style={[styles.playerName, { color: textColor }]}>
              {whitePlayerName}
            </Text>
          </View>
          <Text style={[styles.score, { color: textColor }]}>
            {score.white}
          </Text>
        </View>
      </View>

      <Text style={[styles.currentPlayer, { color: textColor }]}>
        {currentPlayerName}'s Turn
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  scoreSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  playerScore: {
    alignItems: 'center',
  },
  scoreLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 5,
  },
  piece: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(0, 0, 0, 0.2)',
  },
  playerName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  score: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  currentPlayer: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
})
