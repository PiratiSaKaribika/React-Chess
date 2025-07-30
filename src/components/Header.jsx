import styles from './Header.module.css'
import { Icon } from '../assets/PieceImg'


export default function Header() {
    return (
        <header>
            <a className={styles.headerLink} href="https://github.com/PiratiSaKaribika/React-Chess" target="_blank">
                <span className={styles.headerIcon}>
                <Icon name="github" />
                </span>
                
                <h6 className={styles.headerLinkText}>github</h6>
            </a>

            <a className={styles.headerLink} href="/" target="_blank">
                <span className={styles.headerIcon}>
                <Icon name="linkedin" />
                </span>
                
                <h6 className={styles.headerLinkText}>linkedin</h6>
            </a>

            <a className={styles.headerLinkCta} href="/" target="_blank">
                <h6 className={styles.headerLinkCtaText}>Visit my portfolio</h6>
            </a>
        </header>
    )
}