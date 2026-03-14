let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;

const cells = document.querySelectorAll(".cell");
const message = document.getElementById("message");

// Load sounds
const xSound = new Audio("x-sound.mp3");
const oSound = new Audio("o-sound.mp3");
const winSound = new Audio("win-sound.mp3");

// Background Music
const bgMusic = document.getElementById("bg-music");
bgMusic.volume = 0.2;
bgMusic.play();

function makeMove(index) {
    if (board[index] === "" && gameActive) {
        board[index] = currentPlayer;
        cells[index].textContent = currentPlayer;
        cells[index].style.color = currentPlayer === "X" ? "#FF5733" : "#3498DB";

        // Play move sound
        currentPlayer === "X" ? xSound.play() : oSound.play();

        checkWinner();
        currentPlayer = currentPlayer === "X" ? "O" : "X";
    }
}

function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],  // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8],  // columns
        [0, 4, 8], [2, 4, 6]              // diagonals
    ];

    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            gameActive = false;
            message.textContent = `${currentPlayer} Wins!`;
            message.classList.add('winner');

            winSound.play();
            showWinnerPopup(`${currentPlayer} Wins!`);
            return;
        }
    }

    if (!board.includes("")) {
        gameActive = false;
        message.textContent = "It's a Draw!";
        message.classList.add('draw');
        showWinnerPopup("It's a Draw!");
    }
}

function showWinnerPopup(text) {
    const popup = document.createElement("div");
    popup.classList.add("popup");
    popup.innerHTML = `<p>${text}</p><button onclick='resetGame()'>New Game</button>`;
    document.body.appendChild(popup);

    winSound.play();
}

function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    currentPlayer = "X";

    cells.forEach(cell => {
        cell.textContent = "";
        cell.style.color = "";
    });

    message.textContent = "Game in Progress";
    message.classList.remove('winner', 'draw');

    const popup = document.querySelector(".popup");
    if (popup) popup.remove();
}
