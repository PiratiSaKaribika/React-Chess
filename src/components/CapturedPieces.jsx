import { useMemo, memo } from 'react'
import styles from './CapturedPieces.module.css'
import { Icon } from '../assets/PieceImg'

export default function CapturedPieces({pieces, side}) {
    // const piecesArr = useMemo(() => Object.keys(pieces).map(key => 
    //     new Array(pieces[key]).fill(key)).flat(1), 
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



// const CapturedPieces = memo(function ({pieces, side}) {
//     const piecesArr = useMemo(() => Object.keys(pieces).map(key => 
//         new Array(pieces[key]).fill(key)).flat(1), 
//         [...Object.values(pieces)])

//     const style = {color: side === 'w' ? 'var(--gray-900)' : 'var(--gray-300)'}
//     console.log(piecesArr)

    
//     return (
//         <div className={styles.body}>
//         {
//             piecesArr.map((piece, i) => 
//                 <span className={styles.sPiece} key={i} style={style}>
//                     <Icon name={piece} />
//                 </span>
//             )
//         }
//         </div>
//     )
// })

// export default CapturedPieces