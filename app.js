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
function dragStart (e){
    startPsoitionId = e.target.parentNode.getAttribute('square-id')
    draggedElement = e.target
}
function dragOver (e){
    e.preventDefault()
}
function dragDrop(e){
    e.stopPropagation()
    const correctGo = draggedElement.firstChild.classList.contains(playerGo)
    const taken = e.target.classList.contains('piece')
    const valid = checkIfValid(e.target)
    const opponentGo = playerGo === 'whitePiece' ? 'blackPiece' : 'whitePiece'
    const takenByOpponent = e.target.firstChild?.classList.contains(opponentGo)
    console.log(e.target)

    if(correctGo){
        if(takenByOpponent && valid){
            e.target.parentNode.append(draggedElement)
            e.target.remove()
            changePLayer()
            return
        }
        if(taken && !takenByOpponent){
            console.log(taken)
            return
        }
        if(valid){
            e.target.append(draggedElement)
            changePLayer()
            return
        }
    }
    
}


function checkIfValid(target){
    const targetId = Number(target.getAttribute('square-id')) || Number(target.parentNode.getAttribute('square-id'))
    const startId = Number(startPsoitionId)
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
                        
                        if (currentId === targetId) return true;
                        
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