// Game State
let board = []
let currentPlayer = 'black'
let gameMode = 'pvp' // 'pvp' or 'pvc'
let playerColor = 'black' // Player's color in PvC mode
let computerColor = 'white' // Computer's color in PvC mode
let gameActive = true
let lastComputerMove = null // Track the last move made by computer
let blackPlayerName = 'Black'
let whitePlayerName = 'White'
const BOARD_SIZE = 8
const COMPUTER_TURN_DELAY = 1000 // 1 second delay for computer move
// Directions for checking valid moves (8 directions)
const DIRECTIONS = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
]

// Initialize the game
function initGame() {
  board = Array(BOARD_SIZE)
    .fill(null)
    .map(() => Array(BOARD_SIZE).fill(null))

  // Set initial pieces
  const mid = BOARD_SIZE / 2
  board[mid - 1][mid - 1] = 'white'
  board[mid - 1][mid] = 'black'
  board[mid][mid - 1] = 'black'
  board[mid][mid] = 'white'

  currentPlayer = 'black'
  gameActive = true
  lastComputerMove = null // Clear last move highlight on new game

  renderBoard()
  updateScore()
  updateCurrentPlayer()
  
  // If computer plays black, make the first move
  scheduleComputerMoveIfNeeded()
}

// Render the board
function renderBoard() {
  const boardElement = document.getElementById('board')
  boardElement.innerHTML = ''

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const cell = document.createElement('div')
      cell.className = 'cell'
      cell.dataset.row = row
      cell.dataset.col = col

      if (board[row][col]) {
        const disc = document.createElement('div')
        disc.className = `disc ${board[row][col]}`
        cell.appendChild(disc)
      }

      // Highlight the last computer move
      if (
        lastComputerMove &&
        lastComputerMove[0] === row &&
        lastComputerMove[1] === col
      ) {
        cell.classList.add('last-move')
      }

      // Show valid moves for current player
      if (gameActive && isValidMove(row, col, currentPlayer)) {
        cell.classList.add('valid-move')
      }

      cell.addEventListener('click', () => handleCellClick(row, col))
      boardElement.appendChild(cell)
    }
  }
}

// Handle cell click
function handleCellClick(row, col) {
  if (!gameActive) return
  if (gameMode === 'pvc' && currentPlayer === computerColor) return // Computer's turn

  // Clear the last computer move highlight when player makes a move
  lastComputerMove = null

  if (makeMove(row, col, currentPlayer)) {
    renderBoard()
    updateScore()

    if (!checkGameOver()) {
      switchPlayer()
    }
  }
}

// Make a move
function makeMove(row, col, player) {
  if (!isValidMove(row, col, player)) {
    return false
  }

  board[row][col] = player
  flipDiscs(row, col, player)

  return true
}

// Check if a move is valid
function isValidMove(row, col, player) {
  if (board[row][col] !== null) return false

  const opponent = player === 'black' ? 'white' : 'black'

  for (const [dx, dy] of DIRECTIONS) {
    let x = row + dx
    let y = col + dy
    let hasOpponent = false

    while (x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE) {
      if (board[x][y] === null) break
      if (board[x][y] === opponent) {
        hasOpponent = true
      } else if (board[x][y] === player) {
        if (hasOpponent) return true
        break
      }
      x += dx
      y += dy
    }
  }

  return false
}

// Flip discs after a valid move
function flipDiscs(row, col, player) {
  const opponent = player === 'black' ? 'white' : 'black'

  for (const [dx, dy] of DIRECTIONS) {
    let x = row + dx
    let y = col + dy
    const toFlip = []

    while (x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE) {
      if (board[x][y] === null) break
      if (board[x][y] === opponent) {
        toFlip.push([x, y])
      } else if (board[x][y] === player) {
        toFlip.forEach(([fx, fy]) => {
          board[fx][fy] = player
        })
        break
      }
      x += dx
      y += dy
    }
  }
}

// Get all valid moves for a player
function getValidMoves(player) {
  const validMoves = []
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (isValidMove(row, col, player)) {
        validMoves.push([row, col])
      }
    }
  }
  return validMoves
}

// Schedule computer move if needed
function scheduleComputerMoveIfNeeded() {
  if (gameMode === 'pvc' && currentPlayer === computerColor) {
    setTimeout(makeComputerMove, COMPUTER_TURN_DELAY)
  }
}

