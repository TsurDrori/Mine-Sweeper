// TODO - CSS (check UI guidelines)
// TODO - github
// TODO - first click is never a mine (first click starts game and build cells)
// TODO - bonus features...
'use strict'
const MINE = '💣';
const FLAG = '🏴';
const LIFE = '❤';
const SMILEY = '🙂';
const SADSMILEY = '😖';
const COOLSMILEY = '😎';
var gSmiley;
var start;
var minesToImplement;
var gTimer = null;
var timerInterval;
var gIsVictory = false;
var gBoard;
var gLevel = { SIZE: 12, MINES: 30 };
var gGame = {
    isOn: true,  //when true we let the user play
    openedCount: 0, //How many cells are shown 
    secsPassed: 0, //How many seconds passed
    lives: 3
}

function initGame(size, mines) {
    gSmiley = document.querySelector('.smiley');
    gSmiley.innerHTML = SMILEY;
    gLevel.SIZE = size;
    gLevel.MINES = mines;
    gGame.lives = 3;
    gGame.openedCount = 0;
    gIsVictory = false;
    gGame.isOn = true;
    gTimer = document.querySelector('.time span');
    start = Date.now();
    clearInterval(timerInterval)
    timerInterval = setInterval(checkTimer, 10)
    renderLives(gGame.lives)
    gBoard = buildBoard(gLevel)
    // console.log(gBoard);
    renderBoard(gBoard);
}



// Builds the board ; Set mines at random locations ;Call setMinesNegsCount() ; Return the created board
function buildBoard(gLevel) {
    var mat = [];
    for (var i = 0; i < gLevel.SIZE; i++) {
        mat[i] = [];
        for (var j = 0; j < gLevel.SIZE; j++) {
            var cell = {
                minesAroundCount: 0,
                isOpened: false,
                isMine: false,
                isFlagged: false
            }
            mat[i][j] = cell;
        }
    }
    implementMines(mat);
    mat = setMinesNegsCount(mat);
    return mat
}

// implement mines in gBoard according to gLevel number of mines.
function implementMines(mat) {
    minesToImplement = gLevel.MINES;
    while (minesToImplement > 0) {
        var i = getRandomIntInclusive(0, mat.length -1);
        var j = getRandomIntInclusive(0, mat.length -1);
        if (!mat[i][j].isMine) {
            mat[i][j].isMine = true;
            minesToImplement--;
        }
    }
    return mat
}

// Count mines around each cell and set the cell's minesAroundCount.
function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            for (var a = i - 1; a <= i + 1; a++) {
                if (a < 0 || a >= board.length) continue;
                for (var b = j - 1; b <= j + 1; b++) {
                    if (b < 0 || b >= board[a].length) continue;
                    if (a === i && b === j) continue;
                    if (board[a][b].isMine) board[i][j].minesAroundCount++;
                }
            }
            // console.log(board[i][j].minesAroundCount)
        }
    }
    return board;
}
// render the board; provide cell with dataset with mine or number of mine neighbours; provide onclick button with elcell and cell
function renderBoard(board) {
    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j];
            // console.log(cell);
            var mineOrNum = (cell.isMine) ? 'mine' : cell.minesAroundCount
            strHTML += `<td class="cell cell${i}-${j}" data-i="${i}" data-j="${j}" data-mine="${mineOrNum}" ></td>`
            // onclick="cellClicked(this, ${i}, ${j})"
        }
        strHTML += '</tr>'
    }

    // console.log(strHTML)
    var elTable = document.querySelector('.table');
    elTable.innerHTML = strHTML
    preventContextMenu(elTable); // prevent right mouse click from openeing web browser menu
    mouseClickListener(); // gives a 'onmouseup' listener to each cell
}

function mouseClickListener() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j];
            // console.log(cell);
            var elCell = document.querySelector(`.cell${i}-${j}`);
            if(gGame.isOn) elCell.addEventListener('mouseup', cellClicked);
            else elCell.removeEventListener('mouseup', cellClicked);
        }
    }
}

// cell clicked : get cell info (DOM & model), check left or right buttons; 
function cellClicked(elClick) {
    var clickedElCell = elClick.target;
    var clickedCell = getCellInModel(clickedElCell)
    // console.log('data ', clickedElCell);
    if (elClick.button === 0) leftMouseClick(clickedElCell, clickedCell);
    else if (elClick.button === 2) rightMouseClick(clickedElCell, clickedCell);
}

