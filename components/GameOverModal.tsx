/**
 * Game over modal component
 */

import React from 'react'
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native'
import { GameScore } from '@/types/game'

interface GameOverModalProps {
  visible: boolean
  score: GameScore
  blackPlayerName: string
  whitePlayerName: string
  onPlayAgain: () => void
  textColor: string
  cardBackground: string
  primaryColor: string
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  visible,
  score,
  blackPlayerName,
  whitePlayerName,
  onPlayAgain,
  textColor,
  cardBackground,
  primaryColor,
}) => {
  const getWinnerMessage = () => {
    if (score.black > score.white) {
      return `${blackPlayerName} wins! ${score.black} - ${score.white}`
    } else if (score.white > score.black) {
      return `${whitePlayerName} wins! ${score.white} - ${score.black}`
    } else {
      return `It's a tie! ${score.black} - ${score.white}`
    }
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType='fade'
      onRequestClose={onPlayAgain}
    >
      <View style={styles.overlay}>
        <View
          style={[styles.modalContent, { backgroundColor: cardBackground }]}
        >
          <Text style={[styles.title, { color: textColor }]}>Game Over!</Text>
          <Text style={[styles.message, { color: textColor }]}>
            {getWinnerMessage()}
          </Text>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: primaryColor }]}
            onPress={onPlayAgain}
          >
            <Text style={styles.buttonText}>Play Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    padding: 40,
    borderRadius: 15,
    alignItems: 'center',
    maxWidth: 400,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  message: {
    fontSize: 18,
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
})
