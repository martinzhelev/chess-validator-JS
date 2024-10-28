const gameBoard = document.querySelector("#gameBoard");
const playerDisplay = document.querySelector("#player");
const width = 8
let playerGo = "whitePiece"
playerDisplay.textContent = 'white'

const startPieces = [
    rook, knight, bishop, queen, king, bishop, knight, rook,
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
    rook, knight, bishop, queen, king, bishop, knight, rook,
]



function createBoard(){
    startPieces.forEach((startPiece, i)=>{
        const square = document.createElement('div')
        square.classList.add('square')
        square.innerHTML = startPiece
        square.firstChild && square.firstChild.setAttribute('draggable', true);
        square.setAttribute('square-id', (width*width-1)-i)

        const row = Math.floor((63 - i) / 8 + 1)
        if(row%2===0){
            square.classList.add(i % 2 === 0 ? "white" : "black")
        }
        else{
            square.classList.add(i % 2 === 0 ? "black" : "white")
        }
        gameBoard.append(square)

        if(i <= 15){
            square.firstChild.firstChild.classList.add('blackPiece')
        }
        if(i >= 48){
            square.firstChild.firstChild.classList.add('whitePiece')
        }

    })
}

createBoard()


const allSquares = document.querySelectorAll(".square")



allSquares.forEach(square => {
    square.addEventListener('dragstart', dragStart)
    square.addEventListener('dragover', dragOver)
    square.addEventListener('drop', dragDrop)


})

let startPsoitionId
let draggedElement
let whiteKingId;
let blackKingId;
function dragStart (e){
    startPsoitionId = e.target.parentNode.getAttribute('square-id')
    draggedElement = e.target
    allSquares.forEach(square => {
        if (square.firstChild && square.firstChild.id === 'king' && square.firstChild.firstChild && square.firstChild.firstChild.classList.contains("whitePiece")) {
            whiteKingId = square.getAttribute('square-id');
        }
        if (square.firstChild && square.firstChild.id === 'king' && square.firstChild.firstChild && square.firstChild.firstChild.classList.contains("blackPiece")) {
            blackKingId = square.getAttribute('square-id');
        }
    });
}
function dragOver (e){
    e.preventDefault()
}
function dragDrop(e){
    e.stopPropagation()
    const correctGo = draggedElement.firstChild.classList.contains(playerGo)
    const taken = e.target.classList.contains('piece')
    const valid = checkIfValid(Number(startPsoitionId) ,Number(e.target.getAttribute('square-id')) || Number(e.target.parentNode.getAttribute('square-id')))
    const opponentGo = playerGo === 'whitePiece' ? 'blackPiece' : 'whitePiece'
    const takenByOpponent = e.target.firstChild?.classList.contains(opponentGo)
    const check = checkIfValid(Number(e.target.getAttribute('square-id')) || Number(e.target.parentNode.getAttribute('square-id')), playerGo === "whitePiece" ? blackKingId : whiteKingId)
    console.log(e.target)

    if(correctGo){
        if(takenByOpponent && valid){
            e.target.parentNode.append(draggedElement)
            e.target.remove()
            if(check){
                alert("CHECK")
            }
            console.log("right before CheckForCheck 1")
            //checkForCheck(playerGo === "whitePiece" ? whiteKingId : blackKingId);
            changePLayer()

            return
        }
        if(taken && !takenByOpponent){
            console.log("right before CheckForCheck 2")

            console.log(taken)
            return
        }
        if(valid){
            e.target.append(draggedElement)
            console.log("right before CheckForCheck 3")
            if(check === true){
                alert("Check")
            }
            //checkForCheck(playerGo === "whitePiece" ? whiteKingId : blackKingId);
            changePLayer()


            return
        }
    }
}




// Main function to check if the piece move is valid
function checkIfValidKingCheck(startId, targetId, piece) {
    switch (piece) {
        case 'pawn':
            return isValidPawnMove(startId, targetId, true); // True for capturing
        case 'knight':
            return isValidKnightMove(startId, targetId);
        case 'bishop':
            return isValidBishopMove(startId, targetId);
        case 'rook':
            return isValidRookMove(startId, targetId);
        case 'queen':
            return isValidQueenMove(startId, targetId);
        case 'king':
            return isValidKingMove(startId, targetId);
        default:
            return false;
    }
}

function getEnemyPieces(playerColor) {
    // Gather all squares with the enemy pieces
    const enemyColor = playerColor === "whitePiece" ? "blackPiece" : "whitePiece";
    const enemyPieces = [];
    allSquares.forEach(square => {
        const pieceElement = square.firstChild;
        if (pieceElement && pieceElement.firstChild && pieceElement.firstChild.classList.contains(enemyColor)) {
            const type = pieceElement.id;
            const startId = Number(square.getAttribute('square-id'));
            enemyPieces.push({ startId, type });
        }
    });
    return enemyPieces;
}

