import styles from './Field.module.css'
import { PieceImg } from '../assets/PieceImg'

export default function Field({ row, col, piece, selected, lastPlayed, isAvailable, isCheck, dispatch }) {
    
    const isSelected = selected ? (selected[0] == row && selected[1] == col) ? true : false : false
    const isLastPlayed = lastPlayed ? lastPlayed.find(pos => pos[0] === row && pos[1] === col) : false
    
    const clickHandler = e => {
        e.preventDefault()

        if(isAvailable) {
            dispatch({ type: "move_piece", payload: [[row, col]] })
        } else if(piece) {
            dispatch({ type: "select_piece", payload: piece ? [piece, [row, col]] : null })
        } else {
            dispatch({ type: "clear_select" })
        }
    }



    // Field style object calculation
    const side = (row + col) % 2 === 0 ? 'black' : "white"
    const style = {}

    if(isCheck) { style.background = `var(--alert)` }
    if(isLastPlayed) { style.background = `var(--prev-${side})` }
    if(isSelected) { style.background = `var(--selected-${side})` }



    return (
        <div className={`${styles.field} ${isAvailable ? styles.fieldAvailable : ""}`} style={style} onClick={clickHandler}>
            <span className={styles.img}>
                <PieceImg name={piece} />
            </span>

            {
            col === 0 ?
                <span className={`${styles.mark} ${styles.rowMark} p-16`}>{8 - row}</span> :
                null
            }

            {
            row === 7 ?
                <span className={`${styles.mark} ${styles.colMark} p-16`}>{String.fromCharCode(col + 65).toLowerCase()}</span> :
                null
            }
        </div>
    )
}