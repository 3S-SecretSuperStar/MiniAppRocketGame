import React, { useState, useContext, useRef, useEffect } from "react";
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
import AppContext from "../component/template/AppContext.jsx";
import InputNumber from "../component/template/InputNumber";
import Game from '../component/template/Game.jsx'
import { betValue, gameRunningState, isActionState, realGameState, TaskContent, userData } from "../store";
import { avatar } from "../assets/avatar";
import { Img } from "../assets/image";
import { RANKINGDATA } from "../utils/globals.js";
import { REACT_APP_SERVER } from "../utils/privateData.js";
import Contact from "../component/molecules/contact.jsx";
import "../css/Style.css"
import TabButton from "../component/atom/tab-button.jsx";
import AutoIcon from "../component/svg/auto-icon.jsx";
import { LazyLoadImage } from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/blur.css';
import { formatNumber } from "../utils/inputValidator.js";
import moment from "moment";
import Loading from "./Loading.jsx";
import SkeletonOne from "../component/atom/skeleton-one.jsx";
import { getReward } from "../utils/globals.js";
import CheckMark from "../component/svg/check-mark.jsx";

const MainPage = () => {

  const serverUrl = REACT_APP_SERVER;
  const operationOption = ['Return to base Bet', 'Increase Bet by'];
  // State variables
  const [autoMode, setAutoMode] = useState(false);
  const [autoStop, setAutoStop] = useState(5);
  const [balance, setBalance] = useState(userData.balance);
  const context = useContext(AppContext);
  const [finalResult, setFinalResult] = useState(0);
  const [firstLogin, setFirstLogin] = useState(false);
  const [gamePhase, setGamePhase] = useState();
  const [games, setGames] = useState(0);
  const [historyGames, setHistoryGames] = useState([]);
  const [isAction, setActionState] = useAtom(isActionState);
  const [infoState, setInfoState] = useState(false);
  const [adState, setAdState] = useState(false);
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
  const [tabId, setTabId] = useState(1);
  const [loading, setLoading] = useState(true)
  const [firstLoading, setFirstLoading] = useState(true);
  const [betStopRef, setBetStopRef] = useState(0);
  const [currentResult, setCurrentResult] = useState(1);
  const [gameRunning, setGameRunning] = useAtom(gameRunningState);
  const [betAuto, setBetAuto] = useState(1)
  const [betManual, setBetManual] = useState(1)
  let performTask = [];
  let testCounter = 0;

  // Refs for mutable state
  const balanceRef = useRef(balance);
  const historyGamesRef = useRef(historyGames);
  const betAutoRef = useRef(1);
  const betManualRef = useRef(1);
  const realBetRef = useRef(1);
  const operationAfterWinRef = useRef(operationAfterWin);
  const valueAfterWinRef = useRef(winCoefficient);
  const operationAfterLossRef = useRef(operationAfterLoss);
  const valueAfterLossRef = useRef(lostCoefficient);
  const fallGameScoreRef = useRef(0);
  const navigate = useNavigate();
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
    handleStartGame();
    setIsModalOpen(false);
  }

  const handleStartGame = () => {
    console.log("checkBetAutoRef", betAutoRef.current, ":", balanceRef.current);
    console.log("checkRealBetRef", realBetRef.current, ":", balanceRef.current);
    const currentBet =
      autoMode
        ? betAutoRef.current
        : betManualRef.current;
    realBetRef.current = currentBet;
    console.log("checkRealBetRefAgain", realBetRef.current, ":", balanceRef.current);
    setAutoStop(autoMode ? autoStopAM : autoStopManual)
    startGame();
  }

  const handleStartButton = () => {
    startGame()
  }

  // Effect to validate and adjust state values
  useEffect(() => {
    if (gamePhase !== 'started') {
      if (realBetRef.current < 1 || isNaN(realBetRef.current)) {
        betAutoRef.current = 1;
        betManualRef.current = 1;
      }

      if (autoStop < 1.1) {
        setAutoStop(1.1)
      } else if (autoStop > 100) {
        setAutoStop(100)
      }

      if (balance === 0) {
        setBalance('0.00')
        balanceRef.current = (balance.toFixed(2));
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
  }, [realBetRef.current, autoStop, balance, lostCoefficient, winCoefficient]);

  useEffect(() => {
    operationAfterWinRef.current = operationAfterWin;
    valueAfterWinRef.current = winCoefficient;
    operationAfterLossRef.current = operationAfterLoss;
    valueAfterLossRef.current = lostCoefficient;
  }, [operationAfterWin, winCoefficient, operationAfterLoss, lostCoefficient]);

  useEffect(() => {
    let isMounted = true
    if (gamePhase !== 'started' && autoMode && !stopWasPressed && balance >= betAutoRef.current && betAutoRef.current) {
      if (isMounted) {
        try {
          setTimeout(() => {
            startGame()
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

      if (profiles.result.photos.length > 0) {
        const fileResponse = await fetch(`https://api.telegram.org/bot${bot_token}/getFile?file_id=${profiles.result.photos[0][2].file_id}`);
        const filePath = await fileResponse.json();
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
    toast.dismiss();
    const headers = new Headers()
    headers.append('Content-Type', 'application/json')
    fetch(`${serverUrl}/get_task`, { method: 'POST', body: JSON.stringify({ userId: user.UserId }), headers })
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
        const startParam = Number(webapp["start_param"]);

        // const userId = 6977492118;
        // const realName = "aaa";
        // const userName = "fff";

        const historySize = 100;
        let gamesHistory = { real: [], virtual: [] }
        const headers = new Headers()
        headers.append('Content-Type', 'application/json')

        if (isMounted) {
          const userAvatarUrl = await getProfilePhotos(userId, bot_token);
          const updateAvatarState = await updateAvatar(userAvatarUrl, userId);
          if (startParam) {
            try {
              if (userId !== Number(startParam)) {
                await fetch(`${serverUrl}/add_friend`, {
                  method: 'POST',
                  body: JSON.stringify({ userId: userId, userName: userName, realName: realName, friend: startParam, userAvatarUrl: userAvatarUrl }),
                  headers
                });
              }
            }
            catch (error) {
              console.log(error);
            }
            // console.log("--//---OK!!!--add friend--//---", startParam, userId);
          }

          fetch(`${serverUrl}/user_info`, { method: 'POST', body: JSON.stringify({ realName: realName, userName: userName, userAvatarUrl: userAvatarUrl, userId: userId }), headers })
            .then(res => Promise.all([res.status, res.json()]))
            .then(([status, data]) => {
              try {
                if (gamePhase !== 'started') {
                  const myData = data.userData;

                  const virtualTaskState = myData.task.virtual;
                  const realWins = myData.gamesHistory.real.filter(j => j.crash === 'x').length
                  const realLosses = myData.gamesHistory.real.filter(j => j.stop === 'x').length
                  const dailyDate = myData.dailyHistory;
                  const nowDate = moment().startOf('day');
                  const selectedDate = moment(dailyDate).utc().local().startOf('day');
                  const diffDate = nowDate.diff(selectedDate, 'days');

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
                  setFirstLogin(myData.first_state !== "false");

                  const rewardStates = !virtualTaskState.achieve_task.every(item => virtualTaskState.done_task.includes(item)) || myData.first_state !== "false" || diffDate >= 2;
                  setRewardState(rewardStates);
                  setBalance(newBalance)
                  balanceRef.current = newBalance
                  setUser({
                    RealName: realName,
                    UserName: userName,
                    UserId: userId,
                    Balance: newBalance,
                    GameWon: isReal ? realWins : virtualWins,
                    GameLost: isReal ? realLosses : virtualLosses,
                    Ranking: isReal ? myData.ranking.real : myData.ranking.virtual,
                    FriendNumber: myData.friend_count
                  })
                  const newHistoryGames = isReal ? gamesHistory.real : gamesHistory.virtual
                  historyGamesRef.current = newHistoryGames
                  setHistoryGames(newHistoryGames)
                  setLoaderIsShown(false)
                }
              } catch (e) {
                // eslint-disable-next-line no-self-assign
                document.location.href = document.location.href
              }
              finally {
                firstLoading && setActionState("ready")
                setFirstLoading(false);

              }
            })
          await fetch(`${serverUrl}/check_first`, { method: 'POST', body: JSON.stringify({ userId: userId }), headers });
          user.watchAd == 0 && setAdState(true);
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
  }, [])

  useEffect(() => {
    const webapp = window.Telegram.WebApp.initDataUnsafe;
    const headers = new Headers()
    headers.append('Content-Type', 'application/json')
    if (webapp) {
      const userId = webapp["user"]["id"];
      // const userId = 6977492118;
      fetch(`${serverUrl}/get_ranking`, { method: 'POST', body: JSON.stringify({ userId: userId }), headers })
        .then(res => Promise.all([res.status, res.json()]))
        .then(([status, data]) => {
          console.log("real: ", data.realRank, "virtual", data.virtualRank)
          setUser(user => ({ ...user, Rank: isReal ? data.realRank : data.virtualRank, }))
        })
    }
  }, [])

  if (loading && firstLoading) {
    setActionState("start")
  }

  if (!firstLoading && loading) {
    setLoading(false)
  }
  if (firstLoading)
    return <Loading setLoading={setLoading} from={60} to={100} time={15} />

  const startGame = () => {
    console.log("gameStart", realBetRef.current, ":", balanceRef.current);

    if (realBetRef.current > balanceRef.current) {
      setGameRunning(false);
      return;
    }
    setRewardState(false);
    setStopWasPressed(false);
    setSocketStart(false);
    setActionState("start");
    setGamePhase('started');
  };

  const stopGame = async (amount, running = false) => {
    setGameRunning(running);
    setStopWasPressed(true);
    setActionState("stop");
    setGamePhase('stopped');
    if (socketStart) {
      const body = { userId: user.UserId, operation: "stop", isSuccess: false, bet: realBetRef.current, result: 0, profit: 0, isReal };
      if (amount == 'x') {
        body.isSuccess = true;
        body.result = currentResult;
        body.profit = currentResult * realBetRef.current + fallGameScoreRef.current;
      } else {
        if (betStopRef < autoStop) {
          body.isSuccess = false;
          body.result = amount;
          body.profit = 0;
        } else {
          body.isSuccess = true;
          body.result = amount;
          body.profit = amount * realBetRef.current + fallGameScoreRef.current;
        }
      }

      if (body.isSuccess) {
        handleGameStopped(
          {
            stop: amount == "x" ? currentResult : amount,
            profit: amount == "x" ? currentResult * realBetRef.current : amount * realBetRef.current
          }
        );
      } else {
        handleGameCrashed(
          {
            stop: 'x',
            profit: realBetRef.current
          }
        );
      }
      try {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json')
        const result = await fetch(`${serverUrl}/operate_game`, {
          headers,
          method: 'POST',
          body: JSON.stringify(body)
        });
        const stopResult = await result.json();
        console.log("stop", stopResult);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const stopGameOperator = async (amount) => {
    await stopGame(amount, autoMode);
    if (autoMode) {
      startGame();
    }
  }

  const handleGameStarted = () => {
    if (realBetRef.current > balanceRef.current) {
      setGameRunning(false);
      return;
    }
    setFirstLogin(false)
    setWinstate(false)
    const animation = document.getElementById('stars').style.animation;
    updateBalance(-1 * realBetRef.current)
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

    setActionState("stop");
    setWinstate(false);
    setFinalResult(data.stop);
    setGamePhase('stopped');
    updateGameHistory(data, 'stopped');

    setGames(games + 1);
    setWins(wins + 1);
    adjustBetAfterWin();

    if (data.profit + fallGameScoreRef.current > 0) {
      setWinstate(true);
      toast(`${formatNumber(Number(data.profit + fallGameScoreRef.current))} coins added to your balance`,
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
      );
      updateBalance(data.profit);
    }

    performTask = []
    performTask = taskList.reduce((performList, task, index) => {
      const taskType = task.type;
      if (data.stop >= task.count && taskType.toString().substr(0, 5) === "type2")
        performList.push(task.index);
      if (task.count === continueCounter && taskType === "type3")
        performList.push(task.index);
      if (parseFloat(data.profit - realBetRef.current) >= task.count && taskType === "type5")
        performList.push(task.index)

      return performList
    }, [])

    const headers = new Headers();
    headers.append('Content-Type', 'application/json')
    fetch(`${serverUrl}/add_perform_list`, { method: 'POST', body: JSON.stringify({ userId: user.UserId, performTask: performTask, isReal: isReal }), headers })
  };

  const handleGameCrashed = (data) => {
    setCointinueCounter(1)
    setActionState("stop");
    setFinalResult('Crashed...');
    setGamePhase('crashed');
    updateGameHistory(data, 'crashed');
    setGames(games + 1);
    setLosses(losses + 1);
    adjustBetAfterLoss();

    toast((t) => (
      <div className="flex flex-col w-full">
        <div className="w-full text-center font-bold text-[#0D1421] text-[17px] relative">
          Want your bet back?
          <svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute right-0 top-0" onClick={() => toast.dismiss(t.id)}>
            <circle cx="15.5" cy="15" r="15" fill="white" fillOpacity="0.2" />
            <path d="M10.4219 20.4531C10.2917 20.3229 10.2057 20.1719 10.1641 20C10.1224 19.8229 10.1224 19.6484 10.1641 19.4766C10.2057 19.3047 10.2891 19.1562 10.4141 19.0312L14.0781 15.3672L10.4141 11.7109C10.2891 11.5859 10.2057 11.4375 10.1641 11.2656C10.1224 11.0938 10.1224 10.9219 10.1641 10.75C10.2057 10.5729 10.2917 10.4193 10.4219 10.2891C10.5469 10.1641 10.6953 10.0807 10.8672 10.0391C11.0443 9.99219 11.2188 9.99219 11.3906 10.0391C11.5677 10.0807 11.7188 10.1615 11.8438 10.2812L15.5 13.9453L19.1641 10.2891C19.2891 10.1641 19.4349 10.0807 19.6016 10.0391C19.7734 9.99219 19.9453 9.99219 20.1172 10.0391C20.2943 10.0807 20.4453 10.1667 20.5703 10.2969C20.7057 10.4219 20.7943 10.5729 20.8359 10.75C20.8776 10.9219 20.8776 11.0938 20.8359 11.2656C20.7943 11.4375 20.7083 11.5859 20.5781 11.7109L16.9297 15.3672L20.5781 19.0312C20.7083 19.1562 20.7943 19.3047 20.8359 19.4766C20.8776 19.6484 20.8776 19.8229 20.8359 20C20.7943 20.1719 20.7057 20.3203 20.5703 20.4453C20.4453 20.5755 20.2943 20.6641 20.1172 20.7109C19.9453 20.7526 19.7734 20.7526 19.6016 20.7109C19.4349 20.6693 19.2891 20.5833 19.1641 20.4531L15.5 16.7969L11.8438 20.4609C11.7188 20.5807 11.5677 20.6641 11.3906 20.7109C11.2188 20.7526 11.0443 20.7526 10.8672 20.7109C10.6953 20.6641 10.5469 20.5781 10.4219 20.4531Z" fill="#7886A0" />
          </svg>
        </div>
        <div className="mt-2 text-[15px]">
          Watch the 15 sec ads to get your bet back.
        </div>
        <ShadowButton
          action={goToBackBet}
          content={"OK"}
          className={'mt-6'}
        />
      </div>
    ), {
      style: {
        borderRadius: '16px',
        background: '#FAD557',
        width: "100%"
      },
    });

    toast(`You lost ${formatNumber(Number(data.profit + fallGameScoreRef.current))} coin`,
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
    );

    updateBalance(-fallGameScoreRef.current);
  };

  const updateGameHistory = (data, status) => {
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
    const newBalance = (parseFloat(balanceRef.current) + parseFloat(profit)).toFixed(2) > 0 ? (parseFloat(balanceRef.current) + parseFloat(profit)).toFixed(2) : 0;
    balanceRef.current = newBalance;
    setBalance(newBalance);
    const updatedUser = { ...user, Balance: newBalance }
    setUser(updatedUser)
  };

  const gameStartSignal = async () => {
    toast.dismiss();
    const headers = new Headers();
    headers.append('Content-Type', 'application/json')
    try {
      const result = await fetch(`${serverUrl}/operate_game`, {
        headers,
        method: 'POST',
        body: JSON.stringify({ userId: user.UserId, bet: realBetRef.current, isReal: isReal, autoStop, operation: "start" })
      });
      const data = await result.json();
      console.log("start", data);

      if (data.status == "success") {
        setBetStopRef(data.data.gameLimit);
        handleGameStarted();
        setSocketStart(true);
      } else {
        setGamePhase("stopped");
        setActionState("stop");
        setWinstate(false);
      }
    } catch (error) {
      console.log(error);
      setGamePhase("stopped");
      setActionState("stop");
      setWinstate(false);
    }
  }

  const adjustBetAfterWin = () => {
    if (autoMode) {
      if (operationAfterWinRef.current === 'Increase Bet by') {
        realBetRef.current = Math.min(1000, realBetRef.current * valueAfterWinRef.current);
      } else {
        realBetRef.current = betAutoRef.current;
      }
    }
  };

  const adjustBetAfterLoss = () => {
    if (autoMode) {
      if (operationAfterLossRef.current === 'Increase Bet by') {
        realBetRef.current = Math.min(1000, realBetRef.current * valueAfterLossRef.current);
      } else {
        realBetRef.current = betAutoRef.current;
      }
    }
  };

  const setPlayMode = (condition) => {
    setAutoMode(condition);
    setIsModalOpen(condition);
    betAutoRef.current = realBetRef.current;
    setBetAuto(realBetRef.current)
  }

  const goToUserInfo = () => {
    stopGame('x');
    navigate("/userInfo");
  }

  const chargeBalance = (profit, isWin) => {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    if (isWin === 1) {
      fetch(`${serverUrl}/charge_balance`, { method: 'POST', body: JSON.stringify({ userId: user.UserId, amount: profit }), headers })
      updateBalance(profit - fallGameScoreRef.current);
    } else {
      updateBalance(-profit);
    }
    fallGameScoreRef.current = 0;
  }

  const goToMoneAd = async () => {
    try {
      await show_8549848();
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      await fetch(`${serverUrl}/add_perform_list`, { method: 'POST', body: JSON.stringify({ userId: user.UserId, performTask: [32], isReal: isReal }), headers });
      console.log("perform list added");
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
    setAdState(false);
    setUser({ ...user, watchAd: 2 });
    setTimeout(() => {
      navigate("/earn");
    }, 1000)
  }

  const goToBackBet = async () => {
    try {
      toast.dismiss();
      await show_8549848();
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      await fetch(`${serverUrl}/perform_dailyADS`, { method: 'POST', body: JSON.stringify({ userId: user.UserId, amount: realBetRef.current, task: 32, isReal: isReal }), headers });
      toast(`${realBetRef.current} coins added to your balance`,
        {
          position: "top-center",
          icon: <CheckMark />,
          style: {
            borderRadius: '8px',
            background: '#7886A0',
            color: '#fff',
            width: '90vw'
          },
        })
      updateBalance(Number(realBetRef.current))
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  }

  if (tabId === 2) {
    setTabId(1);
    setInfoState(true)
  }

  console.log("test bet auto ref", betAuto, balance)

  return (
    <>
      <div className="flex-auto p-4">
        <div id='index-operations' className={`flex flex-col relative h-full w-full gap-4 justify-between ${autoMode ? 'auto-mode' : ''} transition flex flex-col gap-4 ${isAction === "start" ? "pb-0" : "pb-[76px]"}`}>
          <div className={`flex w-full absolute bg-white_20 justify-between transition transform duration-200 p-2 rounded-[10px] text-white text-base leading-5 z-10 ${isAction === "start" ? "-translate-y-[300px]" : ""} `} onClick={gameRunning ? "" : goToUserInfo}>
            <div className="flex gap-2.5">
              <LazyLoadImage
                alt="user ranking avatar"
                effect="blur"
                wrapperProps={{
                  style: {
                    height: "64px",
                    width: "64px",
                    minWidth: "64px",
                  },
                }}
                src={avatarData[RANKINGDATA.indexOf(user.Ranking)]}
              />
              <div className="flex flex-col w-full gap-0.5">
                <p className="font-semibold text-ellipsis overflow-hidden w-32 whitespace-nowrap">{user.RealName}</p>
                <p className="font-semibold whitespace-nowrap">{user.Ranking} · {RANKINGDATA.indexOf(user.Ranking) + 1}/10</p>
                {user.Rank ? <p className="text-[#ffffff99]">{user.Rank} </p>
                  : <SkeletonOne />}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <PannelScore img={Img.agree} text2={"Won"} text3={user.GameWon} />
              <PannelScore img={Img.disagree} text2={"Lost"} text3={user.GameLost} />
            </div>
          </div>
          {/* <div className={`transform translate-y-[100px] bg-black bg-cover bg-center bg-opacity-40 justify-between flex gap-2 px-4 py-2 items-center reward-bg rounded-[10px] z-10 ${rewardState ? "" : "hidden"}`}>
            <div>
              <img src="/image/cup.png" width={48} height={48} className="max-w-12 h-12" alt='cup'></img>
            </div>
            <div className="text-[15px] w-1/2 leading-5 tracking-[-2%] text-white">You have unclaimed rewards. Check your tasks and claim your rewards.</div>
            <Link to='/earn'>
              <ShadowButton
                content="Get Rewards"
                className={`relative px-3 py-1 bg-[#84CB69] text-white shadow-btn-custom-border h-7 text-sm w-[108px] font-medium invite-btn-setting`}
                action={() => setRewardState(false)}
              />
            </Link>
            <div className="absolute w-[30px], h-[30px]  top-0 right-0" onClick={() => setRewardState(false)}>
              <img src="/image/icon/CloseButton.svg" width={30} height={30} className="max-w-[30px] h-[30px]" alt="close" />
            </div>
          </div> */}
          <TabButton className={`transform translate-y-[100px] z-10 ${isAction === "start" ? "-translate-y-[300px]" : ""} `} tabList={statsList} tabNo={tabId} setTabNo={setTabId} />
          <Game
            className={`transition-all ${isAction !== "start" ? "mt-24" : "mt-0"} `}
            finalResult={finalResult} gamePhase={gamePhase} setGamePhase={setGamePhase} isWin={winState} stopGame={(e) => stopGameOperator(e)}
            setLoaderIsShown={setLoaderIsShown} amount={balance} bet={realBetRef.current} autoStop={autoStop} socketFlag={socketStart} realGame={isReal} setInfoState={(e) => setInfoState(e)}
            startGame={startGame} autoMode={autoMode} updateBalance={updateBalance} fallGameScore={fallGameScoreRef} betStopRef={betStopRef} gameStartSignal={gameStartSignal}
            handleGameStarted={handleGameStarted} handleGameStopped={handleGameStopped} setSocketFlag={setSocketStart} currentResult={currentResult} setCurrentResult={setCurrentResult}
            gameRunning={gameRunning}
          />
          <div className="flex flex-col text-white gap-4 z-10">
            <div >
              <div className={`flex flex-row justify-center text-base z-10 font-medium ${gamePhase === 'started' ? "opacity-20 !text-white" : ""}`}>
                <span className={`${!autoMode ? 'selected text-white ' : 'text-[#FAE365]'}`} onClick={gamePhase !== 'started' ? e => setPlayMode(false) : undefined} >Manual</span>
                <SwitchButton checked={autoMode} onChange={gamePhase !== 'started' ? (e => setPlayMode(e.target.checked)) : undefined} />
                <span className={`${autoMode ? 'selected text-white ' : 'text-[#FAE365]'}`} onClick={gamePhase !== 'started' ? e => setPlayMode(true) : undefined} >Auto</span>
              </div>
              <div className={`transition duration-300 ${autoMode && "hidden"} flex gap-4  z-10`}>
                <div className="flex flex-col w-1/2 gap-1">
                  <div className="text-sm leading-5  z-10">Bet</div>
                  <InputNumber InputProps={{
                    value: betManualRef.current, min: 1, max: 1000, step: 1, disabled: gamePhase === 'started', onChange: e => {
                      realBetRef.current = betManualRef.current = parseFloat(e.target.value)
                      setBetManual(parseFloat(e.target.value))
                    }
                  }} />
                  <div className="text-xs leading-[14px] text-[#FFFFFFCC]  z-10">Bet range is 1 — 1000 Coins</div>
                </div>
                <div className="flex flex-col w-1/2 gap-1">
                  <div className="text-sm leading-5">Auto Stop</div>
                  <InputNumber InputProps={{ value: autoStopManual, min: 1.1, max: 100, step: 1, disabled: gamePhase === 'started', type: "xWithNumber", onChange: e => { setAutoStopManual(e.target.value) } }} />
                  <div className="text-xs leading-[14px] text-[#FFFFFFCC]">Auto Cash Out when this amount will be reached</div>
                </div>
              </div>
            </div>

            {
              gamePhase !== 'started' ?
                (
                  <div className="flex gap-2 w-full justify-between">
                    {autoMode && <ShadowButton className={`transition-all flex w-1/5 bg-white justify-center items-center invite-btn-setting border-white `}
                      content={<SettingButton />}
                      action={() => setIsModalOpen(true)}
                    />}
                    <ShadowButton
                      className={"z-10"}
                      action={handleStartGame}
                      content={"Start"}
                      disabled={
                        balance === '0.00' ||
                        realBetRef.current < 1 || autoStop < 1.1 ||
                        balance < 1 || isNaN(realBetRef.current) || isNaN(autoStop) || isNaN(winCoefficient)
                        || isNaN(lostCoefficient) || autoMode && betAuto > balance || !autoMode && betManual > balance
                      }
                    />
                  </div>
                ) :
                (
                  <ShadowButton
                    className={"bg-[#CC070A] shadow-btn-red-border invite-btn-red-shadow z-10 mb-4"}
                    content={"Stop"}
                    action={() => stopGame('x')}
                  />
                )
            }

            <SettingModal icon={<AutoIcon />} title="Auto Launch" isOpen={isModalOpen} setIsOpen={setIsModalOpen}>
              <div className="flex flex-col justify-between max-h-screen pt-2 px-4 pb-4 h-[calc(100vh-60px)]" >
                <div className="flex flex-col gap-[15px]" >
                  <div className="flex gap-4">
                    <div className="flex flex-col w-1/2 gap-1">
                      <div className="text-sm leading-5">Bet</div>
                      <InputNumber InputProps={{
                        value: betAutoRef.current, min: 1, max: 1000, step: 1, onChange: e => {
                          realBetRef.current = betAutoRef.current = parseFloat(e.target.value),
                            setBetAuto(parseFloat(e.target.value))
                        }
                      }} />
                      <div className="text-xs leading-[14px] text-[#FFFFFFCC]">Bet range is 1 — 1000 Coins</div>
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
                        className={"z-10 mb-4"}
                        action={handleModalButton}
                        content={"Start"}
                        disabled={
                          balance === '0.00' || realBetRef.current < 1 || autoStop < 1.1 ||
                          balance < 1 || isNaN(realBetRef.current) || isNaN(autoStop) || isNaN(winCoefficient)
                          || isNaN(lostCoefficient) || autoMode && betAuto > balance || !autoMode && betManual > balance
                        }
                      />
                    ) :
                    (
                      <ShadowButton
                        className={"bg-[#CC070A] shadow-btn-red-border invite-btn-red-shadow z-10"}
                        content={"Stop"}
                        action={() => stopGame('x')}
                      />
                    )
                }

              </div>
            </SettingModal>

            <InfoModal title="Welcome, Recruit!" isOpen={firstLogin} setIsOpen={() => setFirstLogin(false)} height="h-[480px]">
              <div className="flex items-center justify-center">
                <Link to="https://youtu.be/aCvMfkfCkB0?si=s7hAd2H5knFqeQVT" target="_blank">
                  <img
                    src="/image/youtube.png"
                    alt=""
                    className="w-full aspect-auto"
                  />
                </Link>
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
                  <ShadowButton className=" bg-white text-mainFocus invite-btn-setting !border-[#F3E3E3]" content="learn more" />
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

            {
              <InfoModal title="Get Rewards Now!" isOpen={adState} setIsOpen={() => { setAdState(false); setUser({ ...user, watchAd: 1 }) }} height={"h-fit"} className={'bg-[url("/image/star-bg.png")] bg-[#FAD557]'}>
                <div className="flex items-center justify-center gap-2">
                  <img
                    src={`image/coin-y.svg`}
                    className="w-8 h-8"
                    alt="coin"
                  />
                  <span className="font-bold text-[32px] text-black">{getReward(balance)}</span>
                </div>
                <div className="text-black text-center text-[15px] font-normal leading-5 tracking-[-2%] -mt-2">
                  Watch partner’s ads for 15 seconds
                  and get rewarded!
                </div>
                <ShadowButton
                  action={goToMoneAd}
                  content={"OK"}
                />
              </InfoModal>
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default MainPage;