import { useReducer } from 'react';
import { board } from './boardDefault';
import { getPositions } from './utils/getPositions';
import { getCheckInfo, getIsCapturable } from './utils/getCapturableBy'



function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj))
}

const initialState = {
    board,
    lastPlayed: null,
    selected: null,
    // isWhiteTurn: true,
    isWhiteTurn: null,
    castlingAllowed: [[true, true], [true, true]], // Is Castling allowed [white: [left. right], black: [left, right]]
    checkInfo: [{check: [], pin: []}, {check: [], pin: []}],
    kingPos: [[7, 4], [0, 4]],
    winner: null,
    promotion: {}, // {side, col}
    history: {
    uiMoveList: [],
    moves: [], // [[{oldPos, piece}, {newPos, piece}], ...]
    current: 0, // Current move index in history
    other: [{}], // [ {castlingAllowed, checkInfo, promotion, kingPos, winner}, ... ]
    enPassant: [], // Keep track of en passants to handle history,
    promotionChoices: [] // [ [current, piece] ]
    },
    captured: [
    {p: 0, r: 0, k: 0, b: 0, q: 0},
    {p: 0, r: 0, k: 0, b: 0, q: 0}
    ],
    prevCaptured: [],
    enPassantPos: null,
    promotionMove: null
}



