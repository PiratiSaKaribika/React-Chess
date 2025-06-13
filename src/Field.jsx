import styles from './Field.module.css'
import { PieceImg } from './assets/PieceImg'

export default function Field({ row, col, piece, selected, isAvailable, dispatch }) {
    
    const isSelected = selected ? (selected[0] == row && selected[1] == col) ? true : false : false
    const letter = row === 7 ? Number.toString(col) : null
    
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
    const style = {}
    if(isSelected) { style.background = "red" }
    if(isAvailable) { style.background = "yellow" }
    


    // console.log("RENDERED")

    return (
        <div className={styles.field} style={style} onClick={clickHandler}>
            <span className={styles.img}>
                <PieceImg name={piece} />
            </span>

            {
            col === 0 ?
                <span className={`${styles.mark} ${styles.rowMark}`}>{8 - row}</span> :
                null
            }

            {
            row === 7 ?
                <span className={`${styles.mark} ${styles.colMark}`}>{String.fromCharCode(col + 65).toLowerCase()}</span> :
                null
            }
        </div>
    )
}