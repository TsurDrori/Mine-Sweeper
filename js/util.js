function getMat(rowsCount, colsCount) {

    var mat = [];
    for (var i = 0; i < rowsCount; i++) {
        mat[i] = [];
        for (var j = 0; j < colsCount; j++) {
            mat[i][j] = getRandomIntInclusive(1, 100)
        }
    }
    return mat
}


function renderTable(nums) {
    console.log('nums: ', nums);
    var strHTML = '';
    for (var i = 0; i < Math.sqrt(nums.length); i++ ) {
        strHTML += '<tr>'
        for (var j = 0; j < Math.sqrt(nums.length); j++) {
            var cell = nums.pop();
            console.log(cell);
            strHTML += `<td data-num="${cell}" onclick="cellClicked(this,${cell})">
            ${cell}</td>`
        }
        strHTML += '</tr>'
    }

    // console.log(strHTML)
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML
}

function copyMat(mat) {
    var newMat = [];
    for (var i = 0; i < mat.length; i++) {
        newMat[i] = [];
        for (var j = 0; j < mat[0].length; j++) {
            newMat[i][j] = mat[i][j];
        }
    }
    return newMat;
}

function drawNum() {
    return gNums.pop()
}

function shuffle(items) {
    var randIdx, keep
    for (var i = items.length - 1; i > 0; i--) {
        randIdx = getRandomInt(0, items.length - 1);

        keep = items[i];
        items[i] = items[randIdx];
        items[randIdx] = keep;
    }
    return items;
}

function renderCell(location, value) {
	var cellSelector = '.' + getClassName(location)
	var elCell = document.querySelector(cellSelector);
	elCell.innerHTML = value;
}

// Move the player by keyboard arrows
function handleKey(event) {

	var i = gGamerPos.i;
	var j = gGamerPos.j;


	switch (event.key) {
		case 'ArrowLeft':
			moveTo(i, j - 1);
			break;
		case 'ArrowRight':
			moveTo(i, j + 1);
			break;
		case 'ArrowUp':
			moveTo(i - 1, j);
			break;
		case 'ArrowDown':
			moveTo(i + 1, j);
			break;

	}

}

// Returns the class name for a specific cell
function getClassName(location) {
	var cellClass = 'cell-' + location.i + '-' + location.j;
	return cellClass;
}

// // add toggle game btn
// function toggleGame(elBtn) {
//     // console.log('gGameInterval', gGameInterval);
//     if (gGameInterval) {
//         clearInterval(gGameInterval);
//         gGameInterval = null;
//         elBtn.innerText = 'Play';
//     } else {
//         gGameInterval = setInterval(play, GAME_FREQ);
//         elBtn.innerText = 'Pause';

//     }
// }

function countNeighbours(cellI, cellJ, mat) {
    var negsCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i > mat.length - 1) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j > mat[i].length - 1) continue;
            if (i === cellI && j === cellJ) continue;
            // if (mat[i][j] === LIFE || mat[i][j] === SUPER_LIFE) negsCount++;
            if (mat[i][j]) negsCount++;
        }
    }
    return negsCount;
}

function getMaxInMat(mat) {
    console.table(mat);
    var max = -Infinity;

    for (var i = 0; i < mat.length; i++) {
        var currRow = mat[i];
        console.log('currRow', currRow);
        for (var j = 0; j < currRow.length; j++) {
            var currCell = currRow[j];
            console.log('currCell', currCell)
            if (currCell > max) {
                max = currCell
            }
        }
    }
    return max
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

// printPrimaryDiagonal(gMat)
function printPrimaryDiagonal(squareMat) {
    for (var d = 0; d < squareMat.length; d++) {
        var item = squareMat[d][d];
        console.log(item);
    }
}

// printSecondaryDiagonal(gMat)
function printSecondaryDiagonal(squareMat) {
    for (var d = 0; d < squareMat.length; d++) {
        var item = squareMat[d][squareMat.length - d - 1];
        console.log(item);
    }
}

function playSound(newSound) {
    var sound = new Audio(newSound);
    sound.play();
}

function preventContextMenu(element){ 
    element.addEventListener("contextmenu", function (e) {
        e.preventDefault();
    }, false);
}

// var players = [
//     { score: 100, name: 'Shuki' },
//     { score: 82, name: 'Muki' },
//     { score: 96, name: 'Puki' }
// ];
// players.sort(function (p1, p2) { return p1.score - p2.score })


// setTimeout(function () { alert('Times up!') }, 3000);

// var nums = [5, 3, 2, 7, 1, 10, 12, 22, 45];
// nums.sort()


// var langVotesMap = {
//     c: 3,
//     'c#': 5,
//     javascript: 52
// };
// var langName = prompt('Which is your favourite language?');
// var count = langVotesMap[langName]; // 3 , undefined
// if (langName) {
//     langVotesMap[langName] = (count) ? count + 1 : 1;
// }
// for (var langName in langVotesMap) {
//     langVotesMap[langName]);
//     var votesCount = langVotesMap[langName];



