/**
 * Othello Game - Main App
 */

import React, { useState, useEffect, useCallback } from 'react'
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  useColorScheme,
  TouchableOpacity,
} from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaView } from 'react-native'
import * as SplashScreen from 'expo-splash-screen'

import { useGame } from '@/hooks/useGame'
import { GameBoard } from '@/components/GameBoard'
import { ScoreBoard } from '@/components/ScoreBoard'
import { NewGameModal } from '@/components/NewGameModal'
import { GameOverModal } from '@/components/GameOverModal'
import { SkipNotification } from '@/components/SkipNotification'
import { Colors, DefaultColors } from '@/constants/Colors'
import { GameMode, PlayerColor } from '@/types/game'

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync()

// Set the animation options
SplashScreen.setOptions({
  duration: 1000,
  fade: true,
})

export default function App() {
  const systemColorScheme = useColorScheme()
  const [theme, setTheme] = useState<'light' | 'dark'>(
    systemColorScheme || 'light'
  )
  const colors = Colors[theme]

  const { state, handleCellPress, startNewGame } = useGame()
  const [showNewGameModal, setShowNewGameModal] = useState(false)
  const [appIsReady, setAppIsReady] = useState(false)

  // Custom colors (could be persisted with AsyncStorage later)
  const [customColors, setCustomColors] = useState({
    board: DefaultColors.boardColor,
    black: DefaultColors.blackPiece,
    white: DefaultColors.whitePiece,
  })

  useEffect(() => {
    async function prepare() {
      try {
        // Preload any resources here (fonts, images, etc.)
        // Simulate loading time
        await new Promise((resolve) => setTimeout(resolve, 1500))
      } catch (e) {
        console.warn(e)
      } finally {
        setAppIsReady(true)
      }
    }

    prepare()
  }, [])

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // Hide the splash screen with fade animation
      await SplashScreen.hideAsync()
    }
  }, [appIsReady])

  if (!appIsReady) {
    return null
  }

  // Determine current player name for display
  const getCurrentPlayerName = () => {
    if (
      state.gameMode === 'pvc' &&
      state.currentPlayer === state.computerColor
    ) {
      return `Computer (${state.currentPlayer === 'black' ? 'Black' : 'White'})`
    }
    return state.currentPlayer === 'black'
      ? state.blackPlayerName
      : state.whitePlayerName
  }

  const handleNewGame = (mode: GameMode, playerColor?: PlayerColor) => {
    startNewGame(
      mode,
      playerColor,
      state.blackPlayerName,
      state.whitePlayerName
    )
    setShowNewGameModal(false)
  }

  const handlePlayAgain = () => {
    startNewGame(
      state.gameMode,
      state.playerColor,
      state.blackPlayerName,
      state.whitePlayerName
    )
  }

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      onLayout={onLayoutRootView}
    >
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>Othello</Text>
          </View>

          {/* Score Board */}
          <ScoreBoard
            score={state.score}
            currentPlayer={state.currentPlayer}
            currentPlayerName={getCurrentPlayerName()}
            blackPlayerName={state.blackPlayerName}
            whitePlayerName={state.whitePlayerName}
            textColor={colors.text}
            cardBackground={colors.cardBackground}
            customBlackColor={customColors.black}
            customWhiteColor={customColors.white}
          />

          {/* Game Board */}
          <GameBoard
            board={state.board}
            currentPlayer={state.currentPlayer}
            gameActive={state.gameActive}
            lastComputerMove={state.lastComputerMove}
            onCellPress={handleCellPress}
            boardColor={customColors.board}
            cellBorderColor={colors.cellBorder}
            validMoveColor={colors.validMove}
            lastMoveColor={colors.lastMove}
            customBlackColor={customColors.black}
            customWhiteColor={customColors.white}
          />

          {/* New Game Button */}
          <TouchableOpacity
            style={[styles.newGameButton, { backgroundColor: colors.primary }]}
            onPress={() => setShowNewGameModal(true)}
          >
            <Text style={styles.newGameButtonText}>New Game</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* New Game Modal */}
      <NewGameModal
        visible={showNewGameModal}
        onClose={() => setShowNewGameModal(false)}
        onNewGame={handleNewGame}
        textColor={colors.text}
        cardBackground={colors.cardBackground}
        primaryColor={colors.primary}
        backgroundColor={colors.background}
      />

      {/* Game Over Modal */}
      <GameOverModal
        visible={!state.gameActive}
        score={state.score}
        blackPlayerName={state.blackPlayerName}
        whitePlayerName={state.whitePlayerName}
        onPlayAgain={handlePlayAgain}
        textColor={colors.text}
        cardBackground={colors.cardBackground}
        primaryColor={colors.primary}
      />

      {/* Skip Turn Notification */}
      {state.skippedPlayer && (
        <SkipNotification
          visible={true}
          skippedPlayerName={
            state.skippedPlayer === 'black'
              ? state.blackPlayerName
              : state.whitePlayerName
          }
          skippedColor={state.skippedPlayer}
          textColor='#fff'
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  container: {
    flex: 1,
    maxWidth: 800,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  newGameButton: {
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  newGameButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
})