function checkForCheck(kingPosition) {
    const enemyPieces = getEnemyPieces(playerGo); // Get the opponent's pieces based on current player
    for (let piece of enemyPieces) {
        const { startId, type } = piece;
        if (checkIfValidKingCheck(startId, kingPosition, type)) {
            console.log("Check detected on king's position at:", kingPosition);
            return true; // King is in check
        }
    }
    return false; // King is safe
}






function checkIfValid(startId, targetId){
    //const targetId = Number(target.getAttribute('square-id')) || Number(target.parentNode.getAttribute('square-id'))
    // startId = Number(startPsoitionId)
    const piece = draggedElement.id
    console.log(targetId)
    console.log(startId)
    console.log(piece)

    switch(piece){
        case 'pawn': {
            const starterRow = [8, 9, 10, 11, 12, 13, 14, 15];
        
            // Moving forward (one square or two if on starting row)
            if (starterRow.includes(startId) && startId + width * 2 === targetId && !document.querySelector(`[square-id="${startId + width}"]`).firstChild) {
                return true; // Move two squares forward from the start
            }
            
            if (startId + width === targetId && !document.querySelector(`[square-id="${targetId}"]`).firstChild) {
                return true; // Move one square forward
            }
            
            // Capturing diagonally
            if (startId + width - 1 === targetId && document.querySelector(`[square-id="${targetId}"]`).firstChild) {
               
                return true; // Capture diagonally to the left
            }
            
            if (startId + width + 1 === targetId && document.querySelector(`[square-id="${targetId}"]`).firstChild) {
                return true; // Capture diagonally to the right
            }
        
            return false;
        }
        
           break;
        case 'knight':
            if(startId + width * 2 - 1 === targetId||
                startId + width * 2 + 1 === targetId||
                startId + width - 2 === targetId||
                startId + width + 2 === targetId||
                startId - width * 2 - 1 === targetId||
                startId - width * 2 + 1 === targetId||
                startId - width - 2 === targetId||
                startId - width + 2 === targetId
            ){
                return true
            }
            break;
        case 'bishop': {
            const directions = [
                width + 1,    // Moving diagonally up-right
                width - 1,    // Moving diagonally up-left
                -(width + 1), // Moving diagonally down-left
                -(width - 1)  // Moving diagonally down-right
            ];
            
            for (let direction of directions) {
                let currentId = startId;
                
                while (true) {
                    currentId += direction;
                    
                    if (currentId < 0 || currentId >= width * width) break;
                    
                    if (currentId == targetId) return true;
                    
                    if (document.querySelector(`[square-id="${currentId}"]`).firstChild) break;
                }
            }
            return false;
        }
        break;
        case 'rook':
            // Vertical movement (up and down)
            if (targetId % width === startId % width) {
                const step = targetId > startId ? width : -width;
                for (let i = startId + step; i !== targetId; i += step) {
                    if (document.querySelector(`[square-id="${i}"]`).firstChild) {
                        return false;  // Blocked by a piece
                    }
                }
                return true;
            }
            // Horizontal movement (left and right)
            if (Math.floor(startId / width) === Math.floor(targetId / width)) {
                const step = targetId > startId ? 1 : -1;
                for (let i = startId + step; i !== targetId; i += step) {
                    if (document.querySelector(`[square-id="${i}"]`).firstChild) {
                        return false;  // Blocked by a piece
                    }
                }
                return true;
            }
            break;
        case 'queen':
            // Vertical movement (up and down) - same as the rook
            if (targetId % width === startId % width) {
                const step = targetId > startId ? width : -width;
                for (let i = startId + step; i !== targetId; i += step) {
                    if (document.querySelector(`[square-id="${i}"]`).firstChild) {
                        return false;  // Blocked by a piece
                    }
                }
                return true;
            }

            // Horizontal movement (left and right) - same as the rook
            if (Math.floor(startId / width) === Math.floor(targetId / width)) {
                const step = targetId > startId ? 1 : -1;
                for (let i = startId + step; i !== targetId; i += step) {
                    if (document.querySelector(`[square-id="${i}"]`).firstChild) {
                        return false;  // Blocked by a piece
                    }
                }
                return true;
            }

            // Diagonal movement - same as the bishop
            const directions = [
                width + 1,    // Moving diagonally up-right
                width - 1,    // Moving diagonally up-left
                -(width + 1), // Moving diagonally down-left
                -(width - 1)  // Moving diagonally down-right
            ];
            for (let direction of directions) {
                let currentId = startId;
                while (true) {
                    currentId += direction;
                    if (currentId < 0 || currentId >= width * width) break;  // Out of bounds
                    if (currentId === targetId) return true;  // Reached target square
                    if (document.querySelector(`[square-id="${currentId}"]`).firstChild) break;  // Blocked by a piece
                }
            }
            return false;

            break;
        case 'king': {
            const validMoves = [
                width,        // Move up
                -width,       // Move down
                1,            // Move right
                -1,           // Move left
                width + 1,    // Move diagonally up-right
                width - 1,    // Move diagonally up-left
                -(width + 1), // Move diagonally down-left
                -(width - 1)  // Move diagonally down-right
            ];
            
            for (let move of validMoves) {
                if (startId + move === targetId) {
                    return true;
                }
            }
            return false;
        }
                    
            

            
    }

}

