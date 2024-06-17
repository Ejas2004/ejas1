const selectBox = document.querySelector(".select-box"),
selectBtnX = selectBox.querySelector(".options .playerX"),
selectBtnO = selectBox.querySelector(".options .playerO"),
playBoard = document.querySelector(".play-board"),
players = document.querySelector(".players"),
allBox = document.querySelectorAll("section span"),
resultBox = document.querySelector(".result-box"),
wonText = resultBox.querySelector(".won-text"),
replayBtn = resultBox.querySelector("button"),
scoreXElement = document.getElementById('scoreX'),
scoreOElement = document.getElementById('scoreO');

let scoreX = 0,
    scoreO = 0;

window.onload = ()=> {
    for (let i = 0; i < allBox.length; i++) {
       allBox[i].setAttribute("onclick", "clickedBox(this)");
    }
}

selectBtnX.onclick = ()=> {
    selectBox.classList.add("hide");
    playBoard.classList.add("show");
}

selectBtnO.onclick = ()=> { 
    selectBox.classList.add("hide");
    playBoard.classList.add("show");
    players.setAttribute("class", "players active player");
}

let playerXIcon = "fas fa-times",
playerOIcon = "far fa-circle",
playerSign = "X",
runBot = true;

function clickedBox(element) {
    if(players.classList.contains("player")) {
        playerSign = "O";
        element.innerHTML = `<i class="${playerOIcon}"></i>`;
        players.classList.remove("active");
        element.setAttribute("id", playerSign);
    } else {
        element.innerHTML = `<i class="${playerXIcon}"></i>`;
        element.setAttribute("id", playerSign);
        players.classList.add("active");
    }
    selectWinner();
    element.style.pointerEvents = "none";
    playBoard.style.pointerEvents = "none";
    let randomTimeDelay = ((Math.random() * 1000) + 200).toFixed();
    setTimeout(()=> {
        bot(runBot);
    }, randomTimeDelay);
}

function bot() {
    if(runBot) {
        let bestMove = findBestMove();
        if(bestMove !== -1) {
            if(players.classList.contains("player")) { 
                playerSign = "X";
                allBox[bestMove].innerHTML = `<i class="${playerXIcon}"></i>`;
                allBox[bestMove].setAttribute("id", playerSign);
                players.classList.add("active");
            } else {
                playerSign = "O";
                allBox[bestMove].innerHTML = `<i class="${playerOIcon}"></i>`;
                players.classList.remove("active");
                allBox[bestMove].setAttribute("id", playerSign);
            }
            selectWinner();
        }
        allBox[bestMove].style.pointerEvents = "none";
        playBoard.style.pointerEvents = "auto";
        playerSign = "X";
    }
}

function getIdVal(classname) {
    return document.querySelector(".box" + classname).id;
}

function checkIdSign(val1, val2, val3, sign) { 
    if(getIdVal(val1) == sign && getIdVal(val2) == sign && getIdVal(val3) == sign) {
        return true;
    }
}

function selectWinner() {
    if(checkIdSign(1,2,3,playerSign) || checkIdSign(4,5,6, playerSign) || checkIdSign(7,8,9, playerSign) || checkIdSign(1,4,7, playerSign) || checkIdSign(2,5,8, playerSign) || checkIdSign(3,6,9, playerSign) || checkIdSign(1,5,9, playerSign) || checkIdSign(3,5,7, playerSign)) {
        runBot = false;
        bot(runBot);
        setTimeout(()=> {
            resultBox.classList.add("show");
            playBoard.classList.remove("show");
        }, 700);
        wonText.innerHTML = `Player <p>${playerSign}</p> won the game!`;
        updateScore(playerSign);
    } else {
        if(getIdVal(1) != "" && getIdVal(2) != "" && getIdVal(3) != "" && getIdVal(4) != "" && getIdVal(5) != "" && getIdVal(6) != "" && getIdVal(7) != "" && getIdVal(8) != "" && getIdVal(9) != "") {
            runBot = false;
            bot(runBot);
            setTimeout(()=> {
                resultBox.classList.add("show");
                playBoard.classList.remove("show");
            }, 700);
            wonText.textContent = "Match has been drawn!";
        }
    }
}

function updateScore(winner) {
    if (winner === "X") {
        scoreX++;
        scoreXElement.textContent = scoreX;
    } else {
        scoreO++;
        scoreOElement.textContent = scoreO;
    }
}

replayBtn.onclick = ()=> {
    playBoard.classList.add("show");
    resultBox.classList.remove("show");
    runBot = true;
    players.classList.remove("active");
    playerSign = "X";
    for (let i = 0; i < allBox.length; i++) {
        allBox[i].innerHTML = "";
        allBox[i].removeAttribute("id");
        allBox[i].style.pointerEvents = "auto";
    }
    playBoard.style.pointerEvents = "auto";
}

// Minimax algorithm implementation
function isMovesLeft() {
    for (let i = 0; i < allBox.length; i++) {
        if (allBox[i].id === "") {
            return true;
        }
    }
    return false;
}

function evaluate(b) {
    for (let row = 0; row < 3; row++) {
        if (b[row * 3] == b[row * 3 + 1] && b[row * 3 + 1] == b[row * 3 + 2]) {
            if (b[row * 3] == "O") return +10;
            else if (b[row * 3] == "X") return -10;
        }
    }

    for (let col = 0; col < 3; col++) {
        if (b[col] == b[col + 3] && b[col + 3] == b[col + 6]) {
            if (b[col] == "O") return +10;
            else if (b[col] == "X") return -10;
        }
    }

    if (b[0] == b[4] && b[4] == b[8]) {
        if (b[0] == "O") return +10;
        else if (b[0] == "X") return -10;
    }

    if (b[2] == b[4] && b[4] == b[6]) {
        if (b[2] == "O") return +10;
        else if (b[2] == "X") return -10;
    }

    return 0;
}

function minimax(board, depth, isMax) {
    let score = evaluate(board);

    if (score == 10) return score;
    if (score == -10) return score;
    if (isMovesLeft() == false) return 0;

    if (isMax) {
        let best = -1000;

        for (let i = 0; i < 9; i++) {
            if (board[i] == "") {
                board[i] = "O";
                best = Math.max(best, minimax(board, depth + 1, !isMax));
                board[i] = "";
            }
        }
        return best;
    } else {
        let best = 1000;

        for (let i = 0; i < 9; i++) {
            if (board[i] == "") {
                board[i] = "X";
                best = Math.min(best, minimax(board, depth + 1, !isMax));
                board[i] = "";
            }
        }
        return best;
    }
}

function findBestMove() {
    let bestVal = -1000;
    let bestMove = -1;

    let board = [];
    for (let i = 0; i < 9; i++) {
        board.push(allBox[i].id);
    }

    for (let i = 0; i < 9; i++) {
        if (board[i] == "") {
            board[i] = "O";
            let moveVal = minimax(board, 0, false);
            board[i] = "";
            if (moveVal > bestVal) {
                bestMove = i;
                bestVal = moveVal;
            }
        }
    }
    return bestMove;
}

