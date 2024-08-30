import React, { useState, useContext, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
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
import { isActionState, realGameState, userData } from "../store";
import { avatar } from "../assets/avatar";
import { Img } from "../assets/image";
import { RANKINGDATA } from "../utils/globals.js";
import { REACT_APP_SERVER } from "../utils/privateData.js";
import TgIcon from "../assets/icon/tg-icon";
import TgInst from "../assets/icon/tg-inst";
import TgTwitter from "../assets/icon/tg-twitter";
import TgYout from "../assets/icon/tg-yout";
import rewardBG from "../assets/image/reward_bg.png"
import "../css/Style.css"
import TabButton from "../component/atom/tab-button.jsx";
import AutoIcon from "../component/svg/auto-icon.jsx";



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
  const [lostCoefficient,] = useState(1);
  const [, setLoaderIsShown] = useState();
  const [operationAfterLoss, setOperationAfterLoss] = useState('Increase Bet by');
  const [operationAfterWin, setOperationAfterWin] = useState('Return to base Bet');
  const [rewardState, setRewardState] = useState(false);
  const [stopWasPressed, setStopWasPressed] = useState(false);
  const [valueAfterLoss, setValueAfterLoss] = useState(2);
  const [valueAfterWin, setValueAfterWin] = useState(1);
  const [winCoefficient, setWinCoefficient] = useState(1);
  const [wins, setWins] = useState(0);
  const [socketStart, setSocketStart] = useState(false);
  const [isReal, setRealGame] = useAtom(realGameState);
  const [user, setUser] = useAtom(userData);
  const [winState, setWinstate] = useState(false);


  // Refs for mutable state
  const balanceRef = useRef(balance);
  const historyGamesRef = useRef(historyGames);
  const betRef = useRef(bet);
  const operationAfterWinRef = useRef(operationAfterWin);
  const valueAfterWinRef = useRef(valueAfterWin);
  const operationAfterLossRef = useRef(operationAfterLoss);
  const valueAfterLossRef = useRef(valueAfterLoss);
  const navigate = useNavigate();
  const [tabId, setTabId] = useState(1);

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
    setIsModalOpen(false);
  }
  setRealGame(true)
  // Effect to validate and adjust state values
  useEffect(() => {
    if (bet < 1 || balance === '0.00' || balance < 1) {
      setBet(1);
    } else if (bet > balance && balance !== '0.00') {
      setBet(parseFloat(balance));
    }

    if (autoStop < 1.1) {
      setAutoStop(1.1)
    } else if (autoStop > 100) {
      setAutoStop(100)
    }

    if (balance === 0) {
      setBalance('0.00')
    }

    if (valueAfterWin < 1) {
      setValueAfterWin(1)
    }

    if (valueAfterWin > 100) {
      setValueAfterWin(100)
    }

    if (valueAfterLoss < 1) {
      setValueAfterLoss(1)
    }

    if (valueAfterLoss > 100) {
      setValueAfterLoss(100)
    }

  }, [bet, autoStop, balance, valueAfterLoss, valueAfterWin]);

  useEffect(() => {
    operationAfterWinRef.current = operationAfterWin;
    valueAfterWinRef.current = valueAfterWin;
    operationAfterLossRef.current = operationAfterLoss;
    valueAfterLossRef.current = valueAfterLoss;
  }, [operationAfterWin, valueAfterWin, operationAfterLoss, valueAfterLoss]);

  useEffect(() => {
    let isMounted = true
    if (gamePhase !== 'started' && autoMode && !stopWasPressed && balanceRef.current >= betRef.current && betRef.current) {
      if (isMounted) {
        try {
          setStopWasPressed(false);
          setGamePhase('started')
          setSocketStart(false);
          setActionState("start");
          context.socket.onmessage = async e => {
            const data = JSON.parse(e.data);
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
        } catch (e) {

          // eslint-disable-next-line no-self-assign
          document.location.href = document.location.href
        }
      }
    }
    return () => { isMounted = false }
  }, [historyGames])

  useEffect(() => {
    const webapp = window.Telegram.WebApp.initDataUnsafe;
    let isMounted = true
    if (webapp) {

      const realName = webapp["user"]["first_name"] + " " + webapp["user"]["last_name"];
      const userName = webapp["user"]["username"];

      const headers = new Headers()
      headers.append('Content-Type', 'application/json')
      if (isMounted) {
        fetch(`${serverUrl}/users_info`, { method: 'POST', body: JSON.stringify({ historySize: 100, realName: realName, userName: userName }), headers })
          .then(res => Promise.all([res.status, res.json()]))
          .then(([status, data]) => {
            try {

              const myData = data.allUsersData
                .sort((a, b) => b.balance.real - a.balance.real)
                .map((i, index) => { i.rank = index + 1; return i })
                .filter(i => i.name === realName)[0] //--------------------------
              setGames(myData)

              const newBalance = parseFloat(isReal ? myData.balance.real : myData.balance.virtual).toFixed(2)
              balanceRef.current = newBalance
              setFirstLogin(myData.first_state !== "false");
              setRewardState(myData.first_state !== "false");
              setBalance(newBalance)
              setUser({
                RealName: realName, UserName: userName,
                Balance: isReal ? myData.balance.real.toFixed(2) : myData.balance.virtual.toFixed(2),
                GameWon: isReal ? myData.realWins : myData.virtualWins,
                GameLost: isReal ? myData.realLosses : myData.virtualLosses,
                Rank: myData.rank, Ranking: myData.ranking
              })
              const newHistoryGames = isReal ? myData.gamesHistory.real : myData.gamesHistory.virtual
              historyGamesRef.current = newHistoryGames
              setHistoryGames(newHistoryGames)
              setLoaderIsShown(false)
            } catch (e) {
              // eslint-disable-next-line no-self-assign
              document.location.href = document.location.href
            }
          })
        fetch(`${serverUrl}/check_first`, { method: 'POST', body: JSON.stringify({ userName: userName }), headers })
      }
    }
    return () => { isMounted = false }

  }, [isReal, gamePhase])  

  
  // Function to start the game
  const startGame = () => {
    setStopWasPressed(false);
    setGamePhase('started')
    setSocketStart(false);
    setActionState("start");

    context.socket.onmessage = async e => {
      const data = JSON.parse(e.data);
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
    const animation = document.getElementById('stars').style.animation
    document.getElementById('stars').style.animation = 'none'
    setTimeout(() => {
      setFinalResult(0);
      setGamePhase('started');
      document.getElementById('stars').style.animation = animation;
    }, 50);
  };

  const handleGameStopped = (data = { stop: 'x', profit: '0' }) => {
    setActionState("stop");
    setWinstate(false);
    setFinalResult(data.stop);
    setGamePhase('stopped');
    updateGameHistory(data, 'stopped');
    const newBalance = (parseFloat(balanceRef.current) + parseFloat(data.profit)).toFixed(2)
    setBalance(newBalance)
    balanceRef.current = newBalance
    updateBalance(data.profit);
    setGames(games + 1);
    setWins(wins + 1);

    adjustBetAfterWin();
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
  };

  const handleGameCrashed = (data) => {
    setActionState("stop");
    setFinalResult('Crashed...');
    setGamePhase('crashed');
    updateGameHistory(data, 'crashed');
    updateBalance(data.profit);
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
    balanceRef.current = newBalance;
  };

  const adjustBetAfterWin = () => {
    if (autoMode) {
      if (operationAfterWinRef.current === 'Increase Bet by') {
        betRef.current = Math.min(betRef.current * valueAfterWinRef.current, balanceRef.current);
      } else {
        betRef.current = Math.min(valueAfterWinRef.current, balanceRef.current);
      }
      setBet(betRef.current);
    }
  };


  const adjustBetAfterLoss = () => {
    if (autoMode) {
      if (operationAfterLossRef.current === 'Increase Bet by') {
        betRef.current = Math.min(betRef.current * valueAfterLossRef.current, balanceRef.current);
      } else {
        betRef.current = Math.min(valueAfterLossRef.current, balanceRef.current);
      }
      setBet(betRef.current);
    }
  };

  const setPlayMode = (condition) => {
    setAutoMode(condition);
    setIsModalOpen(condition);
  }

  const goToUserInfo = () => {
    navigate("/userInfo");
  }
  if(tabId===2) {
    setTabId(1);
    setInfoState(true)
  }

  console.log("bet: ",bet," betRef: ",betRef.current);
  return (
    <>
      <div className="flex-auto p-4">

        <div id='index-operations' className={`flex flex-col relative h-full w-full gap-4 justify-between ${autoMode ? 'auto-mode' : ''} transition flex flex-col gap-4 ${isAction === "start" ? "pb-0" : "pb-[76px]"}`}>


          <div className={`flex w-full absolute bg-white_20 justify-between transition transform duration-200 p-2 rounded-[10px] text-white text-base leading-5 ${isAction === "start" ? "-translate-y-24" : ""} `} onClick={goToUserInfo}>

            <div className="flex gap-2.5">
              <img src={avatarData[RANKINGDATA.indexOf(user.Ranking)]} width="64px" height="64px" className="max-w-16 h-16" alt="avatar" />
              <div className="flex flex-col w-full gap-0.5">
                <p className="font-semibold">{user.RealName}</p>
                <p className="font-semibold">{user.Ranking} · {RANKINGDATA.indexOf(user.Ranking) + 1}/10</p>
                <p>{user.Rank}</p>
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
            <ShadowButton
              content="Get Rewards"
              className={`relative px-3 py-1 bg-[#84CB69] text-[#080888] shadow-btn-custom-border h-7 text-sm leading-5 w-[108px] font-medium `}
              action={() => setRewardState(false)}
            />
            <div className="absolute w-[30px], h-[30px]  top-0 right-0" onClick={() => setRewardState(false)}>
              <img src="/image/icon/CloseButton.svg" width={30} height={30} className="max-w-[30px] h-[30px]" alt="close" />
            </div>

          </div>
          <TabButton className = {`transform translate-y-[100px] ${isAction === "start" ? "-translate-y-[150px]" : ""} `} tabList={statsList} tabNo={tabId} setTabNo={setTabId} />
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
                  <InputNumber InputProps={{ value: bet, min: 1, step: 1, disabled: gamePhase === 'started', onChange: e => setBet(parseFloat(e.target.value)) }} />
                  <div className="text-xs leading-[14px] text-[#FFFFFFCC]">Minimal Bet is 1 Coin</div>
                </div>

                <div className="flex flex-col w-1/2 gap-1">
                  <div className="text-sm leading-5">Auto Stop</div>
                  <InputNumber InputProps={{ value: autoStop, min: 1.1, max: 100, step: 1, disabled: gamePhase === 'started', type: "xWithNumber", onChange: e => { stopGame(); setAutoStop(e.target.value) } }} />
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
                      action={startGame}
                      content={"Start"}
                      disabled={
                        balance === '0.00' ||
                        bet < 1 || autoStop < 1.1 ||
                        balance < 1 || isNaN(bet) || isNaN(autoStop) || isNaN(valueAfterWin)
                        || isNaN(valueAfterLoss)
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

            <SettingModal icon={<AutoIcon/>} title="Auto Launch" isOpen={isModalOpen} setIsOpen={setIsModalOpen}>
              <div className="flex flex-col justify-between max-h-screen pt-2 px-4 pb-4 h-[calc(100vh-60px)]" >
                <div className="flex flex-col gap-[15px]" >
                  <div className="flex gap-4">
                    <div className="flex flex-col w-1/2 gap-1">
                      <div className="text-sm leading-5">Bet</div>
                      <InputNumber InputProps={{ value: bet, min: 1, step: 1, onChange: e => setBet(parseFloat(e.target.value)) }} />
                      <div className="text-xs leading-[14px] text-[#FFFFFFCC]">Minimal Bet is 1 Coin</div>
                    </div>

                    <div className="flex flex-col w-1/2 gap-1">
                      <div className="text-sm leading-5">Auto Stop</div>
                      <InputNumber InputProps={{ value: autoStop, min: 1.1, max: 100, step: 1, type: "xWithNumber", onChange: e => { stopGame(); setAutoStop(e.target.value) } }} />
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
                      <InputNumber InputProps={{ value: lostCoefficient, min: 1, max: 100, step: 1, type: "xWithNumber", disabled: operationAfterLoss === "Return to base Bet", onChange: e => { stopGame(); setWinCoefficient(parseFloat(e.target.value)) } }} />
                    </div>
                  </div>

                  <div className="flex flex-col gap-[15px]">
                    <div className="flex flex-col w-full gap-1">
                      <div className="text-sm leading-5">If Win</div>
                      <SwitchButtonOption contents={operationOption} setSlot={(e) => setOperationAfterWin(e)} slot={operationAfterWin} />
                    </div>

                    <div className="flex flex-col w-full gap-1">
                      <div className="text-sm leading-5 text-[#FFFFFF99]">Coefficeent</div>
                      <InputNumber InputProps={{ value: winCoefficient, min: 1, max: 100, step: 1, type: "xWithNumber", disabled: operationAfterWin === "Return to base Bet", onChange: e => { stopGame(); setWinCoefficient(e.target.value) } }} />
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
                          balance === '0.00' || bet < 1 || autoStop < 2 ||
                          balance < 1 || isNaN(bet) || isNaN(autoStop) || isNaN(valueAfterWin)
                          || isNaN(valueAfterLoss)
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
                <img src={avatar.avatar1} width="128px" height="128px" className="max-w-[128px] h-[128px]" alt="avatar" />
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
                <img src='/image/icon/rocketx.svg' width="48px" height="48px" className="max-w-[48px] h-[48px]" alt="avatar" />
              </div>
              <div className="flex flex-col gap-6 text-black text-center text-[15px] font-normal leading-5 tracking-[-2%]">
                <div>
                  🛠 Our token is under development!
                </div>
                <div>
                  📢 Join our social media to stay up to date.
                </div>
                <div className="px-8 flex justify-between w-full">
                  <ShadowButton className={"w-8 h-8 flex justify-center p-0 items-center rounded-lg"} content={<TgIcon />}></ShadowButton>
                  <ShadowButton className={"w-8 h-8 flex justify-center p-0 items-center rounded-lg"} content={<TgTwitter />}></ShadowButton>
                  <ShadowButton className={"w-8 h-8 flex justify-center p-0 items-center rounded-lg"} content={<TgInst />}></ShadowButton>
                  <ShadowButton className={"w-8 h-8 flex justify-center p-0 items-center rounded-lg"} content={<TgYout />}></ShadowButton>
                </div>
              </div>

            </InfoModal>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainPage;