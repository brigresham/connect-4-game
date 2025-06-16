// Const for the game
const ROWS = 6;
const COLS = 7;
const PLAYER_ONE = 'red';
const PLAYER_TWO = 'yellow';

// the game state
let board = [];
let currentPlayer = PLAYER_ONE;
let gameActive = true;

// Initialize the game
function initGame() {
    board = [];
    for (let r = 0; r < ROWS; r++) {
        let row = [];
        for (let c = 0; c < COLS; c++) {
            row.push(null);
        }
        board.push(row);
    }
    currentPlayer = PLAYER_ONE;
    gameActive = true;
    renderBoard();
    setMessage(`Player ${currentPlayer.toUpperCase()}'s turn`);
}

// Render the board
function renderBoard() {
    const boardDiv = document.getElementById('game-board');
    boardDiv.innerHTML = '';
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            if (board[r][c]) {
                cell.classList.add(board[r][c]);
            }
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.addEventListener('click', handleCellClick);
            boardDiv.appendChild(cell);
        }
    }
}

// Handle cell click
function handleCellClick(e) {
    if (!gameActive) return;
    const col = parseInt(e.target.dataset.col);
    for (let r = ROWS - 1; r >= 0; r--) {
        if (!board[r][col]) {
            board[r][col] = currentPlayer;
            renderBoard();
            if (checkWinner(r, col)) {
                setMessage(`Player ${currentPlayer.toUpperCase()} wins!`);
                gameActive = false;
            } else if (isBoardFull()) {
                setMessage("It's a draw!");
                gameActive = false;
            } else {
                switchPlayer();
                setMessage(`Player ${currentPlayer.toUpperCase()}'s turn`);
            }
            break;
        }
    }
}

// Switch player
function switchPlayer() {
    currentPlayer = currentPlayer === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE;
}

// Check for a winner
function checkWinner(row, col) {
    const directions = [
        { dr: 0, dc: 1 },
        { dr: 1, dc: 0 },
        { dr: 1, dc: 1 },
        { dr: 1, dc: -1 }
    ];
    for (let dir of directions) {
        let count = 1;
        count += countDirection(row, col, dir.dr, dir.dc);
        count += countDirection(row, col, -dir.dr, -dir.dc);
        if (count >= 4) return true;
    }
    return false;
}

// Count the correct direction
function countDirection(row, col, dr, dc) {
    let r = row + dr;
    let c = col + dc;
    let count = 0;
    while (
        r >= 0 && r < ROWS &&
        c >= 0 && c < COLS &&
        board[r][c] === currentPlayer
    ) {
        count++;
        r += dr;
        c += dc;
    }
    return count;
}

// Check if the board is full
function isBoardFull() {
    for (let row of board) {
        if (row.includes(null)) return false;
    }
    return true;
}

// Set message
function setMessage(msg) {
    document.getElementById('message').textContent = msg;
}

// Restart button
document.getElementById('restart-btn').addEventListener('click', initGame);

window.onload = initGame;