function changePLayer(){
    revertIds()
    if(playerGo ==="whitePiece"){
        playerGo = "blackPiece"
        playerDisplay.textContent = "black"
    }
    else{
        reverseIds()
        playerGo = "whitePiece"
        playerDisplay.textContent = "white"
    }
}



function reverseIds(){
const allSquares = document.querySelectorAll(".square")
allSquares.forEach((square, i) => square.setAttribute('square-id', (width*width-1)-i))
}

function revertIds(){
    const allSquares = document.querySelectorAll(".square")
    allSquares.forEach((square, i) => square.setAttribute("square-id", i))
}

function isPathBlocked(startId, targetId, step) {
    for (let i = startId + step; i !== targetId; i += step) {
        if (document.querySelector(`[square-id="${i}"]`).firstChild) {
            return true; // Blocked by another piece
        }
    }
    return false;
}

// Define movement patterns for each piece
function isPathBlocked(startId, targetId, step) {
    for (let i = startId + step; i !== targetId; i += step) {
        if (document.querySelector(`[square-id="${i}"]`).firstChild) {
            return true; // Blocked by another piece
        }
    }
    return false;
}

// Define movement patterns for each piece
function isValidPawnMove(startId, targetId, isCapture = false) {
    const forwardStep = playerGo === "whitePiece" ? width : -width; // Ensure pawns only move forward
    const startRow = playerGo === "whitePiece" ? [8, 9, 10, 11, 12, 13, 14, 15] : [48, 49, 50, 51, 52, 53, 54, 55];

    if (isCapture) {
        return targetId === startId + forwardStep - 1 || targetId === startId + forwardStep + 1;
    }
    if (startRow.includes(startId) && targetId === startId + forwardStep * 2) {
        return !document.querySelector(`[square-id="${startId + forwardStep}"]`).firstChild;
    }
    return targetId === startId + forwardStep;
}

function isValidKnightMove(startId, targetId) {
    const moves = [
        width * 2 - 1, width * 2 + 1, width - 2, width + 2,
        -(width * 2) - 1, -(width * 2) + 1, -(width - 2), -(width + 2)
    ];
    const move = targetId - startId;
    // Check for valid knight moves and ensure the target is within bounds
    return moves.includes(move) && targetId >= 0 && targetId < width * width;
}

function isValidBishopMove(startId, targetId) {
    const directions = [width + 1, width - 1, -(width + 1), -(width - 1)];
    return directions.some(direction => {
        let currentId = startId;
        while (true) {
            currentId += direction;
            if (currentId === targetId) return true;
            if (currentId < 0 || currentId >= width * width || document.querySelector(`[square-id="${currentId}"]`).firstChild) break;
        }
        return false;
    });
}

function isValidRookMove(startId, targetId) {
    const verticalMove = targetId % width === startId % width;
    const horizontalMove = Math.floor(startId / width) === Math.floor(targetId / width);
    const step = verticalMove ? (targetId > startId ? width : -width) : (targetId > startId ? 1 : -1);

    // Ensure that vertical and horizontal moves stay within bounds and are not blocked
    if ((verticalMove || horizontalMove) && !isPathBlocked(startId, targetId, step)) {
        if (verticalMove) {
            const startColumn = startId % width;
            const targetColumn = targetId % width;
            return startColumn === targetColumn;
        }
        return true;
    }
    return false;
}

function isValidQueenMove(startId, targetId) {
    // Queen combines rook and bishop moves
    return isValidBishopMove(startId, targetId) || isValidRookMove(startId, targetId);
}

function isValidKingMove(startId, targetId) {
    const validMoves = [width, -width, 1, -1, width + 1, width - 1, -(width + 1), -(width - 1)];
    const move = targetId - startId;
    
    // Check if the target position is a valid move and within bounds
    return validMoves.includes(move) && targetId >= 0 && targetId < width * width;
}





