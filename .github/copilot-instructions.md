# React Native Expo App - Copilot Instructions

## Project Overview

This is an Othello game built as a React Native Expo application with TypeScript support.

## Technology Stack

- **Framework**: React Native
- **Platform**: Expo SDK 52+
- **Language**: TypeScript
- **Navigation**: React Navigation (when needed)
- **State Management**: React hooks (useState, useReducer, useContext)
- **Styling**: StyleSheet API with responsive design

## Project Structure

```
othello-rn/
├── app/                    # Main application code (Expo Router structure)
│   ├── (tabs)/            # Tab-based navigation screens
│   ├── _layout.tsx        # Root layout component
│   └── index.tsx          # Entry point
├── components/            # Reusable components
├── hooks/                 # Custom React hooks
├── utils/                 # Utility functions
├── constants/             # App constants (colors, themes, etc.)
├── types/                 # TypeScript type definitions
├── assets/                # Static assets (images, fonts)
└── app.json              # Expo configuration
```

## Code Style & Standards

### TypeScript

- **Always use TypeScript** for all new files (.tsx, .ts)
- Define explicit types for props, state, and function returns
- Use interfaces for component props and object shapes
- Avoid `any` type - use `unknown` if type is truly unknown
- Export types/interfaces for reusability

Example:

```typescript
interface GameBoardProps {
  size: number
  onMove: (row: number, col: number) => void
  disabled?: boolean
}

export const GameBoard: React.FC<GameBoardProps> = ({
  size,
  onMove,
  disabled = false,
}) => {
  // Component implementation
}
```

### Component Guidelines

- **Use functional components** with hooks (no class components)
- **Keep components small and focused** (single responsibility)
- **Extract reusable logic** into custom hooks
- **Use memo()** for expensive components that re-render frequently
- **Use useCallback()** for functions passed as props
- **Use useMemo()** for expensive computations

Component Structure:

```typescript
// 1. Imports
import React, { useState, useCallback } from 'react'
import { View, Text, StyleSheet } from 'react-native'

// 2. Types/Interfaces
interface Props {
  title: string
}

// 3. Component
export const MyComponent: React.FC<Props> = ({ title }) => {
  // 3a. Hooks
  const [state, setState] = useState(0)

  // 3b. Callbacks/Handlers
  const handlePress = useCallback(() => {
    setState((prev) => prev + 1)
  }, [])

  // 3c. Render
  return (
    <View style={styles.container}>
      <Text>{title}</Text>
    </View>
  )
}

// 4. Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
```

### Styling Best Practices

- **Use StyleSheet.create()** for all styles (better performance)
- **Keep styles co-located** with components
- **Use constants** for colors, spacing, and typography
- **Make layouts responsive** using Dimensions or responsive libraries
- **Avoid inline styles** except for dynamic values
- **Use flexbox** for layouts (default in React Native)

Example:

```typescript
import { StyleSheet, Dimensions } from 'react-native'
import { Colors } from '@/constants/Colors'

const { width } = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  board: {
    width: width - 32,
    aspectRatio: 1,
  },
})
```

### State Management

- **Use useState** for simple component state
- **Use useReducer** for complex state logic (like game state)
- **Use Context API** for global state (theme, user settings)
- **Keep state as close as possible** to where it's used
- **Lift state up** only when multiple components need it

Example for game logic:

```typescript
type GameState = {
  board: number[][]
  currentPlayer: 'black' | 'white'
  score: { black: number; white: number }
}

type GameAction =
  | { type: 'MAKE_MOVE'; row: number; col: number }
  | { type: 'RESET_GAME' }

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'MAKE_MOVE':
      // Game logic
      return state
    case 'RESET_GAME':
      return initialState
    default:
      return state
  }
}
```

## Expo-Specific Guidelines

### Expo Commands

```bash
# Development
npx expo start              # Start development server
npx expo start --clear      # Start with cache cleared
npx expo start --tunnel     # Use tunnel connection (for remote testing)

# Platform-specific
npx expo run:android        # Build and run on Android
npx expo run:ios           # Build and run on iOS (macOS only)

# Dependencies
npx expo install <package>  # Install Expo-compatible package
npx expo install --check    # Check for compatibility issues
npx expo install --fix      # Fix dependency versions

# Doctor (diagnostics)
npx expo doctor            # Check project health
npx expo doctor --fix      # Auto-fix common issues

# Build & Deploy
eas build --platform android    # Build for Android (requires EAS)
eas build --platform ios        # Build for iOS (requires EAS)
eas submit                      # Submit to app stores
```

### Using Expo APIs

