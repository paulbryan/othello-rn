/**
 * Game constants
 */

import { Direction } from '@/types/game'

export const BOARD_SIZE = 8

// Directions for checking valid moves (8 directions)
export const DIRECTIONS: Direction[] = [
  [-1, -1], // top-left
  [-1, 0], // top
  [-1, 1], // top-right
  [0, -1], // left
  [0, 1], // right
  [1, -1], // bottom-left
  [1, 0], // bottom
  [1, 1], // bottom-right
]

export const COMPUTER_TURN_DELAY = 1000 // 1 second delay for computer move

// Position weights for AI strategy
export const POSITION_WEIGHTS = {
  CORNER: 100,
  EDGE: 20,
  NEAR_CORNER_PENALTY: -50,
}
