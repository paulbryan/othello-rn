/**
 * New Game Bottom Sheet Modal
 */

import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native'
import { GameMode, PlayerColor } from '@/types/game'

const { height } = Dimensions.get('window')

interface NewGameModalProps {
  visible: boolean
  onClose: () => void
  onNewGame: (mode: GameMode, playerColor?: PlayerColor) => void
  textColor: string
  cardBackground: string
  primaryColor: string
  backgroundColor: string
}

export const NewGameModal: React.FC<NewGameModalProps> = ({
  visible,
  onClose,
  onNewGame,
  textColor,
  cardBackground,
  primaryColor,
  backgroundColor,
}) => {
  const [gameMode, setGameMode] = useState<GameMode>('pvc')
  const [playerColor, setPlayerColor] = useState<PlayerColor>('black')

  const handleNewGame = () => {
    onNewGame(gameMode, gameMode === 'pvc' ? playerColor : undefined)
    onClose()
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType='slide'
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View
              style={[styles.bottomSheet, { backgroundColor: cardBackground }]}
            >
              <View style={styles.handle} />

              <Text style={[styles.title, { color: textColor }]}>New Game</Text>

              <View style={styles.section}>
                <Text style={[styles.label, { color: textColor }]}>
                  Game Mode:
                </Text>
                <View style={styles.radioGroup}>
                  <TouchableOpacity
                    style={styles.radioOption}
                    onPress={() => setGameMode('pvp')}
                  >
                    <View
                      style={[
                        styles.radio,
                        gameMode === 'pvp' && styles.radioSelected,
                      ]}
                    >
                      {gameMode === 'pvp' && <View style={styles.radioInner} />}
                    </View>
                    <Text style={[styles.radioLabel, { color: textColor }]}>
                      Player vs Player
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.radioOption}
                    onPress={() => setGameMode('pvc')}
                  >
                    <View
                      style={[
                        styles.radio,
                        gameMode === 'pvc' && styles.radioSelected,
                      ]}
                    >
                      {gameMode === 'pvc' && <View style={styles.radioInner} />}
                    </View>
                    <Text style={[styles.radioLabel, { color: textColor }]}>
                      Player vs Computer
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {gameMode === 'pvc' && (
                <View style={styles.section}>
                  <Text style={[styles.label, { color: textColor }]}>
                    Play as:
                  </Text>
                  <View style={styles.radioGroup}>
                    <TouchableOpacity
                      style={styles.radioOption}
                      onPress={() => setPlayerColor('black')}
                    >
                      <View
                        style={[
                          styles.radio,
                          playerColor === 'black' && styles.radioSelected,
                        ]}
                      >
                        {playerColor === 'black' && (
                          <View style={styles.radioInner} />
                        )}
                      </View>
                      <Text style={[styles.radioLabel, { color: textColor }]}>
                        Black
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.radioOption}
                      onPress={() => setPlayerColor('white')}
                    >
                      <View
                        style={[
                          styles.radio,
                          playerColor === 'white' && styles.radioSelected,
                        ]}
                      >
                        {playerColor === 'white' && (
                          <View style={styles.radioInner} />
                        )}
                      </View>
                      <Text style={[styles.radioLabel, { color: textColor }]}>
                        White
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              <View style={styles.buttons}>
                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.cancelButton,
                    { backgroundColor: backgroundColor },
                  ]}
                  onPress={onClose}
                >
                  <Text style={[styles.buttonText, { color: textColor }]}>
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.startButton,
                    { backgroundColor: primaryColor },
                  ]}
                  onPress={handleNewGame}
                >
                  <Text style={[styles.buttonText, { color: 'white' }]}>
                    Start Game
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
    maxHeight: height * 0.7,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  radioGroup: {
    gap: 10,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4a90e2',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: '#4a90e2',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4a90e2',
  },
  radioLabel: {
    fontSize: 16,
  },
  buttons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#ccc',
  },
  startButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
})