// Switch player
function switchPlayer() {
  const opponent = currentPlayer === 'black' ? 'white' : 'black'

  // Check if opponent has valid moves
  if (getValidMoves(opponent).length > 0) {
    currentPlayer = opponent
    updateCurrentPlayer()
    renderBoard()
    scheduleComputerMoveIfNeeded()
  } else if (getValidMoves(currentPlayer).length > 0) {
    // Current player plays again
    updateCurrentPlayer()
    renderBoard()
    scheduleComputerMoveIfNeeded()
  } else {
    // No valid moves for either player - game over
    endGame()
  }
}

// Computer AI move (simple strategy)
function makeComputerMove() {
  if (!gameActive) return

  const validMoves = getValidMoves(computerColor)
  if (validMoves.length === 0) {
    switchPlayer()
    return
  }

  // Strategy: prefer corners, edges, then maximize flips
  let bestMove = null
  let bestScore = -Infinity

  for (const [row, col] of validMoves) {
    let score = evaluateMove(row, col, computerColor)

    // Prioritize corners
    if (
      (row === 0 || row === BOARD_SIZE - 1) &&
      (col === 0 || col === BOARD_SIZE - 1)
    ) {
      score += 100
    }
    // Prioritize edges
    else if (
      row === 0 ||
      row === BOARD_SIZE - 1 ||
      col === 0 ||
      col === BOARD_SIZE - 1
    ) {
      score += 20
    }
    // Avoid cells next to corners if corner is empty
    else if (isNextToEmptyCorner(row, col)) {
      score -= 50
    }

    if (score > bestScore) {
      bestScore = score
      bestMove = [row, col]
    }
  }

  if (bestMove) {
    // Store the computer's move position to highlight it
    lastComputerMove = bestMove

    makeMove(bestMove[0], bestMove[1], computerColor)
    renderBoard()
    updateScore()

    if (!checkGameOver()) {
      switchPlayer()
    }
  }
}

// Evaluate a move by counting how many discs would be flipped
function evaluateMove(row, col, player) {
  const opponent = player === 'black' ? 'white' : 'black'
  let flips = 0

  for (const [dx, dy] of DIRECTIONS) {
    let x = row + dx
    let y = col + dy
    let tempFlips = 0

    while (x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE) {
      if (board[x][y] === null) break
      if (board[x][y] === opponent) {
        tempFlips++
      } else if (board[x][y] === player) {
        flips += tempFlips
        break
      }
      x += dx
      y += dy
    }
  }

  return flips
}

// Check if position is next to an empty corner
function isNextToEmptyCorner(row, col) {
  const corners = [
    {
      corner: [0, 0],
      adjacent: [
        [0, 1],
        [1, 0],
        [1, 1],
      ],
    },
    {
      corner: [0, BOARD_SIZE - 1],
      adjacent: [
        [0, BOARD_SIZE - 2],
        [1, BOARD_SIZE - 1],
        [1, BOARD_SIZE - 2],
      ],
    },
    {
      corner: [BOARD_SIZE - 1, 0],
      adjacent: [
        [BOARD_SIZE - 2, 0],
        [BOARD_SIZE - 1, 1],
        [BOARD_SIZE - 2, 1],
      ],
    },
    {
      corner: [BOARD_SIZE - 1, BOARD_SIZE - 1],
      adjacent: [
        [BOARD_SIZE - 2, BOARD_SIZE - 1],
        [BOARD_SIZE - 1, BOARD_SIZE - 2],
        [BOARD_SIZE - 2, BOARD_SIZE - 2],
      ],
    },
  ]

  for (const { corner, adjacent } of corners) {
    if (board[corner[0]][corner[1]] === null) {
      for (const [ax, ay] of adjacent) {
        if (row === ax && col === ay) {
          return true
        }
      }
    }
  }

  return false
}

// Update score display
function updateScore() {
  let blackCount = 0
  let whiteCount = 0

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col] === 'black') blackCount++
      if (board[row][col] === 'white') whiteCount++
    }
  }

  document.getElementById('blackScore').textContent = blackCount
  document.getElementById('whiteScore').textContent = whiteCount
}

// Update current player display
function updateCurrentPlayer() {
  let playerName
  if (gameMode === 'pvc') {
    if (currentPlayer === computerColor) {
      playerName = `Computer (${computerColor === 'black' ? 'Black' : 'White'})`
    } else {
      playerName = currentPlayer === 'black' ? blackPlayerName : whitePlayerName
    }
  } else {
    playerName = currentPlayer === 'black' ? blackPlayerName : whitePlayerName
  }
  document.getElementById('currentPlayer').textContent = `${playerName}'s Turn`
}

