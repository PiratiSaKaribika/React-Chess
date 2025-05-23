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
    let pinPos, isCapturable, obstacleCount = 0, available = [];
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
                        if(!obstacleCount) { isCapturable = true; return; }

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

    return {isCapturable, pinned: {pinPos, available}};
}



export const getIsCapturableByPawn = (pos, side, getPieceByPos) => {
    const opSide = side === 'w' ? 'b' : 'w'
    let isCapturable = false
    const ops = [1, -1]

    let [row, col] = pos;
    const newRow = row + (side === 'w' ? -1 : 1);

    ops.forEach(op => {
        const newCol = col + op;
        if(newRow < 0 || newCol < 0 || newRow > 7 || newCol > 7) { return; }

        // if(getPieceByPos([newRow, newCol]) === (opSide + 'p')) { res.push([newRow, newCol]); }
        if(getPieceByPos([newRow, newCol]) === (opSide + 'p')) { isCapturable = true; }
    })

    return isCapturable;
}



export const getIsCapturable = (pos, side, isOccupied, getIsOccupiedBy) => {
    const [row, col] = pos;

    const allPieces = Object.keys(operations)
    const opSide = side === 'w' ? 'b' : 'w'
    let isCapturable = false;

    allPieces.forEach(piece => {
        if(isCapturable) { return; }

        operations[piece].forEach(op => {
            let x = row, y = col;

            while(isInBounds(x + op[0], y + op[1])) {
                x += op[0]
                y += op[1]
                
                if(isOccupied([x, y], side) !== 0) {
                    if(getIsOccupiedBy([x, y], opSide + piece)) { isCapturable = true; return; }
                    else { break; }
                }

                if(piece === 'k') { break; }
            }
        })
    })

    return isCapturable;
}