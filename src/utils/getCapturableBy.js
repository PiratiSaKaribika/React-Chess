const operations = {
    'r': [[1, 0], [-1, 0], [0, 1], [0, -1]],
    'b': [[1, 1], [1, -1], [-1, -1], [-1, 1]],
    'k': [[2, 1], [2, -1], [1, 2], [-1, 2], [-2, 1], [-2, -1], [1, -2], [-1, -2]],
    'q': [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, -1], [-1, 1]],
    'ki': [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, -1], [-1, 1]],
}

const isInBounds = (x, y) => x <= 7 && x >= 0 && y <= 7 && y >=0

// Get is capturable by specific piece and pinned positions
// export const getCapturableBy = (piece, pos, isOccupied, getIsOccupiedBy) => {
//     const pieceId = piece.slice(1)
//     let pinnedPos, isCapturable, obstacleCount = 0;

//     let [row, col] = pos;
    
//     operations[pieceId].forEach(op => {
//         if(isCapturable) { return; }

//         let x = row, y = col;
//         let isFirst = true;


//         while(x <= 7 && x >= 0 && y <= 7 && y >=0) {
//             if(!isFirst) {
//                 if(getIsOccupiedBy([x, y], piece) && obstacleCount == 0) { isCapturable = true; return; }
//                 if(obstacleCount >= 1) { isCapturable = false; break; }
                
//                 const occupied = isOccupied([x, y], piece[0])

//                 if(occupied == 1) { obstacleCount += 1; }
//                 else if(occupied === -1) {
//                     if(obstacleCount) { pinnedPos = null; break; }
//                     pinnedPos = [x, y];
//                     obstacleCount += 1;

//                     console.log(pinnedPos)
//                 }
                
//                 if(pieceId == 'k') { break; }
//             }
//             else { isFirst = false } // exclude selected position

//             x += op[0]
//             y += op[1]
//         }
        
//         if(obstacleCount >= 2) { pinnedPos = null; }
//         obstacleCount = 0
//     })
//     if(!isCapturable) { pinnedPos = null; }

//     return {isCapturable, pinnedPos};
// }


// Get is capturable by specific piece and pinned positions
export const getCapturableBy = (piece, pos, isOccupied, getIsOccupiedBy) => {
    const pieceId = piece.slice(1)
    let pinPos, isCapturable, obstacleCount = 0, checkingPiecePos, available = [];
    // function clearRes() { pinnedPos = null; isCapturable = null; obstacleCount = 0; }

    let [row, col] = pos;
    
    operations[pieceId].forEach(op => {
        if(isCapturable || pinPos) { return; }

        let tmpPin;
        let x = row, y = col;
        let isFirst = true;


        while(x <= 7 && x >= 0 && y <= 7 && y >=0) {
            // if(piece == 'bq' && op[0] == -1 && op[1] == 0) {
            //     console.log("\nX: " + x)
            //     console.log("\nY: " + y + '\n')
            // }

            if(!isFirst) {
                if(obstacleCount >= 2) { obstacleCount = 0; return; }
                available.push([x, y])
                const occupied = isOccupied([x, y], piece[0])

                if(occupied === 1) { 
                    if(getIsOccupiedBy([x, y], piece)) {
                        if(!obstacleCount) { isCapturable = true; checkingPiecePos = [x, y]; return; }

                        pinPos = tmpPin;
                        obstacleCount = 0;
                        return;
                    }

                    isCapturable = null; obstacleCount = 0; tmpPin = 0; return; 
                }
                if(occupied === -1) {
                    tmpPin = [x, y];
                    obstacleCount++;
                }

                if(pieceId == 'k') { break; }
            }
            else { isFirst = false } // exclude selected position

            x += op[0]
            y += op[1]
        }
        
        // if(obstacleCount >= 2) { pinnedPos = null; }
        obstacleCount = 0
    })

    // return {isCapturable, pinned: {pinPos, available}, checkingPiecePos};
    return {capturable: {isCapturable, available}, pinned: {pinPos, available}, checkingPiecePos};
}



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



export const getIsCapturable = (pos, side, isOccupied, getIsOccupiedBy, getPieceByPos, excludeKing) => {
    const opSide = side === 'w' ? 'b' : 'w'
    // if(getCapturableByPawnPositions(pos, side, getPieceByPos)) {console.log("AAA"); console.log(pos); console.log("AAA"); return true}
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
                        if(piece === 'ki' && getIsCapturable(pos, opSide, isOccupied, getIsOccupiedBy, getPieceByPos)) return
                        isCapturable = true;
                        // console.log(opSide + piece)
                        return; 
                    }
                    else { break; }
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