import { useMemo } from 'react'
import styles from './CapturedPieces.module.css'
import { Icon } from '../assets/PieceImg'

export default function CapturedPieces({pieces, side}) {
    const piecesArr = useMemo(() => Object.keys(pieces).map(key => 
        new Array(pieces[key]).fill(key)).flat(1), 
        [...Object.values(pieces)])

    const style = {color: side === 'w' ? 'gray' : 'black'}

    
    return (
        <div className={styles.body}>
        {
            piecesArr.map((piece, i) => 
                <span className={styles.sPiece} key={i} style={style}>
                    <Icon name={piece} />
                </span>
            )
        }
        </div>
    )
}