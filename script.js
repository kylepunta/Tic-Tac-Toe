const gameBoard = (function () {
    const boardArray = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
    ];
    return { boardArray };
})();

const displayController = (function () {
    const displayBoard = function (boardArray) {
        for (let i = 0; i < boardArray.length; i++){
            for (let j = 0; j < boardArray[i].length; j++){
                console.log(boardArray[i][j]);
            }
        }
    }
    return { displayBoard };
})();

console.log(displayController.displayBoard(gameBoard.boardArray));

function createPlayer (name) {
    const playerName = name;
    return { playerName };
};

const playerOne = createPlayer("Player X");
const playerTwo = createPlayer("Player O");