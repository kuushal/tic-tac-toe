// Board
function GameBoard() {
    const _row = 3;
    const _col = 3;
    const getAllBoxes = document.querySelectorAll('.box');
    const _board = [];

    for (let i = 0; i < _row; i++) {
        _board[i] = [];
        for (let j = 0; j < _col; j++) {
            _board[i].push(Cell());
        }
    }

    const validatePosition = (row, column) => {
        if (row < _row && column < _col && _board[row][column].getValue() === " ")
            return true;
        else
            return false;
    }

    const dropToken = (row, column, player) => {
        if (validatePosition(row, column)) {
            _board[row][column].addToken(player);
        }
    }

    const getBoard = () => _board;


    const printBoard = () => {
        let output = "";
        let k = 0;
        for (let i = 0; i < _board.length; i++) {
            let temp = ""
            for (let j = 0; j < _board[i].length; j++) {
                temp += _board[i][j].getValue() + " ";
                getAllBoxes[k++].textContent = _board[i][j].getValue();
            }
            output += temp;
            output += "\n";
        }
        console.log(output);
    }


    return { getBoard, printBoard, dropToken, validatePosition };
}

// Cell value
function Cell() {
    let value = " ";

    const addToken = (player) => {
        value = player;
    };

    const getValue = () => value;

    return { addToken, getValue };
}

// Controller
function GameController(playerOneName = "Player One", playerTwoName = "Player Two") {
    const board = GameBoard();
    const resultSpan = document.querySelector('.results');
    const getAllBoxes = document.querySelectorAll('.box');
    const playAgainButton = document.querySelector('#play-again');

    const players = [
        {
            name: playerOneName,
            token: "X"
        },
        {
            name: playerTwoName,
            token: "O"
        }
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn`);
        resultSpan.textContent = `${getActivePlayer().name}'s turn`;
    }

    const checkWinner = (token) => {
        const currentBoard = board.getBoard();
        if (
            (currentBoard[0][0].getValue() == token && currentBoard[0][1].getValue() == token && currentBoard[0][2].getValue() == token) ||
            (currentBoard[1][0].getValue() == token && currentBoard[1][1].getValue() == token && currentBoard[1][2].getValue() == token) ||
            (currentBoard[2][0].getValue() == token && currentBoard[2][1].getValue() == token && currentBoard[2][2].getValue() == token) ||
            (currentBoard[0][0].getValue() == token && currentBoard[1][0].getValue() == token && currentBoard[2][0].getValue() == token) ||
            (currentBoard[0][1].getValue() == token && currentBoard[1][1].getValue() == token && currentBoard[2][1].getValue() == token) ||
            (currentBoard[0][2].getValue() == token && currentBoard[1][2].getValue() == token && currentBoard[2][2].getValue() == token) ||
            (currentBoard[0][0].getValue() == token && currentBoard[1][1].getValue() == token && currentBoard[2][2].getValue() == token) ||
            (currentBoard[0][2].getValue() == token && currentBoard[1][1].getValue() == token && currentBoard[2][0].getValue() == token)) {
            return true;
        } else {
            return false;
        }
    }

    const checkTie = () => {
        let isFull = true;
        const currentBoard = board.getBoard();
        for (let i = 0; i < currentBoard.length; i++) {
            for (let j = 0; j < currentBoard[i].length; j++) {
                if (currentBoard[i][j].getValue() === " ") {
                    isFull = false;
                }
            }
        }

        if (((!checkWinner(players[0].token)) && (!checkWinner(players[1].token))) && isFull)
            return true;
        else
            return false;
    }

    const playRound = (row, column) => {
        let isValidPosition = board.validatePosition(row, column);
        console.log(`Dropping ${getActivePlayer().name}'s token: ${getActivePlayer().token} at row: ${row}, column: ${column}`);
        board.dropToken(row, column, getActivePlayer().token);

        if (isValidPosition) {
            switchPlayerTurn();
        }
        printNewRound();
        // check if someone has won or not
        if (checkWinner(players[0].token)) {
            console.log("Player one has won!");
            resultSpan.textContent = "Player one has won!";
            resultSpan.style.color = '#E9E8E8';
            attachEvents();
        } else if (checkWinner(players[1].token)) {
            console.log("Player two has won!");
            resultSpan.textContent = "Player two has won!";
            resultSpan.style.color = '#E9E8E8';
            attachEvents();
        }
        // check if there is tie
        if (checkTie()) {
            console.log("Game is tie!");
            resultSpan.textContent = "Game is tie!";
            attachEvents();
        }
    };

    const attachEvents = () => {
        getAllBoxes.forEach(box => box.addEventListener('click', playRoundOnClickHandler));
        if (resultSpan.textContent.includes('won') || resultSpan.textContent.includes('tie')) {
            getAllBoxes.forEach(box => box.removeEventListener('click', playRoundOnClickHandler));
        }
        playAgainButton.addEventListener('click', playAgainHandler);
    }

    const playRoundOnClickHandler = (e) => {
        let row = Number(e.target.classList[1].charAt(0));
        let col = Number(e.target.classList[1].charAt(1));

        playRound(row, col);
    }

    const playAgainHandler = () => {
        window.location.reload();

    }

    attachEvents();
    printNewRound();

    return { playRound, getActivePlayer };

}

const game = GameController();
