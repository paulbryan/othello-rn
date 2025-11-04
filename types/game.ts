/**
 * Type definitions for Othello game
 */

export type PlayerColor = 'black' | 'white'
export type CellValue = PlayerColor | null
export type Board = CellValue[][]

export type GameMode = 'pvp' | 'pvc' // Player vs Player or Player vs Computer

export type Direction = [number, number]

export interface Position {
  row: number
  col: number
}

export interface GameScore {
  black: number
  white: number
}

export interface GameState {
  board: Board
  currentPlayer: PlayerColor
  gameMode: GameMode
  playerColor: PlayerColor // Player's color in PvC mode
  computerColor: PlayerColor // Computer's color in PvC mode
  gameActive: boolean
  lastComputerMove: Position | null
  blackPlayerName: string
  whitePlayerName: string
  score: GameScore
}

export interface GameResult {
  blackPlayer: string
  whitePlayer: string
  blackScore: number
  whiteScore: number
  winner: 'black' | 'white' | 'tie'
  date: string
  gameMode: GameMode
}

export interface GameSettings {
  theme: 'light' | 'dark'
  boardColor: string
  blackPieceColor: string
  whitePieceColor: string
  playerColor: PlayerColor
  blackPlayerName: string
  whitePlayerName: string
}

export type GameAction =
  | { type: 'MAKE_MOVE'; row: number; col: number }
  | { type: 'COMPUTER_MOVE'; row: number; col: number }
  | { type: 'SWITCH_PLAYER' }
  | {
      type: 'NEW_GAME'
      mode: GameMode
      playerColor?: PlayerColor
      blackName?: string
      whiteName?: string
    }
  | { type: 'END_GAME' }
  | { type: 'UPDATE_SCORE' }
