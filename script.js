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
        return { playerName, playerLetter, score: 0 };
};

const gameState = {
        board: [
                [null, null, null],
                [null, null, null],
                [null ,null ,null],
        ],
        currentLetter: 'X',
        turn: 1,
        win: false,
        tie: false,
        players: {
                playerOne: null,
                playerTwo: null
        }
};

function resetGameState(){
        gameState.board = [
                [null, null, null],
                [null, null, null],
                [null, null, null]
        ];
        gameState.currentLetter = 'X';
        gameState.turn = 1;
        gameState.win = false;
        gameState.tie = false;
};

const gameLogic = (function() {
        function checkEmpty(rowIndex, colIndex){
                return gameState.board[rowIndex][colIndex] == null;
        };

        function checkThreeEqual(a, b, c){
                return a != null && a === b && a === c;
        };

        function checkWin(){
                // Row Check
                for (let i = 0; i < gameState.board.length; i++){
                        if (checkThreeEqual(gameState.board[i][0], gameState.board[i][1], gameState.board[i][2])){
                                gameState.win = true;
                        }
                }
                // Column check
                for (let i = 0; i < gameState.board.length; i++){
                        if (checkThreeEqual(gameState.board[0][i], gameState.board[1][i], gameState.board[2][i])){
                                gameState.win = true;
                        }
                }
                // Main diagonal check
                if (checkThreeEqual(gameState.board[0][0], gameState.board[1][1], gameState.board[2][2])){
                        gameState.win = true;
                }
                // Anti diagonal check
                if (checkThreeEqual(gameState.board[0][2], gameState.board[1][1], gameState.board[2][0])){
                        gameState.win = true;
                }
                return gameState.win;
        };

        function checkTie(){
                if (!gameState.win && gameState.turn > 9){
                        gameState.tie = true;
                };
                return gameState.tie;
        };

        function insertLetter(rowIndex, colIndex, square){
                gameState.board[rowIndex][colIndex] = gameState.currentLetter;
                square.textContent = gameState.currentLetter;
                gameState.currentLetter = gameState.currentLetter === "X" ? "O" : "X";
                gameState.turn++;
        };

        function getCurrentLetter(){
                return gameState.currentLetter;
        };
        return {checkEmpty, checkWin, checkTie, insertLetter, getCurrentLetter}
})();

const gameController = (function(){
        let playerOne;
        let playerTwo;
        
        function startGame(){
                displayController.init();
                gameState.players.playerOne = playerOne;
                gameState.players.playerTwo = playerTwo;
                const markerOne = document.querySelector('.player-one-turn');
                markerOne.classList.add('current-turn');
        };
        function resetGame(){
                displayController.init();
                resetGameState();
                displayController.resetUI();
                displayController.resetMarkers();
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

        function resetUI(){
                squares.forEach((square) => square.textContent = '');
                startGameContainer.innerHTML = '';
        };

        function resetMarkers(){
                const markerOne = document.querySelector('.player-one-turn');
                const markerTwo = document.querySelector('.player-two-turn');        
                if (gameLogic.getCurrentLetter() === "O"){
                        markerTwo.classList.remove('current-turn');
                        markerOne.classList.add('current-turn');
                }
        };

        function displayResult(message){
                disableBoard();
                const resultDisplay = document.createElement('h2');
                resultDisplay.classList.add('win-display');
                resultDisplay.textContent = message;
                startGameContainer.appendChild(resultDisplay);

                const playAgainBtn = document.createElement('button');
                playAgainBtn.classList.add('play-again-button');
                playAgainBtn.textContent = "Play Again";
                playAgainBtn.addEventListener('click', (event) => {
                        event.preventDefault();
                        gameController.resetGame();
                });
                startGameContainer.appendChild(playAgainBtn);
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
                                displayResult(`Player ${gameState.currentLetter === 'X' ? 'O' : 'X'} wins!`);
                                if (gameLogic.getCurrentLetter() === 'O'){
                                        gameController.playerOne.score++;
                                        playerOneScore.textContent = gameController.playerOne.score;
                                }
                                else {
                                        gameController.playerTwo.score++;
                                        playerTwoScore.textContent = gameController.playerTwo.score;
                                }
                        }
                        else if (gameLogic.checkTie()){
                                displayResult("It's a tie!");
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
                gameController.playerOne = createPlayer(playerOneName, "X");

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
                gameController.playerTwo = createPlayer(playerTwoName, "O");

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
        return {init, handleClick, disableBoard, displayResult, resetUI, resetMarkers}; 
})();