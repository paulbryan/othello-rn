/**
 * Game controls component
 */

import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { GameMode, PlayerColor } from '@/types/game'

interface GameControlsProps {
  onNewGame: (mode: GameMode, playerColor?: PlayerColor) => void
  textColor: string
  cardBackground: string
  primaryColor: string
}

export const GameControls: React.FC<GameControlsProps> = ({
  onNewGame,
  textColor,
  cardBackground,
  primaryColor,
}) => {
  const [gameMode, setGameMode] = useState<GameMode>('pvc')
  const [playerColor, setPlayerColor] = useState<PlayerColor>('black')

  const handleNewGame = () => {
    onNewGame(gameMode, gameMode === 'pvc' ? playerColor : undefined)
  }

  return (
    <View style={[styles.container, { backgroundColor: cardBackground }]}>
      <TouchableOpacity
        style={[
          styles.button,
          styles.primaryButton,
          { backgroundColor: primaryColor },
        ]}
        onPress={handleNewGame}
      >
        <Text style={styles.buttonText}>New Game</Text>
      </TouchableOpacity>

      <View style={styles.modeSelection}>
        <Text style={[styles.label, { color: textColor }]}>Game Mode:</Text>
        <View style={styles.radioGroup}>
          <TouchableOpacity
            style={styles.radioOption}
            onPress={() => setGameMode('pvp')}
          >
            <View
              style={[styles.radio, gameMode === 'pvp' && styles.radioSelected]}
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
              style={[styles.radio, gameMode === 'pvc' && styles.radioSelected]}
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
        <View style={styles.colorSelection}>
          <Text style={[styles.label, { color: textColor }]}>Play as:</Text>
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
                {playerColor === 'black' && <View style={styles.radioInner} />}
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
                {playerColor === 'white' && <View style={styles.radioInner} />}
              </View>
              <Text style={[styles.radioLabel, { color: textColor }]}>
                White
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  button: {
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  primaryButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modeSelection: {
    marginTop: 15,
  },
  colorSelection: {
    marginTop: 15,
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
    paddingVertical: 5,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#4a90e2',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: '#4a90e2',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4a90e2',
  },
  radioLabel: {
    fontSize: 14,
  },
})
