import styles from './Button.module.css'
import { Icon } from '../assets/PieceImg'

export default function Button({icon, text, handler}) {
    return (
        <button className={styles.ctrlBtn} onClick={handler}>
        {
            icon ?
                <span className={styles.ctrlBtnIcon}>
                    <Icon name={icon} />
                </span>
            : null
        }

            <h6 className={styles.ctrlBtnTxt}>{text}</h6>
        </button>
    )
}