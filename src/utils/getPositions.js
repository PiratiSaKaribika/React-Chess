import { getIsCapturable } from "./getCapturableBy"

const isInBounds = (x, y) => (x <= 7 && x >= 0 && y <= 7 && y >=0)

const operations = {
    'r': [[1, 0], [-1, 0], [0, 1], [0, -1]],
    'b': [[1, 1], [1, -1], [-1, -1], [-1, 1]],
    'k': [[2, 1], [2, -1], [1, 2], [-1, 2], [-2, 1], [-2, -1], [1, -2], [-1, -2]],
    'q': [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, -1], [-1, 1]],
    'ki': [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, -1], [-1, 1]],
}

// Get available fields [PAWN EXCLUDED]
const getPiecePositions = (piece, pos, isOccupied) => {
    const pieceId = piece.slice(1)
    const result = new Array();

    let [row, col] = pos;
    
    operations[pieceId].forEach(op => {
        let x = row, y = col;
        let isFirst = true;

        while(isInBounds(x, y)) {
            if(!isFirst) {
                const occupied = isOccupied([x, y], piece[0])
                if(occupied == 1) { break; }
                else if(occupied == -1) { result.push([x, y]); break; }

                result.push([x, y]);
                if(pieceId == 'k' || pieceId == 'ki') { break; }
            }
            else { isFirst = false } // exclude selected (clicked) position


            x += op[0]
            y += op[1]
        }
    })

    return result;
}

// Get available fields - PAWN
const getPawnPositions = (piece, pos, isOccupied, pawnShot) => {
    const result = new Array()
    const [row, col] = pos

    const side = piece[0]
    let x = (row == 7 || row == 0) ? row : // Prevent getting out of bounds
        side == "b" ? row + 1 : row - 1
    let y = col;

    const isStartingPos = side == "b" ? row == 1 ? true : false : (side == "w" && row == 6) ? true : false

    if(isOccupied([x, y], piece[0]) == 0) { result.push([x, y]); }
    const capturable = pawnShot([x, y], side)

    if(isStartingPos && result.length != 0) {
        x = side == "b" ? x+1 : x-1
        if(isOccupied([x, y], piece[0]) == 0) { result.push([x, y]) }
    }

    return capturable.length ? result.concat(capturable) : result
}



export const getPositions = (piece, position, isOccupied, getIsOccupiedBy, pawnShot, castlingAllowed, getPieceByPos) => {
    const pieceId = piece.slice(1)
    const isWhite = piece.slice(0, 1) == 'w'
    const side = piece[0]
    
    const castlingPositions = []
    if(pieceId == 'ki' && castlingAllowed[0] || castlingAllowed[1]) {
        const row = isWhite ? 7 : 0
        const ruleArr = [[1, 2, 3], [5, 6]]

        if(
            castlingAllowed[0] &&
            ruleArr[0].filter(col => 
                isOccupied([row, col], piece[0]) !== 0 || 
                getIsCapturable([row, col], side, isOccupied, getIsOccupiedBy, getPieceByPos)
            ).length == 0) { castlingPositions.push([row, 2]); }
        if(
            castlingAllowed[1] &&
            ruleArr[1].filter(col => 
                isOccupied([row, col], piece[0]) !== 0 || 
                getIsCapturable([row, col], side, isOccupied, getIsOccupiedBy, getPieceByPos)
            ).length == 0) { castlingPositions.push([row, 6]) }
        // if(ruleArr[1].filter(col => isOccupied([row, col], piece[0]) !== 0).length == 0) { castlingPositions.push([row, 6]) }
    }

    return pieceId == 'p' ?
        getPawnPositions(piece, position, isOccupied, pawnShot) :
        pieceId == 'ki' ?
        getPiecePositions(piece, position, isOccupied).concat(castlingPositions) :
        getPiecePositions(piece, position, isOccupied)
}