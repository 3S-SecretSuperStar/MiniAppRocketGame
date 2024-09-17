import React, { useState, useContext, useRef, useEffect, Suspense } from "react";
import { json, useNavigate } from "react-router";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAtom } from "jotai";
import InfoModal from "../component/atom/infoModel.jsx";
import PannelScore from "../component/atom/PannelScore";
import SettingModal from "../component/atom/setting-modal.jsx";
import ShadowButton from "../component/atom/shadow-btn.jsx";
import SwitchButton from "../component/atom/switchButtton.jsx";
import SwitchButtonOption from "../component/atom/switchButtonOption.jsx";
import SettingButton from "../component/svg/button_setting.jsx";
import NavPlay from "../component/svg/nav_play.jsx";
import AppContext from "../component/template/AppContext.jsx";
import InputNumber from "../component/template/InputNumber";
import Game from '../component/template/Game.jsx'
import { cn } from "../utils/index.js";
import { isActionState, realGameState, TaskContent, userData } from "../store";
import { avatar } from "../assets/avatar";
import { Img } from "../assets/image";
import { RANKINGDATA } from "../utils/globals.js";
import { REACT_APP_SERVER } from "../utils/privateData.js";
import Contact from "../component/molecules/contact.jsx";
import rewardBG from "../assets/image/reward_bg.png"
import "../css/Style.css"
import TabButton from "../component/atom/tab-button.jsx";
import AutoIcon from "../component/svg/auto-icon.jsx";
import FetchLoading from "../component/template/FetchLoading.jsx";
import { LazyLoadImage } from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/blur.css'

