import Curtain from "./Curtain"
import Field from "./Field"
import Promotion from "./Promotion"

import styles from './Board.module.css'


export default function Board({ state, dispatch, startGame, handlePromote }) {
    
    // boolean array is check [white, black]
    const isCheckArr = state.checkInfo.map(obj => obj.check.length ? true : false)

    // get is king checked and it is king's field
    const getIsCheck = (piece) => {
        const side = piece[0]
        const sideIndex = side === 'w' ? 0 : 1
        return isCheckArr[sideIndex] && piece === side + 'ki'
    }


    return (
        <div className={styles.board}>
            <Curtain winner={state.winner} startGame={startGame} />
            
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
                        lastPlayed={state.lastPlayed}
                        isAvailable={col.isAvailable}
                        dispatch={dispatch}
                        isCheck={getIsCheck(col.piece)}
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
    )
}