// Name: Kyle Purcell

const createGameBoard = (function(){
        const board = document.querySelector('.board');
        for (let i = 0; i < 3; i++){
                for (let j = 0; j < 3; j++){
                        const square = document.createElement('div');
                        square.classList.add('square');
                        square.setAttribute('data-row-index', i);
                        square.setAttribute('data-column-index', j);
                        board.appendChild(square);        
                };
        }
})();

function createPlayer(playerName, playerLetter){
        const name = playerName;
        const letter = playerLetter;
        let score = 0;
        return { name, letter, score };
};

const gameLogic = (function() {
        const boardArray = [
                [null, null, null],
                [null, null, null],
                [null, null, null],
        ];
        let isEmpty = true;
        let win = false;
        let tie = false;
        let currentLetter = "X";
        let turn = 1;

        function checkEmpty(rowIndex, columnIndex){
                isEmpty = true;
                if (boardArray[rowIndex][columnIndex] != null){
                        isEmpty = false;
                }
                return isEmpty;
        };

        function checkWin(){
                // Row Check
                for (let i = 0; i < boardArray.length; i++){
                        if (boardArray[i][0] != null && boardArray[i][0] === boardArray[i][1] && boardArray[i][0] === boardArray[i][2]){
                                win = true;
                        }
                }
                // Column check
                for (let i = 0; i < boardArray.length; i++){
                        if (boardArray[0][i] != null && boardArray[0][i] === boardArray[1][i] && boardArray[0][i] === boardArray[2][i]){
                                win = true;
                        }
                }
                // Main diagonal check
                if (boardArray[0][0] != null && boardArray[0][0] === boardArray[1][1] && boardArray[0][0] === boardArray[2][2]){
                        win = true;
                }
                // Anti diagonal check
                if (boardArray[0][2] != null && boardArray[0][2] === boardArray[1][1] && boardArray[0][2] === boardArray[2][0]){
                        win = true;
                }
                return win;
        };

        function checkTie(){
                if (!win && turn > 9){
                        tie = true;
                };
                return tie;
        };

        function insertLetter(rowIndex, colIndex, square){
                boardArray[rowIndex][colIndex] = currentLetter;
                square.textContent = currentLetter;
                currentLetter = currentLetter === "X" ? "O" : "X";
                turn++;
        };

        function resetGameLogic(){
                for (let i = 0; i < boardArray.length; i++){
                        for (let j = 0; j < boardArray[i].length; j++){
                                boardArray[i][j] = null;
                        }
                }
                const squares = document.querySelectorAll('.square');
                for (const square of squares) {
                        square.textContent = '';
                }
                const markerOne = document.querySelector('.player-one-turn');
                const markerTwo = document.querySelector('.player-two-turn');        
                if (gameLogic.getCurrentLetter() === "O"){
                        markerTwo.classList.remove('current-turn');
                        markerOne.classList.add('current-turn');
                }
                isEmpty = true;
                win = false;
                tie = false;
                currentLetter = "X";
                turn = 1;
        };

        function getCurrentLetter(){
                return currentLetter;
        };
        return {checkEmpty, checkWin, checkTie, insertLetter, resetGameLogic, getCurrentLetter}
})();

const gameController = (function(){
        function startGame(){
                displayController.init();
                const markerOne = document.querySelector('.player-one-turn');
                markerOne.classList.add('current-turn');
        };
        function resetGame(){
                displayController.init();
                gameLogic.resetGameLogic();
        };
        return {startGame, resetGame};
})();

