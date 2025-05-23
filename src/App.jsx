import { useReducer } from 'react'
import styles from './App.module.css'

// Components
import Field from './Field';

// Utils and Assets
import { board } from './boardDefault';
import { getPositions } from './utils/getPositions';
import { getCapturableBy, getIsCapturable } from './utils/getCapturableBy'



// const castlingAllowed = useRef([true, true]) // is Castling allowed [white, black]

const reducer = (state, action) => {
  const getPieceByPos = pos => state.board[pos[0]][pos[1]].piece
  
  const comparePos = (pos1, pos2) => pos1[0] == pos2[0] && pos1[1] == pos2[1]

  const isOccupied = (pos, side) => { // Check if position is occupied by another piece and if capturable
    const boardPiece = getPieceByPos(pos)
    
    if(boardPiece) {
      if(boardPiece[0] === side) return 1 // Player's piece
      return -1 // Opponent's piece
    }

    return 0 // Empty space
  }


  const getIsOccupiedBy = (pos, piece) => state.board[pos[0]][pos[1]].piece == piece
  // const getIsOccupiedBy = (pos, piece) => getPieceByPos(pos) == piece

  const pawnShot = (pos, side) => {
    const [row, col] = pos
    const res = new Array()

    if(state.board[row][col-1] && state.board[row][col-1].piece && state.board[row][col-1].piece[0] != side) { res.push([row, col-1]) }
    if(state.board[row][col+1] && state.board[row][col+1].piece && state.board[row][col+1].piece[0] != side) { res.push([row, col+1]) }

    return res
  }


  const getIsCapturableByPawn = (pos, side) => {
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




  // Switch to next player turn
  const switchTurn = () => { state.isWhiteTurn = !state.isWhiteTurn }

  // Clear selected position (clear all action)
  const clearSelect = () => ({...state, selected: null, board: state.board.map(row => { // Clear selected position
    return row.map(col => ({...col, isAvailable: false}))
  })})

  // Clear availables (of previous action)
  const clearAvailable = () => state.board.forEach(row => { row.forEach(col => col.isAvailable = false) })




  
  const updateCheckAndPin = side => {
    const opSide = side == 'w' ? 'b' : 'w'
    const sideIndex = side == 'w' ? 0 : 1
    const kingPos = state.kingPos[sideIndex]

    let isCheck, pinPosArr = [];
    const pieces = ['r', 'b', 'k', 'q']

    pieces.forEach(piece => {
      const {isCapturable, pinned} = getCapturableBy(opSide + piece, kingPos, isOccupied, getIsOccupiedBy)
      
      if(isCapturable) { isCheck = isCapturable }
      if(pinned && pinned.pinPos) { pinPosArr.push(pinned) }
    })

    if(!isCheck && getIsCapturableByPawn(kingPos, side)) { isCheck = true; }

    state.isCheck[sideIndex] = isCheck
    state.pinned[sideIndex] = pinPosArr
  }



  switch(action.type) {
    case "select_piece": {
      clearAvailable()
      const [piece, position] = action.payload

      const isWhite = piece.slice(0, 1) == "w" ? true : false;
      const sideIndex = isWhite ? 0 : 1
      if(isWhite !== state.isWhiteTurn) { return state; } // Check if player's turn

      // Deselect on double select
      if(state.selected && state.selected[0] == position[0] && state.selected[1] == position[1]) {
        return {...state, selected: null}
      }


      // Get all available positions (by pattern)
      const rawPositions = getPositions(piece, position, isOccupied, pawnShot, state.castlingAllowed[sideIndex]); 

      // Get available positions for pinned piece
      const pinned = state.pinned[sideIndex].length ? 
        state.pinned[sideIndex].find(obj => comparePos(obj.pinPos, position)) :
        null

      
      // Get final available positons
      const availablePos = pinned ?
        pinned.available.filter(pos => rawPositions.find(aPos => comparePos(pos, aPos))) :
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
        state.board[newPos[0]][newPos[1]].piece = sPiece // Set selected piece to new position
        state.board[oldPos[0]][oldPos[1]].piece = '' // Remove selected piece from old position

        // Disable castling if king or rook moved
        if(sPiece.slice(1) == 'ki' || sPiece.slice(1) == 'r') { state.castlingAllowed[side == 'w' ? 0 : 1] = false }

        // Update king state position
        if(sPiece.slice(1) == 'ki') { state.kingPos[side == 'w' ? 0 : 1] = newPos }

        clearAvailable() // Clear available positions
        updateCheckAndPin('w'); 
        updateCheckAndPin('b');

        console.log(getIsCapturable([7, 2], 'w', isOccupied, getIsOccupiedBy))
        switchTurn()
      }

      return {...state, selected: null} // Update state and deselect position
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
    isCheck: [false, false], // Is check [white, black]
    kingPos: [[7, 4], [0, 4]],
    pinned: [[], []]
  })

  return (
    <div className={styles.body}>
      <div className={styles.tmp} style={{background: state.isCheck[0] ? 'red' : 'green'}}></div>
      <div className={styles.tmp} style={{background: state.isCheck[1] ? 'red' : 'green'}}></div>

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