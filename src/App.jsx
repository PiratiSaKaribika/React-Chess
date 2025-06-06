import { useReducer } from 'react'
import styles from './App.module.css'

// Components
import Field from './Field';
import Promotion from './components/Promotion';

// Utils and Assets
import { board } from './boardDefault';
import { getPositions } from './utils/getPositions';
import { getCheckInfo, getIsCapturable } from './utils/getCapturableBy'




const reducer = (state, action) => {
  const getPieceByPos = pos => state.board[pos[0]][pos[1]].piece
  // const getPieceByPos = pos => { 
  //   if(typeof state.board[pos[0]] == 'undefined') {
  //     console.log(pos);
  //   }
  //   state.board[pos[0]][pos[1]].piece
  // }
  
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
      isCheck ?
      rawPositions.filter(pos => !getIsCapturable(pos, side, isOccupied, getIsOccupiedBy, getPieceByPos, false, true)) :
      rawPositions.filter(pos => !getIsCapturable(pos, side, isOccupied, getIsOccupiedBy, getPieceByPos)) :
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
      piece.slice(1) === 'ki' ?
      kingEscapePositions :
      rawPositions

    
    return availablePos
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




  const updateMoveHistory = (oldPos, newPos) => {
    const { current } = state.moves
    const getUiMove = pos => [String.fromCharCode(pos[1] + 65), pos[0] + 1].join('')

    if(current < state.moves.positions.length - 1) {
      alert("CUT")
      state.moves.positions = state.moves.positions.slice(0, current + 1)
      state.moves.uiList = state.moves.uiList.slice(0, current + 1)
    }

    state.moves.positions.push([
      {piece: state.board[oldPos[0]][oldPos[1]].piece, pos: oldPos}, 
      {piece: state.board[newPos[0]][newPos[1]].piece, pos: newPos},
    ])

    // state.moves.uiList.push(oldPos.join('-'), newPos.join('-'))
    state.moves.uiList.push([getUiMove(oldPos), getUiMove(newPos)].join('-'))

    state.moves.current = state.moves.current + 1;
  }


  const updateIsStalemate = () => {
    let isStalemate = [true, true];
    state.board.forEach((line, row) => line.forEach((field, col) => {
      const sideIndex = field.piece[0] === 'w' ? 0 : 1
      if(!field.piece || !isStalemate[sideIndex]) return

      if(getAvailablePostions([row, col], field.piece).length) { isStalemate[field.piece[0] === "w" ? 0 : 1] = false }
    }))


    if(isStalemate[0] || isStalemate[1]) { state.winner = 's' }
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


      // console.log(isKingMovable, isCheckingPieceCapturable, isCheckingPieceBlockable)
      if(!isKingMovable && !isCheckingPieceCapturable && !isCheckingPieceBlockable) {
        state.winner = opSide
      }
    }
  }


  // Update all the state logic after played move - mate, stalemate and switch turn
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





  switch(action.type) {
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
        (newPos[1] - oldPos[1] > 1 ||
        oldPos[1] - newPos[1] > 1)
      ) {
        const col = 7 - newPos[1] > newPos[1] ? 3 : 5
        state.board[newPos[0]][col].piece = side + 'r'
        state.board[newPos[0]][col == 3 ? 0 : 7].piece = ''
      }


      if(sPiece) { // Prevent strict mode from removing the piece from new position
        updateMoveHistory(oldPos, newPos)

        state.board[newPos[0]][newPos[1]].piece = sPiece // Set selected piece to new position
        state.board[oldPos[0]][oldPos[1]].piece = '' // Remove selected piece from old position



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
        if(updatePromotion()) { return {...state} }
        

        updateBundle()
      }

      return {...state, selected: null} // Update state and deselect position
    }


    case "undo": {
      if(state.moves.current === -1) return {...state}
      
      const [newMove, oldMove] = state.moves.positions[state.moves.current]
      
      // Update old state to calculate check and pin info
      state.board[newMove.pos[0]][newMove.pos[1]].piece = newMove.piece
      state.board[oldMove.pos[0]][oldMove.pos[1]].piece = oldMove.piece

      const newState = {
        ...state, 
        moves: {...state.moves, current: state.moves.current - 1},
        isWhiteTurn: !state.isWhiteTurn,
        winner: '',
        checkInfo: [
          getCheckInfo(state.kingPos[0], 'w', isOccupied, getIsOccupiedBy, getPieceByPos),
          getCheckInfo(state.kingPos[1], 'b', isOccupied, getIsOccupiedBy, getPieceByPos)
        ],
        board: state.board.map((rank, row) => rank.map((field, col) => 
          comparePos(newMove.pos, [row, col]) ?
            ({...field, piece: newMove.piece}) :
          comparePos(oldMove.pos, [row, col]) ?
            ({...field, piece: oldMove.piece}) :
          field
        ))
      }

      return newState;

      
      // OLD SOLUTION - not used because of react strict mode problems
      //
      // const [newPos, oldPos] = state.moves.positions[state.moves.current]
      // state.board[newPos.pos[0]][newPos.pos[1]].piece = newPos.piece
      // state.board[oldPos.pos[0]][oldPos.pos[1]].piece = oldPos.piece
      
      // state.moves.current = state.moves.current - 1
      // state.isWhiteTurn = !state.isWhiteTurn

      // updateCheckAndPin('w'); 
      // updateCheckAndPin('b');
      
      // return {...state}
    }




    case "promote_pawn": {
      if(!Object.keys(state.promotion).length) return {...state}; // Prevent strict mode
      const {pos, piece} = action.payload;
    
      modifyFieldPiece(pos, piece);
      state.promotion = {};
      updateBundle()
      
      return {...state};
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
    castlingAllowed: [[true, true], [true, true]], // Is Castling allowed [white: [left. right], black: [left, right]]
    isCheck: [false, false], // Is check [white, black],
    checkInfo: [{check: [], pin: []}, {check: [], pin: []}],
    kingPos: [[7, 4], [0, 4]],
    pinned: [[], []],
    winner: '',
    moves: {
      uiList: [],
      positions: [],
      current: -1
    },
    promotion: {} // {side, col}
  })


  const isCheck = state.checkInfo.map(obj => obj.check.length ? true : false)
  const handleUndo = () => dispatch({type: "undo"})

  const handlePromote = (pos, piece) => dispatch({type: "promote_pawn", payload: {pos, piece}})

  const uiMoveList = state.moves.current >= 0 ? state.moves.uiList.slice(0, state.moves.current + 1) : null


  return (
    <div className={styles.body}>
      <div className={styles.tmp} style={{background: isCheck[0] ? 'red' : 'green'}}></div>
      <div className={styles.tmp} style={{background: isCheck[1] ? 'red' : 'green'}}></div>
      <div className={styles.tmp} onClick={handleUndo}>UNDO</div>

      {
        state.winner ?
      <div className={styles.test}>
      {
        state.winner === 's' ?
        <h1>Stalemate</h1> :
        <h1>Winner is {state.winner === 'w' ? "white" : "black"}</h1>
      }
      </div> : null
      }


      <div className={styles.main}>
        <div className={styles.game}>
          <div className={styles.playerInfo}>
            <div className={styles.capturedPieces}>
              PLACEHOLDER
            </div>

            <div className={styles.timer}>
              <h4 className={styles.timerContent}>
                10:00
              </h4>
            </div>
          </div>

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

            {
            Object.keys(state.promotion).length > 0 ?
              <Promotion 
                side={state.promotion.side}
                col={state.promotion.col}
                handlePromote={handlePromote}
              /> : null
            }
          </div>



          <div className={styles.playerInfo}>
            <div className={styles.capturedPieces}>
              PLACEHOLDER
            </div>

            <div className={styles.timer}>
              <h4 className={styles.timerContent}>
                10:00
              </h4>
            </div>
          </div>
        </div>

        <div className={styles.sidebar}>
          <ul className={styles.movesList}>
          {
          uiMoveList ? uiMoveList.map(move =>
            <li className={styles.sMove}>
              <h4>{move}</h4>
            </li>
          ) : null
          }
            {/* <li className={styles.sMove}>
              <h4>e2 - e4</h4>
            </li> */}
          </ul>

          <div className={styles.ctrlsCont}>
            <button className={`${styles.ctrlBtn} ${styles.ctrlBtnUndo}`}>
              undo
            </button>

            <button className={`${styles.ctrlBtn} ${styles.ctrlBtnRedo}`}>
              redo
            </button>

            <button className={`${styles.ctrlBtn} ${styles.ctrlBtnRestart}`}>
              restart
            </button>
          </div>
        </div>
      </div>


    </div>
  )
}