const reducer = (state, action) => {
  const getPieceByPos = pos => state.board[pos[0]][pos[1]].piece
  
  const comparePos = (pos1, pos2) => pos1[0] == pos2[0] && pos1[1] == pos2[1]

  const isOccupied = (pos, side) => { // Check if position is occupied by another piece and whose it is
    const boardPiece = getPieceByPos(pos)
    
    if(boardPiece) {
      if(boardPiece[0] === side) return 1 // Player's piece
      return -1 // Opponent's piece
    }

    return 0 // Empty space
  }


  const getIsOccupiedBy = (pos, piece) => state.board[pos[0]][pos[1]].piece == piece


  // Get positions found in two different arrays
  const getIntersectingPositions = (arr1, arr2) => arr1.filter(pos1 => arr2.find(pos2 => comparePos(pos1, pos2)))

  
  const getIsCheck = sideIndex => state.checkInfo[sideIndex].check.length ? true : false



  const getAvailablePostions = (position, piece) => {
    const side = piece[0]
    const sideIndex = side === 'w' ? 0 : 1

    const checkInfo = state.checkInfo[sideIndex]
    const isCheck = checkInfo.check.length ? true : false
    

    // Get all available positions (by pattern)
    const rawPositions = getPositions(piece, position, isOccupied, getIsOccupiedBy, pawnShot,
      getIsCheck(sideIndex) ? false : state.castlingAllowed[sideIndex], getPieceByPos
    ); 
    
    // Get available positions for pinned piece
    const pinned = checkInfo.pin.length > 0 ?
      checkInfo.pin.find(obj => comparePos(obj.pos, position)) :
      null

    // Get available positions for king (if selected)
    const kingEscapePositions = piece.slice(1) === 'ki' ?
      rawPositions.filter(pos => !getIsCapturable(pos, side, isOccupied, getIsOccupiedBy, getPieceByPos)) :
      []

    
    // Get final available positions
    const availablePos = isCheck ?
      piece.slice(1) === 'ki' ?
      kingEscapePositions :
      checkInfo.check.length > 1 ?
      [] :
      pinned ? 
      [] :
      getIntersectingPositions(rawPositions, checkInfo.check[0].path.concat([checkInfo.check[0].pos])) :
      pinned ?
      getIntersectingPositions(pinned.path, rawPositions) :
      piece.slice(1) === 'ki' ?
      kingEscapePositions :
      rawPositions

    
    return availablePos
  }


  const getEnPassantPos = (position, piece) => {
    const [row, col] = position;
    const side = piece[0]
    const opSide = side === 'w' ? 'b' : 'w'
    
    const sideIndex = side === 'w' ? 0 : 1
    const directionOp = sideIndex ? 1 : -1 // Direction (row operation) for player side pawn (e.g. +/-)

    const sufficientRow = side === 'w' ? 3 : 4
    
    const opColsArr = [col - 1, col + 1].filter(x => (x >= 0 && x <= 7)) // Opponent potential pawn positions

    let resRow, resCol;
    
    
    
    // Check if piece is pawn and row is sufficient
    if(piece.slice(1) !== 'p' || row !== sufficientRow) return;



    // Check if conditions for oponnent are met
    opColsArr.forEach(opCol => {
      // Check if opponent pawn next to position
      if(state.board[row][opCol].piece.slice(1) !== 'p') return;
      
  
      // Check if last played move was oponnent's pawn to adequate position
      const [oldMove, newMove] = state.history.moves[state.history.current - 1]
  
      if(
        oldMove.piece !== opSide + 'p' ||
        Math.abs(oldMove.pos[0] - newMove.pos[0]) !== 2 ||
        !comparePos(newMove.pos, [sufficientRow, opCol])
      ) return;

      resCol = opCol;
    })

    if(!resCol) return; // Return if oponnent's piece not found or last played



    // Check if last move including en passant pawn was adequate
    const [oldMove] = state.history.moves.findLast(move => comparePos(move[1].pos, position))
    if(
      !oldMove ||
      oldMove.piece !== side + 'p' ||
      !comparePos(oldMove.pos, [row + (1 * directionOp * -1), col])
    ) return;
    


    // Check if second to last move including en passant pawn was adequate
    const [prevOldMove] = state.history.moves.findLast(move => comparePos(move[1].pos, oldMove.pos))
    if(
      !prevOldMove ||
      prevOldMove.piece !== side + 'p' ||
      !comparePos(prevOldMove.pos, [row + (3 * directionOp * -1), col])
    ) return;



    // If all conditions are met, return en passant position
    resRow = row + (1 * directionOp)
    const enPassantPos = [resRow, resCol]

    state.enPassantPos = enPassantPos
    return enPassantPos;
  }





  const pawnShot = (pos, side) => {
    const [row, col] = pos
    const res = new Array()

    if(state.board[row][col-1] && state.board[row][col-1].piece && state.board[row][col-1].piece[0] != side) { res.push([row, col-1]) }
    if(state.board[row][col+1] && state.board[row][col+1].piece && state.board[row][col+1].piece[0] != side) { res.push([row, col+1]) }

    return res
  }

  const modifyFieldPiece = (pos, piece) => state.board[pos[0]][pos[1]].piece = piece






  // Switch to next player turn
  const switchTurn = () => { state.isWhiteTurn = !state.isWhiteTurn }

  // Clear selected position (clear all action)
  const clearSelect = () => ({...state, selected: null, board: state.board.map(row => {
    return row.map(col => ({...col, isAvailable: false}))
  })})

  // Clear availables (of previous action)
  const clearAvailable = () => state.board.forEach(row => { row.forEach(col => col.isAvailable = false) })



  const updateMoveHistory = (oldMove, newMove) => {
    const getUiMove = pos => String.fromCharCode(pos[1] + 65) + (8 - pos[0])
    
    // Remove future moves ("rewriting" history)
    if(state.history.current < state.history.moves.length) {
      state.history.moves = state.history.moves.slice(0, state.history.current)
      state.history.other = state.history.other.slice(0, state.history.current + 1)
      state.history.uiMoveList = state.history.uiMoveList.slice(0, state.history.current)
    }

    
    state.history.uiMoveList.push([getUiMove(oldMove.pos), getUiMove(newMove.pos)].join('-'))
    state.history.moves.push([oldMove, newMove])
    state.history.current += 1;
    state.history.other.push(JSON.parse(JSON.stringify({
      checkInfo: state.checkInfo,
      winner: state.winner,
      promotion: state.promotion,
      kingPos: state.kingPos,
      captured: state.captured,
    })))
  }


  const updateIsStalemate = () => {
    let isStalemate = [true, true];
    state.board.forEach((line, row) => line.forEach((field, col) => {
      const sideIndex = field.piece[0] === 'w' ? 0 : 1
      if(!field.piece || !isStalemate[sideIndex]) return

      if(getAvailablePostions([row, col], field.piece).length) { isStalemate[field.piece[0] === "w" ? 0 : 1] = false }
    }))

    let isEnd = false
    if(isStalemate[0] || isStalemate[1]) { isEnd = true }
    if(!isEnd) return
    
    if(state.checkInfo[0].check.length > 0) {state.winner = 'b'}
    else if(state.checkInfo[1].check.length > 0) {state.winner = 'w'}
    else { state.winner = 's' }
    // if(isStalemate[0] || isStalemate[1]) { state.winner = 's' }
  }


  const updateCheckAndPin = side => {
    const opSide = side === 'w' ? 'b' : 'w'
    const sideIndex = side === 'w' ? 0 : 1
    const kingPos = state.kingPos[sideIndex]

    const checkInfo = getCheckInfo(kingPos, side, isOccupied, getIsOccupiedBy, getPieceByPos)
    state.checkInfo[sideIndex] = checkInfo
    
    const {check} = checkInfo
    if(check.length > 0) {
      const rawKingAvailable = getPositions(side + 'ki', kingPos, isOccupied, getIsOccupiedBy, pawnShot, false, getPieceByPos)


      const isKingMovable = rawKingAvailable.filter(pos => 
        getIsCapturable(pos, side, isOccupied, getIsOccupiedBy, getPieceByPos, false, true) == false).length > 0

      const isCheckingPieceCapturable = check.length > 1 ? false :
        getIsCapturable(check[0].pos, opSide, isOccupied, getIsOccupiedBy, getPieceByPos)

      const isCheckingPieceBlockable = check.length > 1 ? false :
        check[0].path.filter(pos => 
          getIsCapturable(pos, opSide, isOccupied, getIsOccupiedBy, getPieceByPos, true)
        ).length > 0

        
      if(!isKingMovable && !isCheckingPieceCapturable && !isCheckingPieceBlockable) {
        state.winner = opSide
      }
    }
  }


  // Update all the state logic after played move - mate, stalemate, switch turn and latest move (hisotry)
  const updateBundle = () => {
    updateCheckAndPin('w'); 
    updateCheckAndPin('b');
    updateIsStalemate()

    switchTurn()
  }




  const updatePromotion = () => {
    const rows = [0, 7]
    let isPromotion = false;
    
    rows.forEach(row => {
      const wantedPiece = row === 0 ? 'wp' : 'bp'
      state.board[row].forEach((field, col) => {
        if(isPromotion) return
        if(field.piece === wantedPiece) { state.promotion = {side: wantedPiece[0], col}; isPromotion = true; }
      })
    })

    return isPromotion
  }

  const updatePerformEnPassant = side => {
    const [row, col] = state.enPassantPos;
    const capturedRow = row + (side === 'w' ? 1 : -1)

    state.board[capturedRow][col].piece = ""
    state.history.enPassant.push({
      current: state.history.current,
      pos: [capturedRow, col]
    })

    
    state.enPassantPos = null
  }



  switch(action.type) {
    case "start_game": return {...deepClone(initialState), isWhiteTurn: true, winner: ''}
    case "restart_game": return deepClone(initialState)
    case "resign": return {...state, winner: state.isWhiteTurn ? 'b' : 'w'}


    case "select_piece": {
      clearAvailable()
      const [piece, position] = action.payload

      const isWhite = piece.slice(0, 1) == "w" ? true : false;
      if(isWhite !== state.isWhiteTurn) { return state; } // Check if player's turn

      // Deselect on double select
      if(state.selected && state.selected[0] == position[0] && state.selected[1] == position[1]) {
        return {...state, selected: null}
      }


      const availablePos = getAvailablePostions(position, piece)
      const enPassantPos = getEnPassantPos(position, piece)
      if(enPassantPos) availablePos.push(enPassantPos)

      availablePos.forEach(aPos => state.board[aPos[0]][aPos[1]].isAvailable = true)
      return {...state, selected: position}
    }

    case "move_piece": {
      const oldPos = state.selected
      const [newPos] = action.payload

      const oldMove = {piece: getPieceByPos(oldPos), pos: oldPos}
      const newMove = {piece: getPieceByPos(newPos), pos: newPos}


      const sPiece = state.board[state.selected[0]][state.selected[1]].piece // Selected piece
      const side = sPiece.slice(0, 1)


      // Check if castling is requested, move the rook
      if(
        sPiece.slice(1) == 'ki' &&
        (newPos[1] - oldPos[1] > 1 ||
        oldPos[1] - newPos[1] > 1)
      ) {
        const col = 7 - newPos[1] > newPos[1] ? 3 : 5
        state.board[newPos[0]][col].piece = side + 'r'
        state.board[newPos[0]][col == 3 ? 0 : 7].piece = ''
      }


      if(sPiece) { // Prevent strict mode from removing the piece from new position

        // Keep track of captured pieces
        const capturedPiece = state.board[newPos[0]][newPos[1]].piece ? state.board[newPos[0]][newPos[1]].piece.slice(1) : null
        if(capturedPiece) {
          state.captured[side === 'w' ? 0 : 1][capturedPiece] += 1
        }


        state.board[newPos[0]][newPos[1]].piece = sPiece // Set selected piece to new position
        state.board[oldPos[0]][oldPos[1]].piece = '' // Remove selected piece from old position

        state.lastPlayed = [oldPos, newPos] // Update last played highlight (old and new field)

        if(state.enPassantPos && sPiece.slice(1) === 'p' && comparePos(newPos, state.enPassantPos)) {
          updatePerformEnPassant(side);
          // state.enPassantPos = null;
        }


        // Disable castling if king or rook moved
        if(sPiece.slice(1) == 'ki') { state.castlingAllowed[side == 'w' ? 0 : 1] = [false, false] }
        if(sPiece.slice(1) == 'r' && (state.selected[1] === 0 || state.selected[1] === 7)) {
          state.castlingAllowed
            [side == 'w' ? 0 : 1]
            [state.selected[1] === 0 ? 0 : 1]
          = false
        }


        // Update king state position
        if(sPiece.slice(1) == 'ki') { state.kingPos[side == 'w' ? 0 : 1] = newPos }

        
        clearAvailable() // Clear available positions

        if(updatePromotion()) { 
          state.promotionMove = [oldMove, newMove]
          return {...state} 
        }

        updateBundle()
        updateMoveHistory(oldMove, newMove)
      }

      return {...state, selected: null} // Update state and deselect position
    }




    case "undo": {
      const current = state.history.current - 1;
      if(current < 0) { return state; }

      const [oldMove, newMove] = state.history.moves[current]
      const other = current ? state.history.other[current] : {}
      const lastPlayed = current ?
        state.history.moves[current - 1].map(move => move.pos) : 
        [oldMove.pos, newMove.pos]

      const enPassant = state.history.enPassant.find(obj => obj.current == current)
      const enPassantPiece = (state.isWhiteTurn ? "w" : "b") + "p"


      // Handle undo before promoting
      if(state.promotionMove) {
        const [oldMove, newMove] = state.promotionMove
        state.board[oldMove.pos[0]][oldMove.pos[1]].piece = oldMove.piece
        state.board[newMove.pos[0]][newMove.pos[1]].piece = newMove.piece
        state.promotionMove = null;
      }


      return {
        ...state,
        ...deepClone(other),
        lastPlayed,
        isWhiteTurn: !state.isWhiteTurn,
        history: {
          ...state.history,
          current: state.history.current - 1
        },
        promotion: {},
        board: state.board.map((rank, row) => rank.map((field, col) => 
          comparePos([row, col], oldMove.pos) ?
            {...field, piece: oldMove.piece, isAvailable: false} :
          comparePos([row, col], newMove.pos) ?
            {...field, piece: newMove.piece, isAvailable: false} :
          (enPassant && comparePos([row, col], enPassant.pos)) ?
            {...field, piece: enPassantPiece, isAvailable: false} :
          {...field, isAvailable: false}
        ))
      }
    }

    case "redo": {
      const current = state.history.current;
      if(current > state.history.moves.length - 1) { return state; }

      const [oldMove, newMove] = state.history.moves[current]
      const other = state.history.other[current + 1]
      const lastPlayed = [oldMove.pos, newMove.pos]

      const enPassant = state.history.enPassant.find(obj => obj.current == current)
      

      // Handle redo after promoting
      if(Object.keys(state.promotion).length > 0) {
        const choice = state.history.promotionChoices.find(arr => arr[0] === current)
        if(choice[1]) {
          const promotionPos = state.history.moves[current - 1][1].pos
          modifyFieldPiece(promotionPos, choice[1])
        }
      }

      
        return {
        ...state,
        ...deepClone(other),
        lastPlayed,
        isWhiteTurn: !state.isWhiteTurn,
        history: {
          ...state.history,
          current: state.history.current + 1
        },
        board: state.board.map((rank, row) => rank.map((field, col) => 
          comparePos([row, col], newMove.pos) ?
            {...field, piece: oldMove.piece, isAvailable: false} :
          comparePos([row, col], oldMove.pos) ?
            {...field, piece: "", isAvailable: false} :
          (enPassant && comparePos([row, col], enPassant.pos)) ?
            {...field, piece: "", isAvailable: false} :
          {...field, isAvailable: false}
        ))
      }
    }




    case "timeout": {
      const index = action.payload
      const winner = index === 0 ? 'b' : 'w'

      return {...state, winner}
    }




    case "promote_pawn": {
      if(!Object.keys(state.promotion).length) return {...state}; // Prevent strict mode
      const {pos, piece} = action.payload;
    
      modifyFieldPiece(pos, piece);
      
      updateBundle()
      
      const [oldMove, newMove] = state.promotionMove
      updateMoveHistory(oldMove, newMove)
      state.history.promotionChoices.push([state.history.current, piece])

      state.promotion = {};
      state.promotionMove = null;
      
      return {...state};
    }

    case "clear_select": return clearSelect()

    default: return state;
  }
}

export default function ChessReducer() {
    const [state, dispatch] = useReducer(reducer, deepClone(initialState))

    return {state, dispatch}
}