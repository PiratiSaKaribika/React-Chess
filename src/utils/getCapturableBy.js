const operations = {
    'r': [[1, 0], [-1, 0], [0, 1], [0, -1]],
    'b': [[1, 1], [1, -1], [-1, -1], [-1, 1]],
    'k': [[2, 1], [2, -1], [1, 2], [-1, 2], [-2, 1], [-2, -1], [1, -2], [-1, -2]],
    'q': [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, -1], [-1, 1]],
    'ki': [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, -1], [-1, 1]],
}

const isInBounds = (x, y) => x <= 7 && x >= 0 && y <= 7 && y >=0






export const getCapturableByPawnPositions = (pos, side, getPieceByPos) => {
    const opSide = side === 'w' ? 'b' : 'w'
    let positions = []
    const ops = [1, -1]

    let [row, col] = pos;
    const x = row + (side === 'w' ? -1 : 1);

    ops.forEach(op => {
        const y = col + op;
        if(!isInBounds(x, y)) { return; }

        if(getPieceByPos([x, y]) === (opSide + 'p')) { positions.push([x, y]); }
    })

    return positions.length ? positions : null;
}



export const getIsCapturable = (pos, side, isOccupied, getIsOccupiedBy, getPieceByPos, excludeKing, isKing) => {
    const opSide = side === 'w' ? 'b' : 'w'
    if(getCapturableByPawnPositions(pos, side, getPieceByPos)) { return true }
    
    const [row, col] = pos;

    const allPieces = Object.keys(operations)
    let isCapturable = false;

    allPieces.forEach(piece => {
        if(isCapturable) { return; }
        if(excludeKing && piece === 'ki') { return; }

        operations[piece].forEach(op => {
            let x = row, y = col;

            while(isInBounds(x + op[0], y + op[1])) {
                x += op[0]
                y += op[1]
                
                if(isOccupied([x, y], side) !== 0) {
                    if(getIsOccupiedBy([x, y], opSide + piece)) {
                        if(piece === 'ki' && getIsCapturable(pos, opSide, isOccupied, getIsOccupiedBy, getPieceByPos, true)) return
                        isCapturable = true;

                        // console.log(pos)
                        return; 
                    }
                    else if(!isKing || !getPieceByPos(pos) === (side + 'ki')) { break; }
                }

                if(piece === 'k' || piece === 'ki') { break; }
            }
        })
    })

    return isCapturable;
}


// Get is checked, piece/s causing check and path to that piece, pinned piece/s position/s and their possible paths
export const getCheckInfo = (pos, side, isOccupied, getIsOccupiedBy, getPieceByPos) => {
    const [row, col] = pos
    const opSide = side === 'w' ? 'b' : 'w'

    const result = {
        check: [
            // {
            //     pos: [],
            //     path: [[], [], []]
            // }
        ],
        pin: [
            // {
            //     pos: [],
            //     path: [[], [], []]
            // }
        ]
    }

    const checkingPawnPositions = getCapturableByPawnPositions(pos, side, getPieceByPos)
    if(checkingPawnPositions) { checkingPawnPositions.forEach(pos => result.check.push({pos, path: []})) }

    Object.keys(operations).forEach(pieceId => {
        if(pieceId === 'ki') { return; }

        operations[pieceId].forEach(op => {
            let x = row, y = col;
            let path = [], pin, isCheck, checkPos;
            let obstacleCount = 0;

            while(isInBounds(x + op[0], y + op[1])) {
                if(obstacleCount > 1) { return; }
                if(isCheck) { break; }

                x += op[0]
                y += op[1]

                const occupied = isOccupied([x, y], side)


                if(occupied === 1) {
                    obstacleCount++;
                    pin = [x, y];
                } else if(occupied === -1) {
                    if(getIsOccupiedBy([x, y], opSide + pieceId)) {
                        isCheck = true;
                        checkPos = [x, y]
                        path.push([x, y])
                        break;
                    }
                    // obstacleCount++;
                    obstacleCount = 2;
                    // break; - tf
                } else { path.push([x, y]) }

                if(pieceId === 'k') { break; }
            }

            if(isCheck) {   
                result[pin ? 'pin' : 'check'].push({
                    pos: pin ? pin : checkPos,
                    path
                })
            }
        })
    })


    return result
}