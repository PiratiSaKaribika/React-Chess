import { useMemo, memo } from 'react'
import styles from './CapturedPieces.module.css'
import { Icon } from '../assets/PieceImg'

export default function CapturedPieces({pieces, side}) {
    const piecesArr = useMemo(() => Object.keys(pieces).filter(arr => pieces[arr]).map(key => 
        new Array(pieces[key]).fill(key)), 
    [...Object.values(pieces)])

    const style = {color: side === 'w' ? 'var(--gray-900)' : 'var(--gray-300)'}

    
    return (
        <div className={styles.body}>
        {
            piecesArr.map((group, i) => 
                <div className={styles.pieceGroup} key={i}>
                {
                    group.map((piece, j) => 
                        <span className={styles.sPiece} key={j} style={style}>
                            <Icon name={piece} />
                        </span>
                    )
                }
                </div>
            )
        }
        </div>
    )
}