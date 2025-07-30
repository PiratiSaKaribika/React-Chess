import { memo } from "react"
import styles from './Curtain.module.css'
import Button from "./Button"

export default memo(function Curtain({winner, startGame}) {
    const isVisible = winner !== ''

    return (
        <div className={styles.curtain} style={{display: isVisible ? 'block' : 'none'}}>
            <div className={styles.box}>
                {
                winner ?
                    winner === 's' ?
                    <h4>Stalemate</h4> :
                    <h4>Winner is {winner === 'w' ? "white" : "black"}</h4>
                : <h4>Choose game mode</h4>
                }

                <div className={styles.timerOptions}>
                    {/* <button 
                    className={styles.sTimeOption}
                    onClick={() => startGame(60)}
                    >
                    <h6>1 minute</h6>
                    </button>

                    <button 
                    className={styles.sTimeOption}
                    onClick={() => startGame(300)}
                    >
                    <h6>5 minute</h6>
                    </button>

                    <button 
                    className={styles.sTimeOption}
                    onClick={() => startGame(600)}
                    >
                    <h6>10 minute</h6>
                    </button> */}
                    <Button 
                        text="1 min"
                        handler={() => startGame(60)}
                    />
                    <Button 
                        text="5 min"
                        handler={() => startGame(300)}
                    />
                    <Button 
                        text="10 min"
                        handler={() => startGame(600)}
                    />
                </div>
            </div>
        </div>
    )
})