const displayController = (function(){
        const startGameContainer = document.querySelector('.start-game');
        const squares = document.querySelectorAll('.square');
        const callBack = (e) => {
                handleClick(e.target);
        };
        function init() {
                for (const square of squares) {
                        square.addEventListener('click', callBack);
                }
        };
        function disableBoard(){
                for (const square of squares) {
                        square.removeEventListener('click', callBack);
                }
        };

        function handleClick(square){
                const rowIndex = parseInt(square.getAttribute('data-row-index'));
                const colIndex = parseInt(square.getAttribute('data-column-index'));
                const markerOne = document.querySelector('.player-one-turn');
                const markerTwo = document.querySelector('.player-two-turn');
                const playerOneScore = document.querySelector('.player-one-score');
                const playerTwoScore = document.querySelector('.player-two-score');

                if (gameLogic.checkEmpty(rowIndex, colIndex)){
                        gameLogic.insertLetter(rowIndex, colIndex, square);
                        if (gameLogic.checkWin()){
                                console.log("Win!");
                                disableBoard();
                                const resultDisplay = document.createElement('h2');
                                resultDisplay.classList.add('win-display');
                                if (gameLogic.getCurrentLetter() === "O"){
                                        resultDisplay.textContent = "Player X wins!";
                                        playerOne.score++;
                                        playerOneScore.textContent = playerOne.score;
                                }
                                else {
                                        resultDisplay.textContent = "Player O wins!";
                                        playerTwo.score++;
                                        playerTwoScore.textContent = playerTwo.score;
                                }
                                startGameContainer.appendChild(resultDisplay);

                                const playAgainBtn = document.createElement('button');
                                playAgainBtn.classList.add('play-again-button');
                                playAgainBtn.textContent = "Play Again";
                                playAgainBtn.addEventListener('click', (event) => {
                                        event.preventDefault();
                                        startGameContainer.innerHTML = '';
                                        gameController.resetGame();
                                });
                                startGameContainer.appendChild(playAgainBtn);
                        }
                        else if (gameLogic.checkTie()){
                                console.log("Tie!");
                                const resultDisplay = document.createElement('h2');
                                resultDisplay.classList.add('result-display');
                                resultDisplay.textContent = "It's a tie!";
                                startGameContainer.appendChild(resultDisplay);

                                const playAgainBtn = document.createElement('button');
                                playAgainBtn.classList.add('play-again-button');
                                playAgainBtn.textContent = "Play Again";
                                playAgainBtn.addEventListener('click', (event) => {
                                        event.preventDefault();
                                        startGameContainer.innerHTML = '';
                                        gameController.resetGame();
                                });
                                startGameContainer.appendChild(playAgainBtn);
                        }
                        if (gameLogic.getCurrentLetter() === "X"){
                                markerOne.classList.add('current-turn');
                                markerTwo.classList.remove('current-turn');
                        }
                        else if (gameLogic.getCurrentLetter() === "O"){
                                markerOne.classList.remove('current-turn');
                                markerTwo.classList.add('current-turn');
                        }
                }
        };
        const playerOneBtn = document.querySelector('.player-one-button');
        const playerTwoBtn = document.querySelector('.player-two-button');
        const startGameBtn = document.querySelector('.start-game-button');

        playerOneBtn.addEventListener('click', function(event){
                event.preventDefault();
                const playerOneName = document.getElementById('player-one-name').value;
                playerOne = createPlayer(playerOneName, "X");

                const playerOneContainer = document.querySelector('.player-one');
                playerOneContainer.innerHTML = '';
                const nameHeading = document.createElement('h3');
                const letterHeading = document.createElement('h3');
                nameHeading.classList.add('name-heading');
                letterHeading.classList.add('letter-heading');
                nameHeading.textContent = "Name:";
                letterHeading.textContent = "Letter:";
                const name = document.createElement('p');
                name.classList.add('player-one-name');
                name.textContent = `${playerOneName}`;
                const letter = document.createElement('p');
                letter.classList.add('player-one-letter');
                letter.textContent = "X";
                playerOneContainer.appendChild(nameHeading);
                playerOneContainer.appendChild(name);
                playerOneContainer.appendChild(letterHeading);
                playerOneContainer.appendChild(letter);
                playerOneContainer.classList.remove('player-one');
                playerOneContainer.classList.add('new-player-one');

                const turnHeading = document.createElement('h3');
                turnHeading.classList.add('turn-heading');
                turnHeading.textContent = "Move:";
                const playerOneTurn = document.createElement('div');
                playerOneTurn.classList.add('player-one-turn');
                playerOneContainer.appendChild(turnHeading);
                playerOneContainer.appendChild(playerOneTurn);

                const scoreHeading = document.createElement('h3');
                scoreHeading.classList.add('score-heading');
                scoreHeading.textContent = "Score:";
                const score = document.createElement('p');
                score.classList.add('player-one-score');
                score.textContent = "0";
                playerOneContainer.appendChild(scoreHeading);
                playerOneContainer.appendChild(score);
        });
        playerTwoBtn.addEventListener('click', function(event){
                event.preventDefault();
                const playerTwoName = document.getElementById('player-two-name').value;
                playerTwo = createPlayer(playerTwoName, "O");

                const playerTwoContainer = document.querySelector('.player-two');
                playerTwoContainer.innerHTML = '';
                const nameHeading = document.createElement('h3');
                const letterHeading = document.createElement('h3');
                nameHeading.classList.add('name-heading');
                letterHeading.classList.add('letter-heading');
                nameHeading.textContent = "Name:";
                letterHeading.textContent = "Letter:";
                const name = document.createElement('p');
                name.classList.add('player-two-name');
                name.textContent = `${playerTwoName}`;
                const letter = document.createElement('p');
                letter.classList.add('player-two-letter');
                letter.textContent = "O";
                playerTwoContainer.appendChild(nameHeading);
                playerTwoContainer.appendChild(name);
                playerTwoContainer.appendChild(letterHeading);
                playerTwoContainer.appendChild(letter);
                playerTwoContainer.classList.remove('player-two');
                playerTwoContainer.classList.add('new-player-two');

                const turnHeading = document.createElement('h3');
                turnHeading.classList.add('turn-heading');
                turnHeading.textContent = "Move:";
                const playerTwoTurn = document.createElement('div');
                playerTwoTurn.classList.add('player-two-turn');
                playerTwoContainer.appendChild(turnHeading);
                playerTwoContainer.appendChild(playerTwoTurn);

                const scoreHeading = document.createElement('h3');
                scoreHeading.classList.add('score-heading');
                scoreHeading.textContent = "Score:";
                const score = document.createElement('p');
                score.classList.add('player-two-score');
                score.textContent = "0";
                playerTwoContainer.appendChild(scoreHeading);
                playerTwoContainer.appendChild(score);
        });
        startGameBtn.addEventListener('click', (event) => {
                event.preventDefault();
                gameController.startGame();
                startGameContainer.innerHTML = '';
        });    
        return {init, handleClick, disableBoard}; 
})();

let playerOne;
let playerTwo;