// Check if game is over
function checkGameOver() {
  const blackMoves = getValidMoves('black').length
  const whiteMoves = getValidMoves('white').length

  if (blackMoves === 0 && whiteMoves === 0) {
    endGame()
    return true
  }

  // Check if board is full
  let emptyCells = 0
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col] === null) emptyCells++
    }
  }

  if (emptyCells === 0) {
    endGame()
    return true
  }

  return false
}

// Celebrate player win with confetti
function celebrateWin() {
  const canvas = document.getElementById('confetti-canvas')
  if (!canvas) return
  
  canvas.style.display = 'block'
  const ctx = canvas.getContext('2d')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  
  const confettiPieces = []
  const confettiCount = 150
  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#ffd93d', '#6bcf7f', '#c44569', '#5f27cd']
  
  // Create confetti pieces
  for (let i = 0; i < confettiCount; i++) {
    confettiPieces.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      width: Math.random() * 10 + 5,
      height: Math.random() * 10 + 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: Math.random() * 10 - 5,
      velocityX: Math.random() * 4 - 2,
      velocityY: Math.random() * 3 + 2,
      gravity: 0.2
    })
  }
  
  function updateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    let stillActive = false
    
    confettiPieces.forEach(piece => {
      // Update position
      piece.x += piece.velocityX
      piece.y += piece.velocityY
      piece.velocityY += piece.gravity
      piece.rotation += piece.rotationSpeed
      
      // Check if still on screen
      if (piece.y < canvas.height + 50) {
        stillActive = true
      }
      
      // Draw confetti
      ctx.save()
      ctx.translate(piece.x, piece.y)
      ctx.rotate((piece.rotation * Math.PI) / 180)
      ctx.fillStyle = piece.color
      ctx.fillRect(-piece.width / 2, -piece.height / 2, piece.width, piece.height)
      ctx.restore()
    })
    
    if (stillActive) {
      requestAnimationFrame(updateConfetti)
    } else {
      // Hide canvas after animation completes
      setTimeout(() => {
        canvas.style.display = 'none'
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }, 500)
    }
  }
  
  updateConfetti()
}

// End the game
function endGame() {
  gameActive = false

  const blackScore = parseInt(document.getElementById('blackScore').textContent)
  const whiteScore = parseInt(document.getElementById('whiteScore').textContent)

  let message
  let winner = null
  let blackName = gameMode === 'pvc' && computerColor === 'black' ? 'Computer' : blackPlayerName
  let whiteName = gameMode === 'pvc' && computerColor === 'white' ? 'Computer' : whitePlayerName
  
  if (blackScore > whiteScore) {
    message = `${blackName} wins! ${blackScore} - ${whiteScore}`
    winner = 'black'
  } else if (whiteScore > blackScore) {
    message = `${whiteName} wins! ${whiteScore} - ${blackScore}`
    winner = 'white'
  } else {
    message = `It's a tie! ${blackScore} - ${whiteScore}`
    winner = 'tie'
  }

  // Save to leaderboard
  saveGameResult(blackName, whiteName, blackScore, whiteScore, winner)

  // Show confetti if player wins against computer
  if (gameMode === 'pvc' && winner !== 'tie') {
    const playerWon = (winner === 'black' && computerColor !== 'black') || 
                     (winner === 'white' && computerColor !== 'white')
    if (playerWon) {
      celebrateWin()
    }
  }

  document.getElementById('gameOverTitle').textContent = 'Game Over!'
  document.getElementById('gameOverMessage').textContent = message
  document.getElementById('gameOver').classList.remove('hidden')
}

// Theme toggle
function toggleTheme() {
  document.body.classList.toggle('dark-mode')
  localStorage.setItem(
    'theme',
    document.body.classList.contains('dark-mode') ? 'dark' : 'light'
  )
}

// Load saved theme
function loadTheme() {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode')
  }
}

// Apply custom colors
function applyColors() {
  const boardColor = document.getElementById('boardColor').value
  const blackPieceColor = document.getElementById('blackPieceColor').value
  const whitePieceColor = document.getElementById('whitePieceColor').value

  document.documentElement.style.setProperty('--board-color', boardColor)
  document.documentElement.style.setProperty('--black-piece', blackPieceColor)
  document.documentElement.style.setProperty('--white-piece', whitePieceColor)

  // Save to localStorage
  localStorage.setItem('boardColor', boardColor)
  localStorage.setItem('blackPieceColor', blackPieceColor)
  localStorage.setItem('whitePieceColor', whitePieceColor)

  renderBoard()
}