- **Prefer Expo APIs** over third-party libraries when available
- **Check compatibility** with `npx expo install` for all packages
- **Use expo-constants** for app configuration
- **Use expo-file-system** for file operations
- **Use expo-asset** for bundling assets

Common Expo modules for Othello game:

```typescript
import { Audio } from 'expo-av' // Sound effects
import * as Haptics from 'expo-haptics' // Haptic feedback
import AsyncStorage from '@react-native-async-storage/async-storage' // Save game state
import { StatusBar } from 'expo-status-bar' // Status bar control
```

### Asset Management

- **Place images** in `assets/images/`
- **Place fonts** in `assets/fonts/`
- **Use require()** for static assets: `require('../assets/icon.png')`
- **Optimize images** before adding to project
- **Use SVG** via react-native-svg for scalable graphics

### Configuration (app.json)

```json
{
  "expo": {
    "name": "Othello RN",
    "slug": "othello-rn",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#1a1a1a"
    },
    "userInterfaceStyle": "automatic"
  }
}
```

## Performance Best Practices

### Rendering Optimization

- **Use FlatList/SectionList** for long lists (not ScrollView + map)
- **Implement key extractor** properly for lists
- **Use getItemLayout** for FlatList when items have fixed size
- **Avoid anonymous functions** in render (use useCallback)
- **Use React.memo()** for pure components
- **Profile with React DevTools** to identify slow renders

### Memory Management

- **Clean up effects** (return cleanup function from useEffect)
- **Unsubscribe from listeners** in cleanup
- **Cancel async operations** when component unmounts
- **Avoid memory leaks** from closures

Example:

```typescript
useEffect(() => {
  const subscription = someObservable.subscribe((data) => {
    setData(data)
  })

  return () => {
    subscription.unsubscribe()
  }
}, [])
```

## Testing Guidelines

- **Write unit tests** for game logic and utility functions
- **Use React Native Testing Library** for component tests
- **Test user interactions** and edge cases
- **Mock Expo modules** in tests when needed

## Error Handling

- **Use try-catch** for async operations
- **Provide user feedback** for errors
- **Log errors** appropriately (use console.warn/console.error)
- **Implement error boundaries** for React component errors

Example:

```typescript
const loadGameState = async () => {
  try {
    const savedGame = await AsyncStorage.getItem('gameState')
    if (savedGame) {
      setGameState(JSON.parse(savedGame))
    }
  } catch (error) {
    console.error('Failed to load game:', error)
    // Show user-friendly error message
  }
}
```

## Accessibility

- **Add accessibilityLabel** to interactive elements
- **Use accessibilityRole** appropriately
- **Ensure touch targets** are at least 44x44 points
- **Support dark mode** using system settings
- **Test with screen reader** (TalkBack/VoiceOver)

```typescript
<Pressable
  accessibilityRole='button'
  accessibilityLabel='Place piece at row 3, column 4'
  accessibilityHint='Double tap to place your piece'
  onPress={handleMove}
>
  <GamePiece />
</Pressable>
```

## Git Workflow

- **Use meaningful commit messages** (conventional commits)
- **Keep commits atomic** (one logical change per commit)
- **Create feature branches** for new features
- **Review changes** before committing
- **Update README** when adding features

Commit message format:

```
feat: add game timer functionality
fix: correct piece flip animation
docs: update setup instructions
refactor: simplify board state logic
style: format code with prettier
test: add unit tests for game rules
```

## Common Patterns for Othello Game

### Game Board Rendering

```typescript
const renderCell = (row: number, col: number) => {
  const piece = board[row][col]
  return (
    <Pressable
      key={`${row}-${col}`}
      style={styles.cell}
      onPress={() => handleCellPress(row, col)}
    >
      {piece && <Piece color={piece} />}
    </Pressable>
  )
}
```

### Game Logic Separation

- Keep game rules in pure functions (utils/gameLogic.ts)
- Separate UI from business logic
- Make game logic testable (no React dependencies)

## Environment & Configuration

- **Use .env files** for environment variables (with expo-constants)
- **Never commit secrets** or API keys
- **Use different configs** for dev/staging/prod

## Debugging

```bash
# React Native Debugger
npx expo start --dev-client

# View logs
npx expo start --android --no-dev  # Production mode
npx react-native log-android        # Android logs
npx react-native log-ios           # iOS logs

# Network debugging
# Enable Network Inspector in Dev Menu (Cmd+D / Cmd+M)
```

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [React Navigation](https://reactnavigation.org/)

## Project Status

- [x] Project scaffolded
- [x] Dependencies installed
- [x] Project verified
- [ ] Core game logic implemented
- [ ] UI components created
- [ ] Testing setup configured
