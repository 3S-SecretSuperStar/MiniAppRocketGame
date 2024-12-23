/* eslint-disable react/prop-types */
import React, { memo, useContext, useEffect, useState, useRef } from 'react'
import { useAtom } from 'jotai'
import AppContext from './AppContext'
import { Img } from '../../assets/image'
import { ACCELERATION } from '../../utils/globals'
import { userData } from '../../store'
import "../../css/Game.css"
import { Link } from 'react-router-dom'
import FallGame from '../atom/fallGame'
import { REACT_APP_SERVER } from '../../utils/privateData';

export default memo(function Game({ gamePhase, finalResult, amount = 10.00,
  className, bet, autoStop, socketFlag, realGame, isWin, stopGame, startGame, autoMode, updateBalance, fallGameScore,
  betStopRef, gameStartSignal, setGamePhase, handleGameStarted, handleGameStopped, setSocketFlag, currentResult, setCurrentResult, gameRunning }) {

  const context = useContext(AppContext);
  const [user,] = useAtom(userData)
  const [timerHandler, setTimerHandler] = useState();
  const [countTimeHandler, setCountTimeHandler] = useState();
  const [counterNumber, setCounterNumber] = useState(0);
  const [timerRounded, setTimerRounded] = useState(0);
  const [counterFlag, setCounterFlag] = useState(false);
  const [isImgShow, setIsImgShow] = useState(false);
  const [saveLastScore, setSaveLastScore] = useState(0);
  const [planetPos, setPlanetPos] = useState({ x: -150, y: -300 });
  const [spaceFogPos, setSpaceFogPos] = useState({ y1: -170, y2: -1251 });

  const serverUrl = REACT_APP_SERVER;
  let gameRef = useRef(null)
  const counterItem = [Img.go, Img.counter1, Img.counter2, Img.counter3];
  let comment;
  let score = finalResult === 'Crashed...' ? 'Crashed...' : finalResult || currentResult

  const view = useRef(null);
  let gameId = (Math.random() * 10000) | 0;

  const gamePlay = () => {
    gameRef.current = new FallGame(gameId++, 1, bet);
    view.current.append(gameRef.current.view);
  }

  const gameStop = () => {
    if (gameRef.current) {
      setSaveLastScore(0)
      gameRef.current.destroy();
      gameRef.current = null;
    }
  }

  if (gamePhase === 'stopped') {
    score = 0;
    clearInterval(timerHandler)
  }

  useEffect(() => {
    if (gameRef.current) {
      gameRef.current.setAutoStop(currentResult);
    }
    if (currentResult > betStopRef && gamePhase === "started" && socketFlag) {
      stopGame(parseFloat(betStopRef));
    }
  }, [currentResult, gamePhase, autoMode])

  useEffect(() => {

    if (gamePhase === 'started') {
      setCurrentResult(1);
      setCounterNumber(4);
      setTimerRounded(0);
      let time = 0;
      comment = undefined
      score = 0;
      // Clear any existing interval before starting a new one
      if (countTimeHandler) {
        clearInterval(countTimeHandler);
      }

      // Set the interval for counting time
      if (!counterNumber) {
        const newCountTimeHandler = setInterval(() => {

          time += 0.015;
          setTimerRounded((prevRound) => prevRound + 0.61);
          const newCounterNumber = 5 - Math.ceil(time);

          // Check if the counter has reached zero
          if (newCounterNumber <= 0) {
            clearInterval(newCountTimeHandler); // Clear the interval when counter reaches zero
            setCounterNumber(0);// Ensure counter is set to zero
            setCounterFlag(true)
            gameStartSignal();
          } else {
            setCounterNumber(newCounterNumber);
          }
        }, 10);

        // Update the handler reference
        setCountTimeHandler(newCountTimeHandler);
      }
    } else if (gamePhase === 'stopped' || gamePhase === 'crashed') {
      gameStop();
      comment = null
      clearInterval(timerHandler)
      clearInterval(countTimeHandler);
      setCounterFlag(false);
      score = 0;
      if (counterNumber > 0) {
        setCounterNumber(0)
        setTimerRounded(0)
      }
    }
  }, [gamePhase])

  useEffect(() => {
    let timer = new Date().getTime();
    let isMounted = true;

    if (socketFlag && counterFlag) {
      setTimerHandler(setInterval(() => {
        let new_timer = new Date().getTime() - timer;
        if (isMounted) {
          try {
            setPlanetPos((prevPos) => ({
              x: (prevPos.x > window.innerWidth && prevPos.y > window.innerHeight) ? -150 : prevPos.x + (window.innerWidth) / 10000, // Create a new x position
              y: (prevPos.x > window.innerWidth && prevPos.y > window.innerHeight) ? -300 : prevPos.y + (window.innerHeight + 300) / 10000, // Create a new y position
            }));
            setSpaceFogPos((prevPos) => ({
              y1: prevPos.y1 > window.innerHeight ? prevPos.y2 - 1081 : prevPos.y1 + 0.15,
              y2: prevPos.y2 > window.innerHeight ? prevPos.y1 - 1081 : prevPos.y2 + 0.15
            }));
            setCurrentResult((ACCELERATION * new_timer * new_timer / 2 + 1).toFixed(2))
          } catch (e) {
            // eslint-disable-next-line no-self-assign
            document.location.href = document.location.href
          }
        }
      }, 1));
      gamePlay();
    }

  }, [counterFlag, socketFlag])

  useEffect(() => {
    if (gamePhase === 'stopped') {
      document.getElementById('stars1').style.animationPlayState =
        document.getElementById('stars2').style.animationPlayState =
        document.getElementById('stars3').style.animationPlayState =
        document.getElementById('stars').style.animationPlayState = 'paused'
    }
  }, [])

  useEffect(() => {
    if (gameRef.current) {
      fallGameScore.current = gameRef.current.getScore();
    }
  }, [score])

  useEffect(() => {
    if (fallGameScore.current > 0) {
      updateBalance(fallGameScore.current - saveLastScore)
      setSaveLastScore(fallGameScore.current)
    }
  }, [fallGameScore.current])

  const generateGauge = () => {
    const price = 0.5
    let first = price - currentResult % price
    first = !(currentResult % price) ? 0 : first
    const second = first + price
    const third = second + price
    let isFirstWide = currentResult % 1 > 0.5
    isFirstWide = currentResult < 1.1 ? true : isFirstWide
    const isThirdWide = isFirstWide
    const isSecondWide = !isFirstWide
    return (
      <div className={'relative h-[90%]'}>
        <div
          className={isFirstWide ? 'game-gauge-wide' : 'game-gauge-narrow '}
          style={{ bottom: first * 75 + '%' }}>
          {isFirstWide ? <span>x{Math.ceil(currentResult)}</span> : <></>}
        </div>
        <div
          className={isSecondWide ? 'game-gauge-wide' : 'game-gauge-narrow'}
          style={{ bottom: second * 75 + '%' }}>
          {isSecondWide ? <span>x{Math.ceil(currentResult)}</span> : <></>}
        </div>
        <div
          className={isThirdWide ? 'game-gauge-wide' : 'game-gauge-narrow'}
          style={{ bottom: third * 75 + '%' }}>
          {isThirdWide ? <span>x{Math.ceil(currentResult) + 1}</span> : <></>}
        </div>
      </div>
    )
  }

  if (typeof window !== 'undefined') {
    const animationState = (gamePhase === 'started' && counterNumber === 0 && socketFlag) ? 'running' : 'paused';

    const starsElements = ['stars1', 'stars2', 'stars3', 'stars'];

    starsElements.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.style.animationPlayState = animationState;
      }
    });

    try {
      if (currentResult >= 1.2) {
        document.getElementById('index-bottom-grid').classList.add('dark-mode')
        document.querySelectorAll('#index-operations > div:not(.dropdown), #index-operations span:not(.d-d)').forEach(item => { item.style.color = 'lightgray'; item.style.transition = 'color 2s' })
      } else {
        document.getElementById('index-bottom-grid').classList.remove('dark-mode')
        document.querySelectorAll('#index-operations > div:not(.dropdown), #index-operations span:not(.d-d)').forEach(item => { item.style.color = 'black' })
      }

      if (currentResult >= 1.2) {
        document.querySelector('footer').classList.add('dark-mode')
      } else {
        document.querySelector('footer').classList.remove('dark-mode')
      }
    } catch (e) {
    }
  }

  const comments = [Img.wow, Img.imgAmazing, Img.imgIncredible, Img.imgFantastic,
  Img.imgGreat, Img.imgRockrtStar, Img.imgBrilliant, Img.imgCrushing, Img.imgGenius,
  Img.imgImpressive, Img.imgUnstoppable, Img.imgGotThis, Img.imgFire];


  if (currentResult <= 0) comment = undefined
  else if (currentResult >= 2 && currentResult <= 2.5) {
    comment = comments[0]
  } else if (currentResult >= 3 && currentResult <= 3.5) {
    comment = comments[1]
  } else if (currentResult >= 4 && currentResult <= 4.6) {
    comment = comments[2]
  } else if (currentResult >= 5 && currentResult <= 5.6) {
    comment = comments[3]
  } else if (currentResult >= 6 && currentResult <= 6.7) {
    comment = comments[4]
  } else if (currentResult >= 7 && currentResult <= 7.8) {
    comment = comments[5]
  } else if (currentResult >= 8.1 && currentResult <= 9) {
    comment = comments[6]
  } else if (currentResult >= 9.6 && currentResult <= 10.5) {
    comment = comments[7]
  } else if (currentResult >= 11 && currentResult <= 12) {
    comment = comments[8]
  } else if (currentResult >= 13 && currentResult <= 14) {
    comment = comments[9]
  } else if (currentResult >= 15 && currentResult <= 16.5) {
    comment = comments[10]
  } else if (currentResult >= 17 && currentResult <= 19) {
    comment = comments[11]
  }

  if (currentResult >= 20 && (currentResult % 5 >= 3 && currentResult % 5 <= 5)) {
    comment = comments[12]
  }

  if (score.toString().indexOf('.') === -1) {
    score += '.00'
  }

  score = score === 'Crashed...' ? '' : `x${score}`

  useEffect(() => {
    if (isWin) {
      setIsImgShow(true);
      setTimeout(() => setIsImgShow(false), 1000)
    }
  }, [isWin])

  return (
    <div id='game' className={`${className} flex-auto flex flex-col h-fit justify-between items-center relative`}>
      <img
        src={Img.spaceFog}
        alt="spaceFog"
        width={589}
        height={1081}
        className={`max-w-[589px] h-[1081px] fixed`}
        style={{ top: `${spaceFogPos.y2.toString()}px` }}
      />
      <img
        src={Img.spaceFog}
        alt="spaceFog"
        width={589}
        height={1081}
        className={`max-w-[589px] h-[1081px] fixed`}
        style={{ top: `${spaceFogPos.y1.toString()}px` }}
      />
      <img
        src={Img.planet}
        alt="planet"
        width={300}
        height={300}
        className={`max-w-[300px] h-[300px] fixed`}
        style={{ top: `${planetPos.y.toString()}px`, right: `${planetPos.x.toString()}px` }}
      />
      <div className='top-0 left-0 fixed z-[1]' ref={view}></div>
      <div className='flex flex-col items-center justify-between'>
        <div className="flex gap-2 items-center justify-center font-extrabold z-10 ">
          <img src={Img.coin} width={44} height={44} className="max-w-11 h-11" alt="coin" />
          <p className="text-[40px] text-white font-extrabold">{parseFloat(amount).toFixed(2)}</p>
          <Link to={gameRunning ? "#" : '/help'} className={`bg-main w-8 h-8 rounded-lg p-1 ${gamePhase === 'started' && 'hidden'}`} >
            <img src="/image/icon/info.svg" width={24} height={24} className='max-w-6 h-6' alt="info" />
          </Link>
        </div>

        <img className={`absolute top-1/3 z-10 max-w-[108px] ${counterNumber > 0 && counterNumber < 1.2 ? "" : "hidden"}`} src={counterItem[0]} width="108px" height="102px" alt="counter number" />
        {
          counterNumber < 5 &&
            counterNumber > 1.2 ?
            <div className='absolute top-1/3 rounded-full flex text-gradient-border'>
              <div className='w-14 h-14 relative'>
                <svg viewBox="22 22 44 44" className='transform -rotate-90'>
                  <defs>
                    <linearGradient id="gradientBorder" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: "#FAD557", stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: "#FFFFFF", stopOpacity: 1 }} />
                    </linearGradient>
                  </defs>
                  <circle stroke="url(#gradientBorder)" cx="44" cy="44" r="20.2" fill="none" strokeWidth="2" style={{ strokeDasharray: 126.92, strokeDashoffset: `${126 - timerRounded}px` }}></circle>
                </svg>
                <div className='absolute left-1/2 top-1/2 transfrom -translate-x-1/2 -translate-y-1/2 text-2xl text-white font-black'>
                  {counterNumber - 1}
                </div>
              </div>
            </div> : ""
        }
        {
          gamePhase === 'started' && counterNumber === 0 && socketFlag &&
          <div className='text-2xl leading-7 mt-6 text-white font-roboto text-center score-position z-10'>{score}</div>
        }
        <div className='items-center justify-center h-fit absolute top-1/3 z-10'>
          {
            comment && gamePhase === "started" && counterNumber === 0 && 
            <img src={comment} height={43} className='max-w-fit h-11 z-20' alt='commet' />
          }
          {isImgShow && <img src={Img.youWon} height={43} className='max-w-fit h-11 z-20' alt="won" />}
        </div>
      </div>


      <div className='flex items-center z-10'>
        <img
          src='/image/rocket-active.png'
          className={`shaking game-rocket active ${(counterNumber === 0 && gamePhase === 'started' && socketFlag) ? 'block' : 'hidden'}`}
          alt='active rocket'
        />
        <img
          src='/image/rocket-explosed.png'
          className={`game-rocket explosed ${(!(counterNumber === 0 && gamePhase === 'started' && socketFlag) && gamePhase === "crashed") ? 'block' : "hidden"}`}
          alt='explosed rocket'
        />
        <img
          src='/image/rocket-inactive.png'
          className={`game-rocket inactive ${((counterNumber === 0 && gamePhase === 'started' && socketFlag) || gamePhase === "crashed") ? "hidden" : 'block'}`}
          alt='inactive rocket'
        />
      </div>

      <div id='game-gauge' className='left'>
        {generateGauge()}
      </div>
      <div id='game-gauge' className='right'>
        {generateGauge()}
      </div>
    </div>
  )
})