const MainPage = () => {

  const serverUrl = REACT_APP_SERVER;
  const operationOption = ['Return to base Bet', 'Increase Bet by'];
  // State variables
  const [autoMode, setAutoMode] = useState(false);
  const [autoStop, setAutoStop] = useState(5);
  const [balance, setBalance] = useState(userData.balance);
  const [bet, setBet] = useState(1);
  const context = useContext(AppContext);
  const [finalResult, setFinalResult] = useState(0);
  const [firstLogin, setFirstLogin] = useState(false);
  const [gamePhase, setGamePhase] = useState();
  const [games, setGames] = useState(0);
  const [historyGames, setHistoryGames] = useState([]);
  const [isAction, setActionState] = useAtom(isActionState);
  const [infoState, setInfoState] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [losses, setLosses] = useState(0);
  const [lostCoefficient, setLostCoefficient] = useState(1);
  const [, setLoaderIsShown] = useState();
  const [operationAfterLoss, setOperationAfterLoss] = useState('Increase Bet by');
  const [operationAfterWin, setOperationAfterWin] = useState('Return to base Bet');
  const [rewardState, setRewardState] = useState(false);
  const [stopWasPressed, setStopWasPressed] = useState(false);
  const [winCoefficient, setWinCoefficient] = useState(1);
  const [wins, setWins] = useState(0);
  const [socketStart, setSocketStart] = useState(false);
  const [isReal, setRealGame] = useAtom(realGameState);
  const [user, setUser] = useAtom(userData);
  const [winState, setWinstate] = useState(false);
  const [taskList, setTaskList] = useAtom(TaskContent)
  const [continueCounter, setCointinueCounter] = useState(1)
  const [autoStopAM, setAutoStopAM] = useState(autoStop);
  const [autoStopManual, setAutoStopManual] = useState(autoStop);
  let performTask = [];
  let testCounter = 0;
  let realBet = 0;



  // Refs for mutable state
  const balanceRef = useRef(balance);
  const historyGamesRef = useRef(historyGames);
  const betAutoRef = useRef(bet);
  const betManualRef = useRef(bet)
  const operationAfterWinRef = useRef(operationAfterWin);
  const valueAfterWinRef = useRef(winCoefficient);
  const operationAfterLossRef = useRef(operationAfterLoss);
  const valueAfterLossRef = useRef(lostCoefficient);
  const navigate = useNavigate();
  const [tabId, setTabId] = useState(1);
  const [loading, setLoading] = useState(true)
  const [firstLoading, setFirstLoading] = useState(true);
  // const [isAutoStart, setAutoStart] = useAtom(isAutoState);

  const avatarData = [avatar.avatarBeginner, avatar.avatarPilot, avatar.avatarExplorer,
  avatar.avatarAstronaut, avatar.avatarCaptain, avatar.avatarCommander, avatar.avatarAdmiral,
  avatar.avatarLegend, avatar.avatarMasterOfTheUniverse, avatar.avatarGodOfSpace]

  const statsList = [
    {
      src: "coin-y.svg",
      amount: user.Balance,
      id: 1
    },
    {
      src: "token.png",
      amount: 0,
      id: 2
    }
  ]


  const handleModalButton = () => {
    startGame();
    // setAutoStart(true)
    setIsModalOpen(false);

  }

  const handleStartButton = () => {

    startGame()
  }
  // setRealGame(true)
  // Effect to validate and adjust state values
  useEffect(() => {
    if (gamePhase !== 'started') {
      if (bet < 1) {
        setBet(1);
        betAutoRef.current = 1;
        betManualRef.current = 1;
      } else if (bet > balance && balance !== '0.00') {
        setBet(parseFloat(balance));
        betAutoRef.current = parseFloat(balance)
        betManualRef.current = parseFloat(balance)
      }

      if (autoStop < 1.1) {
        setAutoStop(1.1)
      } else if (autoStop > 100) {
        setAutoStop(100)
      }

      if (balance === 0) {
        setBalance('0.00')
      }

      if (winCoefficient < 1) {
        setWinCoefficient(1)
      }

      if (winCoefficient > 100) {
        setWinCoefficient(100)
      }

      if (lostCoefficient < 1) {
        setLostCoefficient(1)
      }

      if (lostCoefficient > 100) {
        setLostCoefficient(100)
      }
    }
  }, [bet, autoStop, balance, lostCoefficient, winCoefficient]);


  useEffect(() => {
    operationAfterWinRef.current = operationAfterWin;
    valueAfterWinRef.current = winCoefficient;
    operationAfterLossRef.current = operationAfterLoss;
    valueAfterLossRef.current = lostCoefficient;
  }, [operationAfterWin, winCoefficient, operationAfterLoss, lostCoefficient]);
  useEffect(() => {

  }, [context.socket])

  useEffect(() => {
    let isMounted = true
    if (gamePhase !== 'started' && autoMode && !stopWasPressed && balanceRef.current >= betAutoRef.current && betAutoRef.current) {
      if (isMounted) {
        try {
          setTimeout(() => {
            setStopWasPressed(false);
            setGamePhase('started')
            setSocketStart(false);
            setActionState("start");
            context.socket.onmessage = async e => {
              const data = JSON.parse(e.data);
              console.log("Data", data.operation);
              switch (data.operation) {
                case 'started':
                  setSocketStart(true)
                  handleGameStarted();
                  break;
                case 'stopped':
                  handleGameStopped(data);
                  break;
                case 'crashed':
                  handleGameCrashed(data);
                  break;
                default:
                  break;
              }
            };
          }, 1000)
        } catch (e) {
          // eslint-disable-next-line no-self-assign
          document.location.href = document.location.href
        }
      }
    }
    return () => { isMounted = false }
  }, [historyGames])

  const getProfilePhotos = async (userId, bot_token) => {
    try {
      const profilesResponse = await fetch(`https://api.telegram.org/bot${bot_token}/getUserProfilePhotos?user_id=${userId}`);
      const profiles = await profilesResponse.json();
      console.log("profiles :", profiles);

      if (profiles.result.photos.length > 0) {
        const fileResponse = await fetch(`https://api.telegram.org/bot${bot_token}/getFile?file_id=${profiles.result.photos[0][2].file_id}`);
        const filePath = await fileResponse.json();
        console.log("fileInfo:", filePath)
        const userAvatarUrl = `https://api.telegram.org/file/bot${bot_token}/${filePath.result.file_path}`;
        return userAvatarUrl;
      } else {
        console.log('No profile photos found.');
      }
    } catch (error) {
      console.error('Error fetching profile photos:', error);
    }
  };

  const updateAvatar = async (userAvatarUrl, userId) => {
    try {
      const headers = new Headers()
      headers.append('Content-Type', 'application/json')
      const updateAvatar = await fetch(`${serverUrl}/update_avatar`, { method: 'POST', body: JSON.stringify({ userId: userId, userAvatarUrl: userAvatarUrl }), headers })
      return updateAvatar;
    } catch (e) {
      console.log(e)
    }
  }
  useEffect(() => {
    const headers = new Headers()
    headers.append('Content-Type', 'application/json')
    fetch(`${serverUrl}/get_task`, { method: 'POST', body: JSON.stringify({}), headers })
      .then(res => Promise.all([res.status, res.json()]))
      .then(([status, data]) => {
        try {
          const taskDataItem = data.task;
          setTaskList(taskDataItem.map((task) => {
            return { type: task.type, count: task.count, index: task.index }
          }))
        } catch (e) {
          console.log(e);
        }
      })
  }, [])
  useEffect(() => {
    // setLoading(true)
    async function fetchData() {
      try {
        const webapp = window.Telegram.WebApp.initDataUnsafe;
        let isMounted = true
        const bot_token = '7379750890:AAGYFlyXnjrC8kbyxRdYhUbisoTbCWdPCg8'
        if (webapp) {
          const lastName = webapp["user"]["last_name"] && (" " + webapp["user"]["last_name"]);

          const realName = webapp["user"]["first_name"] + lastName;
          const userName = webapp["user"]["username"];
          const userId = webapp["user"]["id"];
          const userInfo = webapp["user"];
          const historySize = 100;
          let gamesHistory = { real: [], virtual: [] }
          console.log("uerInfo: ", userInfo)
          const headers = new Headers()
          headers.append('Content-Type', 'application/json')
          if (isMounted) {
            const userAvatarUrl = await getProfilePhotos(userId, bot_token);
            const updateAvatarState = await updateAvatar(userAvatarUrl, userId);
            console.log(userAvatarUrl)
            console.log("userAvatarUrl ", updateAvatarState.url)

            fetch(`${serverUrl}/users_info`, { method: 'POST', body: JSON.stringify({ realName: realName, userName: userName, userAvatarUrl: userAvatarUrl, userId: userId }), headers })
              .then(res => Promise.all([res.status, res.json()]))
              .then(([status, data]) => {
                try {
                  console.log(data)
                  console.log(realName)
                  console.log(data.userData)
                  const myData = data.userData;



                  const realWins = myData.gamesHistory.real.filter(j => j.crash === 'x').length
                  const realLosses = myData.gamesHistory.real.filter(j => j.stop === 'x').length
                  if (myData.gamesHistory.real.length > historySize) {
                    gamesHistory.real = myData.gamesHistory.real.slice(myData.gamesHistory.real.length - historySize)
                  }

                  const virtualWins = myData.gamesHistory.virtual.filter(j => j.crash === 'x').length
                  const virtualLosses = myData.gamesHistory.virtual.filter(j => j.stop === 'x').length
                  if (myData.gamesHistory.virtual.length > historySize) {
                    gamesHistory.virtual = myData.gamesHistory.virtual.slice(myData.gamesHistory.virtual.length - historySize)
                  }

                  setGames(myData)
                  const newBalance = parseFloat(isReal ? myData.balance.real : myData.balance.virtual).toFixed(2)
                  console.log("check balance : ", newBalance)
                  balanceRef.current = newBalance
                  setFirstLogin(myData.first_state !== "false");
                  setRewardState(myData.first_state !== "false");
                  setBalance(newBalance)
                  setUser({
                    RealName: realName,
                    UserName: userName,
                    UserId: userId,
                    Balance: isReal ? myData.balance.real.toFixed(2) : myData.balance.virtual.toFixed(2),
                    GameWon: isReal ? realWins : virtualWins,
                    GameLost: isReal ? realLosses : virtualLosses,
                    Rank: isReal ? data.realRank : data.virtualRank,
                    Ranking: isReal ? myData.ranking.real : myData.ranking.virtual,
                    FriendNumber: myData.friendNumber
                  })
                  const newHistoryGames = isReal ? gamesHistory.real : gamesHistory.virtual
                  historyGamesRef.current = newHistoryGames
                  setHistoryGames(newHistoryGames)
                  setLoaderIsShown(false)
                } catch (e) {
                  // eslint-disable-next-line no-self-assign
                  document.location.href = document.location.href
                }
                finally {

                  setTimeout(() => {
                    setLoading(false)
                    firstLoading && setActionState("ready")
                    setFirstLoading(false);
                  }, 500)
                }
              })
            await fetch(`${serverUrl}/check_first`, { method: 'POST', body: JSON.stringify({ userId: userId }), headers })


          }
        }
        return () => {
          isMounted = false
        }
      }
      catch (e) {
        console.log(e)
      }

    }
    fetchData()
  }, [isReal, gamePhase])
  if (loading && firstLoading) {
    setActionState("start")
    return <FetchLoading />
  }
  console.log(loading)

  console.log("data of user : ", user)
  // Function to start the game
  const startGame = () => {
    stopGame();
    if (autoMode) {
      setBet(Math.min(betAutoRef.current, balanceRef.current));
      realBet = Math.min(betAutoRef.current, balanceRef.current)
      setAutoStop(autoStopAM)
    }
    else {
      setBet(Math.min(betManualRef.current, balanceRef.current));
      realBet = Math.min(betManualRef.current, balanceRef.current)
      setAutoStop(autoStopManual)
    }
    setRewardState(false)
    setStopWasPressed(false);
    setGamePhase('started')
    setSocketStart(false);
    setActionState("start");
    context.socket.onmessage = async e => {
      const data = JSON.parse(e.data);
      console.log("start game", data.operation);
      switch (data.operation) {
        case 'started':
          setSocketStart(true)
          handleGameStarted();
          break;
        case 'stopped':
          handleGameStopped(data);
          break;
        case 'crashed':
          handleGameCrashed(data);
          break;
        default:
          break;
      }
    };
  };

  // Function to stop the game
  const stopGame = () => {
    setStopWasPressed(true);
    setActionState("stop");
    context.socket.send(JSON.stringify({ operation: 'stop' }));
    handleGameStopped()
  };

  const handleGameStarted = () => {
    setFirstLogin(false)
    setWinstate(false)
    console.log("bet in handle game start", bet, "real bet", realBet)
    updateBalance(-1 * realBet)
    const animation = document.getElementById('stars').style.animation
    document.getElementById('stars').style.animation = 'none'
    setTimeout(() => {
      setFinalResult(0);
      setGamePhase('started');
      document.getElementById('stars').style.animation = animation;
    }, 50);
  };

  const handleGameStopped = (data = { stop: 'x', profit: '0' }) => {
    setCointinueCounter(continueCounter + 1)
    testCounter = testCounter + 1;

    console.log("stop")
    setActionState("stop");
    setWinstate(false);
    setFinalResult(data.stop);
    setGamePhase('stopped');
    updateGameHistory(data, 'stopped');
    // const newBalance = (parseFloat(balanceRef.current) + parseFloat(data.profit)).toFixed(2)
    // setBalance(newBalance)
    // balanceRef.current = newBalance
    console.log("stopppppp update")
    updateBalance(data.profit);
    setGames(games + 1);
    setWins(wins + 1);
    adjustBetAfterWin();
    console.log("dsfsdfds")
    if (data.profit > 0) {
      setWinstate(true);
      toast(`${data.profit} coins added to your balance`,
        {
          position: "top-center",
          icon: "🥳",
          style: {
            borderRadius: '8px',
            background: '#84CB69',
            color: '#0D1421',
            width: '90vw',
            textAlign: 'start',
            justifyContent: 'start',
            justifyItems: 'start'
          },
        }
      )
    }
    performTask = []
    performTask = taskList.reduce((performList, task, index) => {
      const taskType = task.type;
      if (data.stop >= task.count && taskType.toString().substr(0, 5) === "type2")
        performList.push(task.index);
      if (task.count === continueCounter && taskType === "type3")
        performList.push(task.index);
      if (parseFloat(data.profit - bet) >= task.count && taskType === "type5")
        performList.push(task.index)

      return performList
    }, [])
    const headers = new Headers();
    headers.append('Content-Type', 'application/json')
    console.log("perform task", performTask)
    fetch(`${serverUrl}/add_perform_list`, { method: 'POST', body: JSON.stringify({ userId: user.UserId, performTask: performTask, isReal: isReal }), headers })
  };

  const handleGameCrashed = (data) => {
    console.log("handleGameCrash")
    setCointinueCounter(1)
    setActionState("stop");
    setFinalResult('Crashed...');
    setGamePhase('crashed');
    updateGameHistory(data, 'crashed');
    // updateBalance(data.profit);
    setGames(games + 1);
    setLosses(losses + 1);
    adjustBetAfterLoss();

    toast(`You lost ${data.profit} coin`,
      {
        position: "top-center",
        icon: "😱",
        style: {
          borderRadius: '8px',
          background: '#F56D63',
          color: '#FFFFFF',
          width: '90vw',

        },
      }
    )

  };

  const updateGameHistory = (data, status) => {
    console.log("bet in updateGame history", data.bet)
    const newHistory = [{
      crash: status === 'crashed' ? data.crash : 'x',
      bet: data.bet,
      stop: status === 'stopped' ? data.stop : 'x',
      profit: data.profit,
    }, ...historyGamesRef.current];
    setHistoryGames(newHistory);
    historyGamesRef.current = newHistory;
  };

  const updateBalance = (profit) => {
    const newBalance = (parseFloat(balanceRef.current) + parseFloat(profit)).toFixed(2);
    setBalance(newBalance);
    console.log(newBalance)
    balanceRef.current = newBalance;
    setUser(user => {
      const newUserBalance = (parseFloat(user.Balance) + parseFloat(profit)).toFixed(2)
      return { ...user, Balance: newUserBalance }
    })
  };
  console.log(balance)
  const adjustBetAfterWin = () => {
    if (autoMode) {
      console.log("betAutoRef.current ", betAutoRef.current)
      console.log("valueAfterWinRef ", valueAfterWinRef.current)
      console.log("balanceRef ", balanceRef.current)
      if (operationAfterWinRef.current === 'Increase Bet by') {
        setBet(Math.min(bet * valueAfterWinRef.current, balanceRef.current));
        // betAutoRef.current = Math.min(betAutoRef.current * valueAfterWinRef.current, balanceRef.current);
      } else {
        setBet(Math.min(betAutoRef.current, balanceRef.current));
        // betAutoRef.current = Math.min(betAutoRef.current, balanceRef.current);
      }
      // setBet(betAutoRef.current);
    }
  };
  console.log("valueAfterWinRef.current", valueAfterWinRef.current)
  console.log("balanceRef.current", balanceRef.current)

  const adjustBetAfterLoss = () => {
    if (autoMode) {
      if (operationAfterLossRef.current === 'Increase Bet by') {
        // betAutoRef.current = Math.min(betAutoRef.current * valueAfterLossRef.current, balanceRef.current);
        setBet(Math.min(bet * valueAfterLossRef.current, balanceRef.current));
      } else {
        // betAutoRef.current = Math.min(betAutoRef.current, balanceRef.current);
        setBet(Math.min(betAutoRef.current, balanceRef.current));
      }
      // setBet(betAutoRef.current);
    }
  };

  const setPlayMode = (condition) => {
    setAutoMode(condition);
    setIsModalOpen(condition);
  }

  const goToUserInfo = () => {
    stopGame();
    navigate("/userInfo");
  }
  if (tabId === 2) {
    setTabId(1);
    setInfoState(true)
  }

  console.log("bet: ", bet, " betAutoRef: ", betAutoRef.current);
  return (
    <>
      <Suspense fallback={<FetchLoading />}>
        <div className="flex-auto p-4">

          <div id='index-operations' className={`flex flex-col relative h-full w-full gap-4 justify-between ${autoMode ? 'auto-mode' : ''} transition flex flex-col gap-4 ${isAction === "start" ? "pb-0" : "pb-[76px]"}`}>


            <div className={`flex w-full absolute bg-white_20 justify-between transition transform duration-200 p-2 rounded-[10px] text-white text-base leading-5 ${isAction === "start" ? "-translate-y-24" : ""} `} onClick={goToUserInfo}>

              <div className="flex gap-2.5">
                {/* <img src={avatarData[RANKINGDATA.indexOf(user.Ranking)]} width="64px" height="64px" className="max-w-16 h-16" alt="avatar" /> */}
                <LazyLoadImage
                  alt="user ranking avatar"
                  effect="blur"
                  wrapperProps={{
                    style: {
                      // transitionDelay: "1s",
                      height: "64px",
                      width: "64px",
                      maxWidth: "64px",
                    },
                  }}
                  src={avatarData[RANKINGDATA.indexOf(user.Ranking)]} />
                <div className="flex flex-col w-full gap-0.5">
                  <p className="font-semibold text-ellipsis overflow-hidden w-32 whitespace-nowrap">{user.RealName}</p>
                  <p className="font-semibold">{user.Ranking} · {RANKINGDATA.indexOf(user.Ranking) + 1}/10</p>
                  <p className="text-[#ffffff99]">{user.Rank}</p>
                </div>
              </div>


              <div className="flex flex-col gap-2">
                <PannelScore img={Img.agree} text2={"Won"} text3={user.GameWon} />
                <PannelScore img={Img.disagree} text2={"Lost"} text3={user.GameLost} />
              </div>

            </div>


            <div className={` transform translate-y-[100px] bg-cover bg-center bg-opacity-20 justify-between flex gap-2 px-4 py-2 items-center reward-bg h-[76px] rounded-[10px] ${rewardState ? "" : "hidden"}`} style={{ background: `url(${rewardBG})` }}>
              <div>
                <img src="/image/cup.png" width={48} height={48} className="max-w-12 h-12" alt='cup'></img>
              </div>

              <div className="text-[15px] w-1/2 leading-5 tracking-[-2%] text-white">You have uncompleted tasks that you can get rewards for.</div>
              <Link to = '/earn'>
              <ShadowButton
                content="Get Rewards"
                className={`relative px-3 py-1 bg-[#84CB69] text-[#080888] shadow-btn-custom-border h-7 text-sm leading-5 w-[108px] font-medium `}
                action={() => setRewardState(false)}
              />
              </Link>
              <div className="absolute w-[30px], h-[30px]  top-0 right-0" onClick={() => setRewardState(false)}>
                <img src="/image/icon/CloseButton.svg" width={30} height={30} className="max-w-[30px] h-[30px]" alt="close" />
              </div>

            </div>
            <TabButton className={`transform translate-y-[100px] ${isAction === "start" ? "-translate-y-[150px]" : ""} `} tabList={statsList} tabNo={tabId} setTabNo={setTabId} />
            <Game className={`transition-all ${isAction !== "start" ? "mt-24" : "mt-0"} `} finalResult={finalResult} gamePhase={gamePhase} isWin={winState}
              setLoaderIsShown={setLoaderIsShown} amount={balance} bet={bet} autoStop={autoStop} socketFlag={socketStart} realGame={isReal} setInfoState={(e) => setInfoState(e)} />

            <div className="flex flex-col text-white gap-4">
              <div >
                <div className={`flex flex-row justify-center text-base font-medium ${gamePhase === 'started' ? "opacity-20 !text-white" : ""}`}>
                  <span className={`text-[#3861FB] ${!autoMode ? 'selected text-white ' : ''}`} onClick={gamePhase !== 'started' ? e => setPlayMode(false) : undefined} >Manual</span>
                  <SwitchButton checked={autoMode} onChange={gamePhase !== 'started' ? (e => setPlayMode(e.target.checked)) : undefined} />
                  <span className={`text-[#3861FB] ${autoMode ? 'selected text-white ' : ''}`} onClick={gamePhase !== 'started' ? e => setPlayMode(true) : undefined} >Auto</span>
                </div>

                <div className={`transition duration-300 ${autoMode && "hidden"} flex gap-4`}>
                  <div className="flex flex-col w-1/2 gap-1">
                    <div className="text-sm leading-5">Bet</div>
                    <InputNumber InputProps={{ value: betManualRef.current, min: 1, step: 1, disabled: gamePhase === 'started', onChange: e => { setBet(parseFloat(e.target.value)); betManualRef.current = parseFloat(e.target.value) } }} />
                    <div className="text-xs leading-[14px] text-[#FFFFFFCC]">Minimal Bet is 1 Coin</div>
                  </div>

                  <div className="flex flex-col w-1/2 gap-1">
                    <div className="text-sm leading-5">Auto Stop</div>
                    <InputNumber InputProps={{ value: autoStopManual, min: 1.1, max: 100, step: 1, disabled: gamePhase === 'started', type: "xWithNumber", onChange: e => { setAutoStopManual(e.target.value) } }} />
                    <div className="text-xs leading-[14px] text-[#FFFFFFCC]">Auto Cash Out when this amount will be reached</div>
                  </div>
                </div>
              </div>

              {
                // gamePhase !== 'started'  ?
                gamePhase !== 'started' ?
                  (
                    <div className="flex gap-2 w-full justify-between">
                      {autoMode && <ShadowButton className={`transition-all flex w-1/5 bg-white justify-center items-center invite-btn-setting border-white `}
                        content={<SettingButton />}
                        action={() => setIsModalOpen(true)}
                      />}
                      <ShadowButton
                        action={startGame}
                        content={"Start"}
                        disabled={
                          balance === '0.00' ||
                          bet < 1 || autoStop < 1.1 ||
                          balance < 1 || isNaN(bet) || isNaN(autoStop) || isNaN(winCoefficient)
                          || isNaN(lostCoefficient)
                        }
                      />
                    </div>
                  ) :
                  (
                    <ShadowButton
                      className={"bg-[#CC070A] shadow-btn-red-border invite-btn-red-shadow"}
                      content={"Stop"}
                      action={stopGame}
                    />
                  )
              }

              <SettingModal icon={<AutoIcon />} title="Auto Launch" isOpen={isModalOpen} setIsOpen={setIsModalOpen}>
                <div className="flex flex-col justify-between max-h-screen pt-2 px-4 pb-4 h-[calc(100vh-60px)]" >
                  <div className="flex flex-col gap-[15px]" >
                    <div className="flex gap-4">
                      <div className="flex flex-col w-1/2 gap-1">
                        <div className="text-sm leading-5">Bet</div>
                        <InputNumber InputProps={{ value: betAutoRef.current, min: 1, step: 1, onChange: e => { setBet(parseFloat(e.target.value)); betAutoRef.current = parseFloat(e.target.value) } }} />
                        <div className="text-xs leading-[14px] text-[#FFFFFFCC]">Minimal Bet is 1 Coin</div>
                      </div>

                      <div className="flex flex-col w-1/2 gap-1">
                        <div className="text-sm leading-5">Auto Stop</div>
                        <InputNumber InputProps={{ value: autoStopAM, min: 1.1, max: 100, step: 1, type: "xWithNumber", onChange: e => { setAutoStopAM(e.target.value) } }} />
                        <div className="text-xs leading-[14px] text-[#FFFFFFCC]">Auto Cash Out when this amount will be reached</div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-[15px]">
                      <div className="flex flex-col w-full gap-1">
                        <div className="text-sm leading-5">If Lose</div>
                        <SwitchButtonOption contents={operationOption} setSlot={(e) => setOperationAfterLoss(e)} slot={operationAfterLoss} />
                      </div>

                      <div className="flex flex-col w-full gap-1">
                        <div className="text-sm leading-5">Coefficient</div>
                        <InputNumber InputProps={{ value: lostCoefficient, min: 1, max: 100, step: 1, type: "xWithNumber", disabled: operationAfterLoss === "Return to base Bet", onChange: e => { setLostCoefficient(parseFloat(e.target.value)) } }} />
                      </div>
                    </div>

                    <div className="flex flex-col gap-[15px]">
                      <div className="flex flex-col w-full gap-1">
                        <div className="text-sm leading-5">If Win</div>
                        <SwitchButtonOption contents={operationOption} setSlot={(e) => setOperationAfterWin(e)} slot={operationAfterWin} />
                      </div>

                      <div className="flex flex-col w-full gap-1">
                        <div className="text-sm leading-5 text-[#FFFFFF99]">Coefficeent</div>
                        <InputNumber InputProps={{ value: winCoefficient, min: 1, max: 100, step: 1, type: "xWithNumber", disabled: operationAfterWin === "Return to base Bet", onChange: e => { setWinCoefficient(e.target.value) } }} />
                      </div>
                    </div>
                  </div>

                  {
                    gamePhase !== 'started' ?
                      (
                        <ShadowButton
                          action={handleModalButton}
                          content={"Start"}
                          disabled={
                            balance === '0.00' || bet < 1 || autoStop < 1.1 ||
                            balance < 1 || isNaN(bet) || isNaN(autoStop) || isNaN(winCoefficient)
                            || isNaN(lostCoefficient)
                          }
                        />
                      ) :
                      (
                        <ShadowButton
                          className={"bg-[#CC070A] shadow-btn-red-border invite-btn-red-shadow"}
                          content={"Stop"}
                          action={stopGame}
                        />
                      )
                  }
                </div>
              </SettingModal>

              <InfoModal title="Welcome, Recruit!" isOpen={firstLogin} setIsOpen={() => setFirstLogin(false)} height="h-[480px]">
                <div className="flex items-center justify-center">
                  <img src={avatar.avatarBeginner} width="128px" height="128px" className="max-w-[128px] h-[128px]" alt="avatar" />
                </div>
                <div className="flex flex-col gap-6 text-black text-center text-[15px] font-normal leading-5 tracking-[-2%]">
                  <div>
                    🚀 Place your bet and press the Start button to launch the rocket!
                  </div>
                  <div>
                    💰 As the rocket flies, a multiplier increases your bet. Press the Stop button to get your profit!
                  </div>
                  <div>
                    💥 But be careful, because the rocket can crash at any moment, and if it does, you'll lose your bet!
                  </div>
                </div>
                <div className=" flex gap-4">
                  <Link to={'/help'} className="w-1/2">
                    <ShadowButton className=" bg-white text-[#3861FB] invite-btn-setting !border-[#F3E3E3]" content="learn more" />
                  </Link>
                  <ShadowButton className="w-1/2" content="Got it!" action={() => setFirstLogin(false)} />

                </div>
              </InfoModal>
              <InfoModal title="Coming soon!" isOpen={infoState} setIsOpen={() => setInfoState(false)} height="h-[280px]">
                <div className="flex items-center justify-center">
                  <img src='image/icon/rocketx.svg' width="48px" height="48px" className="max-w-[48px] h-[48px]" alt="avatar" />
                </div>
                <div className="flex flex-col gap-6 text-black text-center text-[15px] font-normal leading-5 tracking-[-2%]">
                  <div>
                    🛠 Our token is under development!
                  </div>
                  <div>
                    📢 Join our social media to stay up to date.
                  </div>
                  <Contact />
                </div>

              </InfoModal>
            </div>
          </div>
        </div>
      </Suspense>
    </>
  );
};

export default MainPage;