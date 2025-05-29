import { useReducer } from 'react'
import styles from './App.module.css'

// Components
import Field from './Field';

// Utils and Assets
import { board } from './boardDefault';
import { getPositions } from './utils/getPositions';
import { getCheckInfo, getIsCapturable } from './utils/getCapturableBy'




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
  // const getIsOccupiedBy = (pos, piece) => getPieceByPos(pos) == piece


  // Get positions found in two different arrays
  const getIntersectingPositions = (arr1, arr2) => arr1.filter(pos1 => arr2.find(pos2 => comparePos(pos1, pos2)))

  
  const getIsCheck = sideIndex => state.checkInfo[sideIndex].check.length ? true : false



  const pawnShot = (pos, side) => {
    const [row, col] = pos
    const res = new Array()

    if(state.board[row][col-1] && state.board[row][col-1].piece && state.board[row][col-1].piece[0] != side) { res.push([row, col-1]) }
    if(state.board[row][col+1] && state.board[row][col+1].piece && state.board[row][col+1].piece[0] != side) { res.push([row, col+1]) }

    return res
  }


  const getIsCapturableByPawn = (pos, side) => {
    const opSide = side === 'w' ? 'b' : 'w'
    let pawnPos = false
    const ops = [1, -1]

    let [row, col] = pos;
    const newRow = row + (side === 'w' ? -1 : 1);

    ops.forEach(op => {
      const newCol = col + op;
      if(newRow < 0 || newCol < 0 || newRow > 7 || newCol > 7) { return; }

      // if(getPieceByPos([newRow, newCol]) === (opSide + 'p')) { res.push([newRow, newCol]); }
      if(getPieceByPos([newRow, newCol]) === (opSide + 'p')) { pawnPos = [newRow, newCol]; }
    })

    return pawnPos;
  }




  // Switch to next player turn
  const switchTurn = () => { state.isWhiteTurn = !state.isWhiteTurn }

  // Clear selected position (clear all action)
  const clearSelect = () => ({...state, selected: null, board: state.board.map(row => {
    return row.map(col => ({...col, isAvailable: false}))
  })})

  // Clear availables (of previous action)
  const clearAvailable = () => state.board.forEach(row => { row.forEach(col => col.isAvailable = false) })





  const updateCheckAndPin = side => {
    const opSide = side === 'w' ? 'b' : 'w'
    const sideIndex = side === 'w' ? 0 : 1
    const kingPos = state.kingPos[sideIndex]

    const checkInfo = getCheckInfo(kingPos, side, isOccupied, getIsOccupiedBy, getPieceByPos)
    state.checkInfo[sideIndex] = checkInfo
    
    const {check} = checkInfo
    if(check.length > 0) {
      // state.isCheck[sideIndex] = true; 
      const rawKingAvailable = getPositions(side + 'ki', kingPos, isOccupied, getIsOccupiedBy, pawnShot, false, getPieceByPos)


      const isKingMovable = rawKingAvailable.filter(pos => 
        getIsCapturable(pos, side, isOccupied, getIsOccupiedBy, getPieceByPos) == false).length > 0

      const isCheckingPieceCapturable = check.length > 1 ? false :
        getIsCapturable(check[0].pos, opSide, isOccupied, getIsOccupiedBy, getPieceByPos)

      const isCheckingPieceBlockable = check.length > 1 ? false :
        check[0].path.filter(pos => 
          getIsCapturable(pos, opSide, isOccupied, getIsOccupiedBy, getPieceByPos, true)
        ).length > 0


      console.log(isKingMovable, isCheckingPieceCapturable, isCheckingPieceBlockable)
      if(!isKingMovable && !isCheckingPieceCapturable && !isCheckingPieceBlockable) {
        state.winner = opSide
      }
    }

  }


  // console.log(state.checkInfo)
  if(!getPieceByPos) { alert("wadafuq") }




  switch(action.type) {
    case "select_piece": {
      clearAvailable()
      const [piece, position] = action.payload

      const isWhite = piece.slice(0, 1) == "w" ? true : false;
      const side = piece[0]
      const sideIndex = isWhite ? 0 : 1
      if(isWhite !== state.isWhiteTurn) { return state; } // Check if player's turn

      // Deselect on double select
      if(state.selected && state.selected[0] == position[0] && state.selected[1] == position[1]) {
        return {...state, selected: null}
      }

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
        rawPositions.filter(pos => !getIsCapturable(pos, side, isOccupied, getIsOccupiedBy, getPieceByPos, false)) :
        null

      
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
        rawPositions

      availablePos.forEach(aPos => state.board[aPos[0]][aPos[1]].isAvailable = true)
      return {...state, selected: position}
    }

    case "move_piece": {
      const oldPos = state.selected
      const newPos = action.payload

      const sPiece = state.board[state.selected[0]][state.selected[1]].piece // Selected piece
      const side = sPiece.slice(0, 1)


      // Check if castling is requested, move the rook
      if(
        sPiece.slice(1) == 'ki' &&
        state.castlingAllowed[side == 'w' ? 0 : 1] &&
        (newPos[1] - oldPos[1] > 1 ||
        oldPos[1] - newPos[1] > 1)
      ) {
        const col = 7 - newPos[1] > newPos[1] ? 3 : 5
        state.board[newPos[0]][col].piece = side + 'r'
        state.board[newPos[0]][col == 3 ? 0 : 7].piece = ''
      }


      if(sPiece) { // Prevent strict mode from removing the piece from new position
        state.moves.positions.push([
          {piece: state.board[oldPos[0]][oldPos[1]].piece, pos: oldPos}, 
          {piece: state.board[newPos[0]][newPos[1]].piece, pos: newPos},
        ])
        state.board[newPos[0]][newPos[1]].piece = sPiece // Set selected piece to new position
        state.board[oldPos[0]][oldPos[1]].piece = '' // Remove selected piece from old position

        // Disable castling if king or rook moved
        if(sPiece.slice(1) == 'ki' || sPiece.slice(1) == 'r') { state.castlingAllowed[side == 'w' ? 0 : 1] = false }

        // Update king state position
        if(sPiece.slice(1) == 'ki') { state.kingPos[side == 'w' ? 0 : 1] = newPos }

        clearAvailable() // Clear available positions
        updateCheckAndPin('w'); 
        updateCheckAndPin('b');

        // console.log(getIsCapturable([7, 2], 'w', isOccupied, getIsOccupiedBy))
        switchTurn()
      }

      return {...state, selected: null} // Update state and deselect position
    }

    case "undo": {
      if(!state.moves.positions.length) return
      const lastMove = state.moves.positions[state.moves.positions.length - 1]
      const [newM, oldM] = lastMove
      // console.log(newM)
      // console.log(oldM)
      state.board[newM.pos[0]][newM.pos[1]].piece = newM.piece
      state.board[oldM.pos[0]][oldM.pos[1]].piece = oldM.piece

      return {...state, isWhiteTurn: !state.isWhiteTurn}
    }

    case "clear_select": return clearSelect()

    default: return state;
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, {
    board,
    selected: null,
    isWhiteTurn: true,
    castlingAllowed: [true, true], // Is Castling allowed [white, black]
    isCheck: [false, false], // Is check [white, black],
    checkInfo: [{check: [], pin: []}, {check: [], pin: []}],
    kingPos: [[7, 4], [0, 4]],
    pinned: [[], []],
    winner: '',
    moves: {
      uiList: [],
      positions: []
    }
  })

  const isCheck = state.checkInfo.map(obj => obj.check.length ? true : false)
  const handleUndo = () => dispatch({type: "undo"})


  return (
    <div className={styles.body}>
      <div className={styles.tmp} style={{background: isCheck[0] ? 'red' : 'green'}}></div>
      <div className={styles.tmp} style={{background: isCheck[1] ? 'red' : 'green'}}></div>
      <div className={styles.tmp} onClick={handleUndo}>UNDO</div>

      {
        state.winner ?
      <div className={styles.test}>
        <h1>Winner is {state.winner === 'w' ? "white" : "black"}</h1>
      </div> : null
      }

      <div className={styles.board}>
        {
          state.board.map((row, i) => (
            <div className={styles.boardRow} key={i}>
            {
              row.map((col, j) => 
                <Field 
                  key={i+j}
                  row={i}
                  col={j}
                  piece={col.piece}
                  selected={state.selected}
                  isAvailable={col.isAvailable}
                  dispatch={dispatch}
                />
              )
            }
            </div>
          )
          )
        }
      </div>
    </div>
  )
}