// Load saved colors
function loadColors() {
  const savedBoardColor = localStorage.getItem('boardColor')
  const savedBlackColor = localStorage.getItem('blackPieceColor')
  const savedWhiteColor = localStorage.getItem('whitePieceColor')

  if (savedBoardColor) {
    document.documentElement.style.setProperty('--board-color', savedBoardColor)
    document.getElementById('boardColor').value = savedBoardColor
  }
  if (savedBlackColor) {
    document.documentElement.style.setProperty('--black-piece', savedBlackColor)
    document.getElementById('blackPieceColor').value = savedBlackColor
  }
  if (savedWhiteColor) {
    document.documentElement.style.setProperty('--white-piece', savedWhiteColor)
    document.getElementById('whitePieceColor').value = savedWhiteColor
  }
}

// Update color selection visibility based on game mode
function updateColorSelectionVisibility() {
  const colorSelection = document.getElementById('colorSelection')
  const playerNames = document.getElementById('playerNames')
  
  if (gameMode === 'pvc') {
    colorSelection.classList.remove('hidden')
    playerNames.classList.add('hidden')
  } else {
    colorSelection.classList.add('hidden')
    playerNames.classList.remove('hidden')
  }
}

// Load saved player color preference
function loadPlayerColor() {
  const savedPlayerColor = localStorage.getItem('playerColor')
  if (savedPlayerColor) {
    playerColor = savedPlayerColor
    computerColor = playerColor === 'black' ? 'white' : 'black'
    const radio = document.querySelector(`input[name="playerColor"][value="${playerColor}"]`)
    if (radio) radio.checked = true
  }
}

// Save player color preference
function savePlayerColor() {
  localStorage.setItem('playerColor', playerColor)
}

// Leaderboard functions
function saveGameResult(blackName, whiteName, blackScore, whiteScore, winner) {
  try {
    const history = getGameHistory()
    const gameResult = {
      blackPlayer: blackName,
      whitePlayer: whiteName,
      blackScore: blackScore,
      whiteScore: whiteScore,
      winner: winner,
      date: new Date().toISOString(),
      gameMode: gameMode
    }
    
    history.unshift(gameResult) // Add to beginning
    
    // Keep only the last 50 games
    if (history.length > 50) {
      history.splice(50)
    }
    
    localStorage.setItem('othelloHistory', JSON.stringify(history))
  } catch (e) {
    console.error('Failed to save game result:', e)
  }
}

function getGameHistory() {
  try {
    const historyStr = localStorage.getItem('othelloHistory')
    return historyStr ? JSON.parse(historyStr) : []
  } catch (e) {
    console.error('Failed to load game history:', e)
    return []
  }
}

function clearGameHistory() {
  localStorage.removeItem('othelloHistory')
  displayLeaderboard()
}

function displayLeaderboard() {
  const history = getGameHistory()
  const listElement = document.getElementById('leaderboardList')
  
  if (history.length === 0) {
    listElement.innerHTML = '<div class="leaderboard-empty">No games played yet. Start playing to build your history!</div>'
    return
  }
  
  // Clear existing content
  listElement.innerHTML = ''
  
  history.forEach(game => {
    const date = new Date(game.date)
    const dateStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})
    
    let winnerClass = ''
    let resultText = ''
    
    if (game.winner === 'black') {
      winnerClass = 'winner-black'
      resultText = `${escapeHtml(game.blackPlayer)} won`
    } else if (game.winner === 'white') {
      winnerClass = 'winner-white'
      resultText = `${escapeHtml(game.whitePlayer)} won`
    } else {
      winnerClass = 'tie'
      resultText = 'Tie game'
    }
    
    const item = document.createElement('div')
    item.className = `leaderboard-item ${winnerClass}`
    
    const header = document.createElement('div')
    header.className = 'leaderboard-header'
    const players = document.createElement('span')
    players.className = 'leaderboard-players'
    players.textContent = resultText
    header.appendChild(players)
    
    const scoreDiv = document.createElement('div')
    scoreDiv.className = 'leaderboard-score'
    const blackScore = document.createElement('span')
    blackScore.textContent = `⚫ ${game.blackPlayer}: ${game.blackScore}`
    const whiteScore = document.createElement('span')
    whiteScore.textContent = `⚪ ${game.whitePlayer}: ${game.whiteScore}`
    scoreDiv.appendChild(blackScore)
    scoreDiv.appendChild(whiteScore)
    
    const dateDiv = document.createElement('div')
    dateDiv.className = 'leaderboard-date'
    dateDiv.textContent = dateStr
    
    item.appendChild(header)
    item.appendChild(scoreDiv)
    item.appendChild(dateDiv)
    listElement.appendChild(item)
  })
}

