import styles from './Promotion.module.css'
import { PieceImg } from '../assets/PieceImg'

export default function Promotion({side, col, handlePromote}) {
    const row = side === 'w' ? 0 : 7;
    const promotionPieces = ['q', 'r', 'b', 'k']

    const style = {
        top: side === 'w' ? 0 : 'unset',
        bottom: side === 'b' ? 0 : 'unset',
        left: `calc(12.5% * ${col})`
    }


    return (
        <div className={styles.blockCurtain}>
            <div className={styles.body} style={style}>
            {
                (row ? promotionPieces.reverse() : promotionPieces).map(piece => 
                    <div 
                        key={side + piece} 
                        className={styles.promotionOption} 
                        onClick={() => handlePromote([row, col], side + piece)}
                    >
                        <PieceImg name={side + piece} />
                    </div>
                )
            }
            </div>
        </div>
    )
}