// left mouse button - get cell position on model, check  if cell was clicked or flagged before, if clicked - return, if falgged - call right mouse click (toggle flag). else, check if mine, show mine, reduce life; if number - act according to number: 0 - open neighbours; 1 - 8 - open only the currCell - show number 
function leftMouseClick(clickedElCell, clickedCell) {
    // console.log('clickedCell: ', clickedCell)
    if (clickedCell.isOpened) return;
    if (clickedCell.isFlagged) rightMouseClick(clickedElCell, clickedCell);
    else if (clickedCell.isMine) {
        showMine(clickedElCell, clickedCell);
        getHit();
    } else if (clickedCell.minesAroundCount) {
        clickedCell.isOpened = true;
        clickedElCell.innerHTML += clickedCell.minesAroundCount;
        clickedElCell.style.backgroundColor = 'rgb(214, 203, 159)';
        gGame.openedCount++
    } else {
        clickedCell.isOpened = true;
        gGame.openedCount++
        clickedElCell.style.backgroundColor = 'rgb(214, 203, 159)';
        openNegs(clickedElCell);
    }
    checkVictory();
}

function showMine(clickedElCell, clickedCell) {
    clickedCell.isOpened = true;
    clickedElCell.innerHTML = MINE;
    clickedElCell.style.backgroundColor = 'rgb(110, 0, 6)';
    clickedElCell.style.color = 'rgb(214, 125, 130)';
}
// when hit reduce health, check if game over
function getHit() {
    gGame.lives--
    console.log('gGame.lives: ', gGame.lives);
    renderLives(gGame.lives);
    if (!gGame.lives) gameOver();
}
// show all mines, call end game, toggle smiley
function gameOver() {
    gSmiley.innerHTML = SADSMILEY;
    endGame();
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            var elCell = document.querySelector(`.cell${i}-${j}`);
            if (gBoard[i][j].isMine && !gBoard[i][j].isOpened) showMine(elCell, gBoard[i][j]);
        }
    }
}
// check every opening click (not mine) if opened all safe cells, gIsVictory = true; acitvate endGame , toggle smiley 
function checkVictory() {
    if (gGame.openedCount === (gLevel.SIZE * gLevel.SIZE) - gLevel.MINES) {
        gIsVictory = true;
        gSmiley.innerHTML = COOLSMILEY;
        endGame();
        console.log('Victory')
    }
}

// timer stops, game on = false, mouse listner stops ; 
function endGame(){
    console.log('endGame')
    gGame.isOn = false;
    mouseClickListener(gBoard);
    clearInterval(timerInterval); 
}

// opening neighbours of empty cell (recursive with leftMouseClick)
function openNegs(clickedElCell) {
    // console.log('clickedElCell.dataset ', clickedElCell.dataset)
    var elCellData = clickedElCell.dataset;
    var iPos = +elCellData.i;
    var jPos = +elCellData.j;
    for (var a = iPos - 1; a <= iPos + 1; a++) {
        if (a < 0 || a >= gBoard.length) continue;
        for (var b = jPos - 1; b <= jPos + 1; b++) {
            if (b < 0 || b >= gBoard[a].length) continue;
            if (a === iPos && b === jPos) continue;
            var elCell = document.querySelector(`.cell${a}-${b}`);
            if (gBoard[a][b].isOpened) continue;
            if (gBoard[a][b].isFlagged) continue;
            else leftMouseClick(elCell, gBoard[a][b])
        }
    }
}

// right mouse click - toggle cell isflagged in model and in DOM 
function rightMouseClick(clickedElCell, clickedCell) {
    if (clickedCell.isFlagged) {
        clickedCell.isFlagged = false;
        clickedElCell.innerHTML = '';
    } else {
        clickedCell.isFlagged = true;
        clickedElCell.innerHTML = FLAG;
    }
    // console.log('rightMouseClick ', clickedElCell);
}

// render lives icons on start and on hit
function renderLives(lives) {
    var strHTML = '';
    for (var i = 0; i < lives; i++) {
        strHTML += LIFE;
    }
    var elLives = document.querySelector('.lives span');
    elLives.innerHTML = strHTML
}

function getCellInModel(clickedElCell) {
    var elCellData = clickedElCell.dataset;
    var iPos = elCellData.i;
    var jPos = elCellData.j;
    var clickedCell = gBoard[iPos][jPos];
    return clickedCell;
}

function checkTimer(){
    var milliseconds = ( Date.now() - start);
    var time = parseInt(milliseconds/10 )
    gTimer.innerHTML = time/100 ;
}

function toggleGame(){
    initGame(gLevel.SIZE, gLevel.MINES);
    console.log('toggleGame')
}