// Helper function to escape HTML
function escapeHtml(text) {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

// Update player names from inputs
function updatePlayerNames() {
  const blackInput = document.getElementById('blackPlayerName').value.trim()
  const whiteInput = document.getElementById('whitePlayerName').value.trim()
  
  blackPlayerName = blackInput || 'Black'
  whitePlayerName = whiteInput || 'White'
  
  // Save to localStorage
  try {
    localStorage.setItem('blackPlayerName', blackPlayerName)
    localStorage.setItem('whitePlayerName', whitePlayerName)
  } catch (e) {
    console.error('Failed to save player names:', e)
  }
}

// Load player names from localStorage
function loadPlayerNames() {
  const savedBlackName = localStorage.getItem('blackPlayerName')
  const savedWhiteName = localStorage.getItem('whitePlayerName')
  
  if (savedBlackName) {
    blackPlayerName = savedBlackName
    document.getElementById('blackPlayerName').value = savedBlackName
  }
  
  if (savedWhiteName) {
    whitePlayerName = savedWhiteName
    document.getElementById('whitePlayerName').value = savedWhiteName
  }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  loadTheme()
  loadColors()
  loadPlayerColor()
  loadPlayerNames()
  
  // Initialize game mode from the checked radio button
  gameMode = document.querySelector('input[name="gameMode"]:checked').value
  updateColorSelectionVisibility()
  initGame()

  document.getElementById('newGame').addEventListener('click', () => {
    gameMode = document.querySelector('input[name="gameMode"]:checked').value
    if (gameMode === 'pvc') {
      playerColor = document.querySelector('input[name="playerColor"]:checked').value
      computerColor = playerColor === 'black' ? 'white' : 'black'
      savePlayerColor()
    } else {
      updatePlayerNames()
    }
    initGame()
    document.getElementById('gameOver').classList.add('hidden')
  })

  document.getElementById('playAgain').addEventListener('click', () => {
    gameMode = document.querySelector('input[name="gameMode"]:checked').value
    if (gameMode === 'pvc') {
      playerColor = document.querySelector('input[name="playerColor"]:checked').value
      computerColor = playerColor === 'black' ? 'white' : 'black'
      savePlayerColor()
    } else {
      updatePlayerNames()
    }
    initGame()
    document.getElementById('gameOver').classList.add('hidden')
  })

  document.getElementById('themeToggle').addEventListener('click', toggleTheme)

  document.getElementById('colorSettings').addEventListener('click', () => {
    document.getElementById('colorModal').classList.remove('hidden')
  })

  document.getElementById('applyColors').addEventListener('click', () => {
    applyColors()
    document.getElementById('colorModal').classList.add('hidden')
  })

  document.getElementById('closeModal').addEventListener('click', () => {
    document.getElementById('colorModal').classList.add('hidden')
  })

  document.querySelectorAll('input[name="gameMode"]').forEach((radio) => {
    radio.addEventListener('change', () => {
      gameMode = radio.value
      updateColorSelectionVisibility()
    })
  })

  document.querySelectorAll('input[name="playerColor"]').forEach((radio) => {
    radio.addEventListener('change', () => {
      playerColor = radio.value
      computerColor = playerColor === 'black' ? 'white' : 'black'
      savePlayerColor()
    })
  })

  // Leaderboard button
  document.getElementById('leaderboardBtn').addEventListener('click', () => {
    displayLeaderboard()
    document.getElementById('leaderboardModal').classList.remove('hidden')
  })

  // Close leaderboard
  document.getElementById('closeLeaderboard').addEventListener('click', () => {
    document.getElementById('leaderboardModal').classList.add('hidden')
  })

  // Clear history
  document.getElementById('clearHistory').addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all game history? This cannot be undone.')) {
      clearGameHistory()
    }
  })

  // Update player names on input change
  document.getElementById('blackPlayerName').addEventListener('input', updatePlayerNames)
  document.getElementById('whitePlayerName').addEventListener('input', updatePlayerNames)
})
