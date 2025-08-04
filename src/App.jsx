import { useState, useRef, useEffect } from 'react'
import styles from './App.module.css'

// Reducer
import ChessReducer from './ChessReducer';

// Components
import Header from './components/Header';
import CapturedPieces from './components/CapturedPieces';
import Button from './components/Button';
import Board from './components/Board';

// Assets
import { Icon } from './assets/PieceImg';



export default function App() {
  
  const {state, dispatch} = ChessReducer()



  // TIMER

  const [timersValues, setTimersValues] = useState([null, null])  
  
  const checkTimeout = (index, value) => {
    if(value > 0) return;
    dispatch({type: "timeout", payload: index})
  }

  const decrementTimer = () => setTimersValues(prev => {
    const index = state.isWhiteTurn ? 0 : 1;
    const newVal = prev[index] - 1;

    checkTimeout(index, newVal)
    const result = [...prev]
    result[index] = newVal;

    return result
  })

  const getFormattedTimerValue = index => {
    const raw = timersValues[index]

    let minutes = String(Number.parseInt(raw / 60))
    if(minutes.length === 1) minutes = '0' + minutes

    let seconds = String(raw % 60)
    if(seconds.length === 1) seconds = '0' + seconds

    return minutes + ":" + seconds;
  }

  const timer = useRef(null)


  
  // const isCheck = state.checkInfo.map(obj => obj.check.length ? true : false)
  
  const uiMoveList = state.history.current < state.history.moves.length ?
    state.history.uiMoveList.slice(0, state.history.current) :
    state.history.uiMoveList

  
  const isHistoryCtrlsDisabled = state.winner || timersValues[0] === null || timersValues[1] === null




  const handlePromote = (pos, piece) => dispatch({type: "promote_pawn", payload: {pos, piece}})
    
  const handleUndo = () => dispatch({type: "undo"})
  const handleRedo = () => dispatch({type: "redo"})


  const startGame = time => {
    setTimersValues([time, time])
    dispatch({type: "start_game"})
  }

  const restartGame = () => {
    setTimersValues([null, null])
    dispatch({type: "restart_game"})
  }
  
  const resign = () => {
    setTimersValues([null, null])
    dispatch({type: "resign"})
  }



  // Timer useEffect
  
  useEffect(() => {
    const handleInterval = () => {
      if(state.winner) {
        clearInterval(timer.current)
        timer.current = null
        return;
      }

      if(!timer.current && timersValues[0] !== null && timersValues[1] !== null) {
        timer.current = setInterval(() => decrementTimer(), 1000)
      }
    }


    handleInterval();

    return () => {
      clearInterval(timer.current)
      timer.current = null
    }
  }, [state.isWhiteTurn, state.winner])


  return (
    <div className={styles.body}>
      <Header />

      <div className={styles.main}>
        <div className={styles.game}>
          <div className={styles.playerInfo}>
            <div className={styles.capturedPieces}>
              <CapturedPieces side='b' pieces={state.captured[1]} />
            </div>

            <div className={`${styles.timer} ${state.isWhiteTurn ? styles.timerInactive : ""}`}>
              <h5 className={styles.timerContent}>
                {getFormattedTimerValue(1)}
              </h5>
            </div>
          </div>

          <Board 
            state={state} 
            dispatch={dispatch} 
            startGame={startGame} 
            handlePromote={handlePromote}
          />


          <div className={styles.playerInfo}>
            <div className={styles.capturedPieces}>
              <CapturedPieces side='w' pieces={state.captured[0]} />
            </div>

            <div className={`${styles.timer} ${state.isWhiteTurn ? "" : styles.timerInactive}`}>
              <h5 className={styles.timerContent}>
                {getFormattedTimerValue(0)}
              </h5>
            </div>
          </div>
        </div>

        <div className={styles.sidebar}>
          <ul className={styles.movesList}>
          {
          uiMoveList ? uiMoveList.map((move, i) =>
            <li className={styles.sMove} key={i}>
              <h6>{i + 1}.</h6>
              <p>{move}</p>
            </li>
          ) : null
          }
          </ul>

          <div className={styles.ctrlsCont}>
            <Button 
              icon="resign"
              text="resign"
              handler={resign}
            />

            <Button 
              icon="restart"
              text="restart"
              handler={restartGame}
            />

            <button className={`${styles.ctrlBtnHistory}`} onClick={handleUndo} disabled={isHistoryCtrlsDisabled}>
              <span className={styles.ctrlBtnIcon}>
                <Icon name="arrowLeft" />
              </span>
            </button>

            <button className={`${styles.ctrlBtnHistory}`} onClick={handleRedo} disabled={isHistoryCtrlsDisabled}>
              <span className={styles.ctrlBtnIcon}>
                <Icon name="arrowRight" />
              </span>
            </button>
          </div>
        </div>
      </div>


    </div>
  )
}