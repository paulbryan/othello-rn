import React from 'react'
import { View, Text, StyleSheet, Animated } from 'react-native'
import { Colors } from '@/constants/Colors'
import { Disc } from './Disc'

interface SplashScreenProps {
  onFinish: () => void
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current
  const scaleAnim = React.useRef(new Animated.Value(0.8)).current

  React.useEffect(() => {
    // Animate in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start()

    // Auto-hide after 2.5 seconds
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        onFinish()
      })
    }, 2500)

    return () => clearTimeout(timer)
  }, [fadeAnim, scaleAnim, onFinish])

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <View style={styles.content}>
        <Text style={styles.title}>OTHELLO</Text>

        <View style={styles.boardContainer}>
          <View style={styles.miniBoard}>
            {/* Create a simplified 8x8 board */}
            {[0, 1, 2, 3, 4, 5, 6, 7].map((row) => (
              <View key={row} style={styles.row}>
                {[0, 1, 2, 3, 4, 5, 6, 7].map((col) => {
                  // Show initial pieces at center: (3,3), (3,4), (4,3), (4,4)
                  const isWhite =
                    (row === 3 && col === 3) || (row === 4 && col === 4)
                  const isBlack =
                    (row === 3 && col === 4) || (row === 4 && col === 3)

                  return (
                    <View key={col} style={styles.cell}>
                      {(isWhite || isBlack) && (
                        <View style={styles.discWrapper}>
                          <Disc color={isWhite ? 'white' : 'black'} />
                        </View>
                      )}
                    </View>
                  )
                })}
              </View>
            ))}
          </View>
        </View>

        <Text style={styles.subtitle}>React Native Edition</Text>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.light.background,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 40,
    letterSpacing: 4,
  },
  boardContainer: {
    padding: 20,
  },
  miniBoard: {
    width: 240,
    height: 240,
    backgroundColor: Colors.light.boardColor,
    borderRadius: 8,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    backgroundColor: Colors.light.boardColor,
    borderWidth: 0.5,
    borderColor: Colors.light.cellBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  discWrapper: {
    width: '80%',
    height: '80%',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.text,
    marginTop: 40,
    opacity: 0.7,
  },
})
