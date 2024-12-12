import { useState, useEffect, Suspense, useRef } from "react";
import CheckMark from "../svg/check-mark";
import LoadingSpinner from "../svg/loading-spinner";
import toast from "react-hot-toast";
import { ADMIN_WALLET_ADDRESS, REACT_APP_SERVER } from "../../utils/privateData";
import { useAtom } from "jotai";
import { realGameState, TaskContent, userData } from "../../store";
import { Link } from "react-router-dom";
import moment from "moment";
import { isActionState } from "../../store";
import { useTonAddress, useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import { beginCell } from "@ton/ton";
import WarnningIcon from "../svg/warning";
import UserInfoSkeleton from "./userInfoSkeleton";
import InfoModal from "./infoModel";
import ShadowButton from "./shadow-btn";
import { getReward } from "../../utils/globals";
const serverUrl = REACT_APP_SERVER;
import { useNavigate } from "react-router-dom";

const AdController = window.Adsgram.init({ blockId: '5562' });

const GenerateTask = ({ task, stateTask, index, dailytaskIndex, fetchData, claimStateList, setClaimStateList, disableList, setDisableList, moneBtnRef }) => {

  const [isClaim, setIsClaim] = useState(false);
  const [isReal, setIsReal] = useAtom(realGameState);
  const [user, setUser] = useAtom(userData)
  const [isPending, setIsPending] = useState(false)
  const claimStateListData = claimStateList;
  const disableListData = disableList
  let wallet = useTonAddress();
  const tonwallet = useTonWallet()
  const [tonconnectUi] = useTonConnectUI();
  const navigate = useNavigate();
  const Chain = {
    Mainnet: '-239',
    Testnet: '3'
  }
  const headers = new Headers();
  headers.append('Content-Type', 'application/json')
  const adminWalletAddress = ADMIN_WALLET_ADDRESS;

  const ShowAdButton = () => {
    const [showButtonClicked, setShowButtonClicked] = useState(false);
    console.log(task.index)
    const showAd = async () => {
      try {
        let result = false;
        if (task.status == 1) {
          await show_8549848();
          setShowButtonClicked(true);
          result = await addPerformList([task.index]);
        } else {
          setShowButtonClicked(true);
          result = await goClaim(getReward(user.Balance));
        }
        if (result) {
          task.status = !task.status;
        }
        setTimeout(async () => {
          setShowButtonClicked(false);
        }, 10000)
      } catch (err) {
        console.log(err);
        setShowButtonClicked(false);
      }
    };

    return (
      showButtonClicked ?
        <div className="flex w-fit items-center text-center justify-center gap-1">
          <LoadingSpinner className="w-4 h-4 my-auto mx-0 stroke-white" />
        </div> :
        (
          <button
            className={`rounded-lg w-[61px] py-1 px-0 h-7 text-center text-[14px] 
              ${task.status == 1 ?
                (task.highLight == 1 ? "bg-mainYellow text-main" : "bg-mainFocus text-white") :
                'bg-white text-[#080888]'}`}
            onClick={showAd}
            ref={moneBtnRef}
          >
            {task.status == 1 ?
              "Start" :
              "Claim"}
          </button>
        )
    )
  }

  const ShowADgramButton = () => {
    const [showButtonClicked, setShowButtonClicked] = useState(false);

    const showAd = async () => {
      setShowButtonClicked(true);
      try {
        let result = false;
        if (task.status == 1) {
          await AdController.show();
          setShowButtonClicked(true);
          result = await addPerformList([task.index]);
        } else {
          setShowButtonClicked(true);
          result = await goClaim(getReward(user.Balance));
        }
        if (result) {
          task.status = !task.status;
        }
        setTimeout(async () => {
          setShowButtonClicked(false);
        }, 10000)
      } catch (err) {
        console.log(err);
        setShowButtonClicked(false);
      }
    };

    return (
      showButtonClicked ?
        <div className="flex w-fit items-center text-center justify-center gap-1">
          <LoadingSpinner className="w-4 h-4 my-auto mx-0 stroke-white" />
        </div> :
        (
          <button
            className={`rounded-lg w-[61px] py-1 px-0 h-7 text-center text-[14px] 
              ${task.status == 1 ?
                (task.highLight == 1 ? "bg-mainYellow text-main" : "bg-mainFocus text-white") :
                'bg-white text-[#080888]'}`}
            onClick={showAd}
          >
            {task.status == 1 ?
              "Start" :
              "Claim"}
          </button>
        )
    )
  }

  const ShowPromoLinkButton = () => {
    const [showButtonClicked, setShowButtonClicked] = useState(false);

    const showAd = async () => {
      setShowButtonClicked(true);
      try {
        let result = false;
        if (task.status == 1) {
          window.open(task.link, '_blank');
          setShowButtonClicked(true);
          result = await addPerformList([task.index])
        } else {
          result = await goClaim(getReward(user.Balance));
        }
        if (result) {
          task.status = !task.status;
        }
        setTimeout(async () => {
          setShowButtonClicked(false);
        }, 10000)
      } catch (err) {
        console.log(err);
        setShowButtonClicked(false);
      }
    };

    return (
      showButtonClicked ?
        <div className="flex w-fit items-center text-center justify-center gap-1">
          <LoadingSpinner className="w-4 h-4 my-auto mx-0 stroke-white" />
        </div> :
        (
          <button
            className={`rounded-lg w-[61px] py-1 px-0 h-7 text-center text-[14px] 
              ${task.status == 1 ?
                (task.highLight == 1 ? "bg-mainYellow text-main" : "bg-mainFocus text-white") :
                'bg-white text-[#080888]'}`}
            onClick={showAd}
          >
            {task.status == 1 ?
              "Start" :
              "Claim"}
          </button>
        )
    )
  }

  const ShowStarButton = () => {
    const [showButtonClicked, setShowButtonClicked] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [rewardAmount, setRewardAmount] = useState(Math.round(task.reward / 10));

    const handleStartClick = () => {
      setShowModal(true);
    };

    const showAd = async () => {
      setShowButtonClicked(true);
      setShowModal(false);
      try {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        const result = await fetch(`${serverUrl}/pay_telegramstar`, {
          method: 'POST',
          body: JSON.stringify({
            userId: user.UserId,
            isReal: isReal,
            amount: rewardAmount
          }),
          headers
        });
        const { invoiceUrl } = await result.json();
        const webapp = window.Telegram.WebApp;
        webapp.openInvoice(invoiceUrl, async (status) => {
          console.log("status", status, "userId", user.UserId, "isReal", isReal, "task", task, "rewardAmount", rewardAmount);
          
          if (status == "paid") {
            await fetch(`${serverUrl}/perform_dailyADS`, {
              method: 'POST',
              body: JSON.stringify({
                userId: user.UserId,
                isReal: isReal,
                amount: rewardAmount * 10,
                task: task.index
              }),
              headers
            });
            toast(`${rewardAmount * 10} coins added to your balance`, {
              position: "top-center",
              icon: <CheckMark />,
              style: {
                borderRadius: '8px',
                background: '#7886A0',
                color: '#fff',
                width: '90vw'
              },
            });
            updateBalance(reward);
          }
          setTimeout(() => setShowButtonClicked(false), 1000);
        });
      } catch (error) {
        console.log(error);
        setTimeout(() => setShowButtonClicked(false), 1000);
      }
    };

    return (
      <>
        {showButtonClicked ? (
          <div className="flex w-fit items-center text-center justify-center gap-1">
            <LoadingSpinner className="w-4 h-4 my-auto mx-0 stroke-white" />
          </div>
        ) : (
          <button
            className={`rounded-lg w-[61px] py-1 px-0 h-7 text-center text-[14px] 
                        ${task.status == 1 ?
                (task.highLight == 1 ? "bg-mainYellow text-main" : "bg-mainFocus text-white") :
                'bg-white text-[#080888]'}`}
            onClick={handleStartClick}
          >
            {task.status == 1 ? "Start" : "Claim"}
          </button>
        )}

        <InfoModal
          title="Set Reward Amount"
          isOpen={showModal}
          setIsOpen={setShowModal}
          height={"h-fit"}
        >
          <div className="flex flex-col gap-4 items-center">
            <input
              type="number"
              value={rewardAmount}
              onChange={(e) => setRewardAmount(Number(e.target.value))}
              className="w-full px-4 py-2 rounded-lg text-black"
              min="0"
            />
            {rewardAmount}stars = {rewardAmount * 10} coins
            <div className="flex gap-2">
              <ShadowButton
                action={() => setShowModal(false)}
                content="Cancel"
              />
              <ShadowButton
                action={showAd}
                content="Confirm"
              />
            </div>
          </div>
        </InfoModal>
      </>
    );
  };

  const addPerformList = async (performTask) => {
    try {
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      await fetch(`${serverUrl}/add_perform_list`, { method: 'POST', body: JSON.stringify({ userId: user.UserId, performTask: performTask, isReal: isReal }), headers });
      if (!performTask.includes(32) && !performTask.includes(34) && !performTask.includes(36)) {
        stateTask();
      } else {
        return true;
      }
    } catch (error) {
      console.log(error);
      toast.error(error);
      return false;
    }
  }

  const createTransaction = (tokenCount) => {
    const body = beginCell()
      .storeUint(0, 32)
      .storeStringTail("RocketTON Coins purchased")
      .endCell();

    return {

      // The transaction is valid for 10 minutes from now, in unix epoch seconds.
      validUntil: Math.floor(Date.now() / 1000) + 600,
      messages: [
        {
          // The receiver's address.
          address: adminWalletAddress,
          // Amount to send in nanoTON. For example, 0.005 TON is 5000000 nanoTON.
          amount: tokenCount * Math.pow(10, 6),
          // (optional) State initialization in boc base64 format.
          stateInit: 'te6cckEBBAEAOgACATQCAQAAART/APSkE/S88sgLAwBI0wHQ0wMBcbCRW+D6QDBwgBDIywVYzxYh+gLLagHPFsmAQPsAlxCarA==',
          // (optional) Payload in boc base64 format.
          payload: body.toBoc().toString("base64"),
        },
      ],
    };
  }

  const sendTransaction = async (tokenCount) => {

    const tx = createTransaction(tokenCount)
    const userId = user.UserId;
    try {

      if (tonwallet.account.chain === Chain.Mainnet) {
        const transferResult = await tonconnectUi.sendTransaction(tx);
        if (transferResult) {
          fetch(`${serverUrl}/charge_balance`, { method: 'POST', body: JSON.stringify({ userId: userId, amount: tokenCount }), headers })
            .then(() => {
              toast(`${tokenCount} coins added to your balance`,
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
              addPerformList([26]);
            }
            )
        }
      }
      else {
        toast(`Please set mainnet in your wallet!`,
          {
            position: "top-center",
            icon: <WarnningIcon />,
            style: {
              borderRadius: '8px',
              background: '#7886A0',
              color: '#fff',
              width: '90vw'
            },
          })
      }
    } catch (e) {
      toast(`Please check your wallet and transaction!`,
        {
          position: "top-center",
          icon: <WarnningIcon />,
          style: {
            borderRadius: '8px',
            background: '#7886A0',
            color: '#fff',
            width: '90vw'
          },
        })
    }
  }

  const updateBalance = (profit) => {
    setUser(user => {
      const newUserBalance = (parseFloat(user.Balance) + parseFloat(profit)).toFixed(2)
      return { ...user, Balance: newUserBalance }
    })
  };

  const goClaim = async (reward) => {
    setClaimStateList((prev) => [...prev, task.index])
    if (task.index !== dailytaskIndex) {
      if (task.index === 34 || task.index === 32 || task.index === 36) {
        try {
          await fetch(`${serverUrl}/perform_dailyADS`, { method: 'POST', body: JSON.stringify({ userId: user.UserId, isReal: isReal, amount: reward, task: task.index }), headers })
          toast(`${reward} coins added to your balance`,
            {
              position: "top-center",
              icon: <CheckMark />,
              style: {
                borderRadius: '8px',
                background: '#7886A0',
                color: '#fff',
                width: '90vw'
              },
            }
          )
          updateBalance(reward)
          return true;
        } catch (error) {
          console.log(error);
          toast.error(error);
          return false;
        }
      } else {
        fetch(`${serverUrl}/task_balance`, { method: 'POST', body: JSON.stringify({ userId: user.UserId, amount: task.amount, task: task.index, isReal: isReal }), headers })
          .then(res => Promise.all([res.status, res.json()]))
          .then(() => {
            try {
              toast(`${task.amount} coins added to your balance`,
                {
                  position: "top-center",
                  icon: <CheckMark />,
                  style: {
                    borderRadius: '8px',
                    background: '#7886A0',
                    color: '#fff',
                    width: '90vw'
                  },
                }
              )
              updateBalance(parseFloat(task.amount))
            } catch (e) {
              console.log(e);
            }
            stateTask()
          })
      }
    } else {
      let dailyAmount = parseFloat(task.amount.split(" ")[0])
      fetch(`${serverUrl}/perform_dailyReward`, { method: 'POST', body: JSON.stringify({ userId: user.UserId, isReal: isReal, amount: dailyAmount, consecutiveDays: user.DailyConsecutiveDays }), headers })
        .then(res => Promise.all([res.status, res.json()]))
        .then(() => {
          try {
            toast(`${dailyAmount} coins added to your balance`,
              {
                position: "top-center",
                icon: <CheckMark />,
                style: {
                  borderRadius: '8px',
                  background: '#7886A0',
                  color: '#fff',
                  width: '90vw'
                },
              }
            )
            updateBalance(dailyAmount)
          } catch (e) {
            // eslint-disable-next-line no-self-assign
            console.log(e);
          }
          stateTask()

        })
    }
  }

  const followHandle = (index) => {
    setIsPending(true)
    window.open(task.link, '_blank')
    fetch(`${serverUrl}/add_perform_list`, { method: 'POST', body: JSON.stringify({ userId: user.UserId, performTask: [task.index,], isReal: isReal }), headers })
    setTimeout(() => {
      fetchData()
    }, 1000 * 60)
    return () => setIsPending(false)
  }

  return (
    <div className={`${(task.status != 2 && task.highLight == 1) ? "bg-[url('/image/task-bg.png')] border-2 border-[#FFD700]" : "bg-[#0000001A] border-0"} bg-cover rounded-lg flex justify-between items-center gap-2 py-2 pl-2 pr-4 text-[14px]`}>
      <div className="flex gap-2 items-center">
        <img src={task.src} alt="" className="w-8 h-8 rounded-full" />
        <div className="flex flex-col">
          <div className={`${(task.status != 2 && task.highLight == 1) == 1 ? "text-[#FAE66C]" : "text-white"}`}>{task.title}</div>
          <div className={`${(task.status != 2 && task.highLight == 1) == 1 ? "text-[#FAE66C99]" : "text-[#ffffff99]"} w-[210px]`}>
            +{
              (task.index === 32 || task.index == 34 || task.index == 36) ?
                getReward(user.Balance) :
                task.amount
            }
          </div>
        </div>
      </div>
      {
        task.index === 32 || task.index == 34 || task.index == 36 || task.index == 41 ?
          (
            task.index == 32 ?
              <ShowAdButton /> :
              (
                task.index == 34 ?
                  <ShowPromoLinkButton /> :
                  (
                    task.index == 36 ?
                      <ShowADgramButton /> :
                      <ShowStarButton />
                  )
              )
          ) :
          task.status === 1 ?
            (
              (task.link === null || task.link === "") ?
                (
                  (task.index === 25 || task.index === 26 && !wallet) ?
                    <button
                      className={`${(task.status != 2 && task.highLight == 1) ? "bg-mainYellow text-main" : "bg-mainFocus text-white"} rounded-lg w-[61px] py-1 px-0 h-7 text-center text-[14px]`}
                      onClick={() => navigate('/wallet')}
                    >
                      Start
                    </button> :
                    (
                      (task.index === 26 && wallet) ?
                        <button className={`rounded-lg w-[61px] py-1 px-0 h-7 ${(task.status != 2 && task.highLight == 1) ? "bg-mainYellow text-main" : "bg-mainFocus text-white"} text-center text-[14px]`} onClick={() => sendTransaction(500)} >
                          Start
                        </button> :
                        <button
                          className={`${(task.status != 2 && task.highLight == 1) ? "bg-mainYellow text-main" : "bg-mainFocus text-white"} rounded-lg w-[61px] py-1 px-0 h-7 text-center text-[14px]`}
                          onClick={() => navigate('/play')}
                        >
                          Start
                        </button>
                    )
                ) :
                (
                  isPending ?
                    <div className="flex w-fit items-center text-center justify-center gap-1">
                      <LoadingSpinner className="w-4 h-4 my-auto mx-0 stroke-white" />
                    </div> :
                    <button className={`${(task.status != 2 && task.highLight == 1) ? "bg-mainYellow text-main" : "bg-mainFocus text-white"} rounded-lg w-[61px] py-1 px-0 h-7 text-center text-[14px]`}
                      onClick={() => followHandle(task.index)} >
                      Start
                    </button>
                )
            ) :
            (
              task.status === 0 ?
                (
                  claimStateListData.includes(task.index) ?
                    <div className="flex w-fit items-center text-center justify-center gap-1">
                      <LoadingSpinner className="w-4 h-4 my-auto mx-0 stroke-white" />
                    </div> :
                    <button
                      className="rounded-lg w-[61px] py-1 px-0 h-7 bg-white text-[#080888] text-center text-[14px]"
                      onClick={goClaim}
                      disabled={claimStateListData.includes(task.index)}
                    >
                      Claim
                    </button>
                ) :
                <div className="text-white">
                  <CheckMark />
                </div>)
      }
    </div>
  )
}

const TaskList = ({ filter }) => {
  let taskState = [];

  const [otherTaskData, setOtherTaskData] = useState([]);
  const [isReal, setIsReal] = useAtom(realGameState)
  const [taskList, setTaskList] = useAtom(TaskContent)
  const [user, setUser] = useAtom(userData)
  const [loading, setLoading] = useState(true)
  const [firstLoading, setFirstLoading] = useState(true);
  const [isAction, setActionState] = useAtom(isActionState);
  const [fixedTaskData, setFixedTaskData] = useState([]);
  const [claimStateList, setClaimStateList] = useState([]);
  const [disableList, setDisableList] = useState([]);
  const [adState, setAdState] = useState(false);
  const [moneAdState, setMoneAdState] = useState(0);
  const moneBtnRef = useRef();
  const headers = new Headers();
  headers.append('Content-Type', 'application/json')

  let dailytaskIndex = 3
  let dailyADSIndex = 34
  let performTask = []
  let dailyDays = 1;
  let dailyState = 0;
  let dailyADSState = 0;

  useEffect(() => {
    let isMounted = true
    if (isMounted) {
      stateTask();
    }
    return () => { isMounted = false }
  }, [])

  const fetchData = async () => {
    const result = await fetch(`${serverUrl}/task_perform`, { method: 'POST', body: JSON.stringify({ userId: user.UserId }), headers });
    const data = await result.json();
    try {
      const userBalance = isReal ? parseFloat(data.balance.real.toFixed(2)) : parseFloat(data.balance.virtual.toFixed(2));
      setUser(user => ({ ...user, Balance: userBalance }))
      const performtask = isReal ? data.task.real.achieve_task : data.task.virtual.achieve_task
      const doneTask = isReal ? data.task.real.done_task : data.task.virtual.done_task
      taskState = new Array(taskList.length).fill(1)
      performtask.forEach(item => {
        taskState[item] = 0;
      })
      doneTask.forEach(item => {
        taskState[item] = 2;
      })
      const res = await fetch(`${serverUrl}/check_dailyReward`, { method: 'POST', body: JSON.stringify({ userId: user.UserId }), headers });
      const dailyData = await res.json();
      const dailyDate = dailyData.dailyRewardInfo.date;
      const dailyADSDate = dailyData.dailyADSInfo.date;
      dailytaskIndex = taskList[taskList.findIndex(item => item.type === 'daily_reward')].index
      dailyADSIndex = taskList[taskList.findIndex(item => item.index === 34)].index
      console.log("daily ads index : ", dailyADSIndex)
      dailyDays = dailyData.dailyRewardInfo.consecutive_days
      setUser((user) => ({ ...user, DailyConsecutiveDays: dailyDays + 1 }));
      const nowDate = moment().startOf('day');
      if (dailyDate === "") dailyState = 0;
      else {
        const selectedDate = moment(dailyDate).utc().local().startOf('day');
        const diffDate = nowDate.diff(selectedDate, 'days');
        if (diffDate >= 1) dailyState = 0;
        else dailyState = 2;
        if (diffDate >= 2) {
          setUser((user) => ({ ...user, DailyConsecutiveDays: 1 }))
          dailyDays = 0;
        };
      }
      if (dailyADSDate === "") dailyADSState = 1;
      else {
        const selectedDate = moment(dailyADSDate).utc().local().startOf('day');
        const diffDate = nowDate.diff(selectedDate, 'days');
        if (diffDate > 0) dailyADSState = 1;
        else dailyADSState = 2;
      }

      const res_task = await fetch(`${serverUrl}/get_task`, { method: 'POST', body: JSON.stringify({ userId: user.UserId }), headers })
      const data_task = await res_task.json();
      const taskItemData = data_task.task;
      const fixedTaskItems = taskItemData.filter(item => (item.fixed === 1 && item.type !== "daily_reward"));
      const otherTaskItems = taskItemData.filter(item => (item.fixed !== 1));
      let dailyItemData = {}
      if (fixedTaskItems.length > 0) {
        const dailyData = taskItemData.find(item => item.type === "daily_reward");
        if (dailyData) {
          dailyItemData = {
            src: dailyData.icon_url,
            title: dailyData.title,
            amount: (dailyData.amount + (20 * dailyDays) + " Coins " + dailyData.description),
            status: dailyState,
            link: dailyData.link_url,
            index: dailyData.index,
            sort: dailyData.sort
          }
        }

        const _fixedTaskData = fixedTaskItems.map(item => {
          console.log("dailyADSState", dailyADSState)
          console.log("taskState", taskState[item.index])
          item.index == 32 && setMoneAdState(taskState[item.index])

          return {
            src: item.icon_url,
            title: item.title,
            amount: (item.amount + " Coins"),
            status: taskState[item.index],
            link: item.link_url,
            index: item.index,
            sort: item.sort,
            filter: item.filter,
            highLight: item.highLight,
            reward: item.amount
          };

        })
        setFixedTaskData([dailyItemData, ..._fixedTaskData])
      }

      if (otherTaskItems.length > 0) {
        const _otherTaskData = otherTaskItems.map(item => {
          return {
            src: item.icon_url,
            title: item.title,
            amount: (item.amount + " Coins"),
            status: taskState[item.index],
            link: item.link_url,
            index: item.index,
            sort: item.sort,
            filter: item.filter,
            highLight: item.highLight,
            reward: item.amount
          };
        });

        setOtherTaskData(_otherTaskData);
        setDisableList([]);
        setClaimStateList([]);
      }
    } catch (e) {
      // eslint-disable-next-line no-self-assign
      console.log(e);
    }
  }

  const stateTask = async () => {
    performTask = []

    // await fetch(`${serverUrl}/add_perform_list`, { method: 'POST', body: JSON.stringify({ userId: user.UserId, performTask: performTask, isReal: isReal }), headers })
    await fetchData();
    user.watchAd < 2 && setAdState(true);
  }

  const goToMoneAd = async () => {
    setUser({ ...user, watchAd: 2 });
    setAdState(false);
    try {
      console.log("button no clicked");
      await show_8549848();
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      await fetch(`${serverUrl}/add_perform_list`, { method: 'POST', body: JSON.stringify({ userId: user.UserId, performTask: [32], isReal: isReal }), headers });
      console.log("perform list added");
      stateTask();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Suspense fallback={<fetchData />}>
      <div className="flex flex-col gap-2 text-[14px] overflow-auto pb-4" style={{ height: "calc(100vh - 215px)" }}>
        {
          fixedTaskData.length === 0 && otherTaskData.length === 0
            ?
            <div className="flex flex-col gap-2 w-full">
              <UserInfoSkeleton />
              <UserInfoSkeleton />
            </div>
            :
            <>
              {
                fixedTaskData
                  .sort((a, b) => (a.sort - b.sort))
                  .map((_task, _index) => (_task.filter == filter || filter == 0) && <GenerateTask task={_task} stateTask={stateTask} key={_index} index={_index} dailytaskIndex={dailytaskIndex}
                    fetchData={fetchData} claimStateList={claimStateList} setClaimStateList={setClaimStateList} disableList={disableList} setDisableList={setDisableList} moneBtnRef={moneBtnRef} />)
              }
              {
                otherTaskData
                  .sort((a, b) => (a.status - b.status || a.sort - b.sort))
                  .map((_task, _index) => (_task.filter == filter || filter == 0) && <GenerateTask task={_task} stateTask={stateTask} key={_index + 1} index={_index + 1} dailytaskIndex={dailytaskIndex}
                    claimStateList={claimStateList} setClaimStateList={setClaimStateList} fetchData={fetchData} disableList={disableList} setDisableList={setDisableList} moneBtnRef={moneBtnRef} />)
              }
            </>
        }
      </div>
      <InfoModal title="Get Rewards Now!" isOpen={adState} setIsOpen={() => { setAdState(false); setUser({ ...user, watchAd: 2 }) }} height={"h-fit"} className={'bg-[url("/image/star-bg.png")] bg-[#FAD557]'}>
        <div className="flex items-center justify-center gap-2">
          <img
            src={`image/coin-y.svg`}
            className="w-8 h-8"
            alt="coin"
          />
          <span className="font-bold text-[32px] text-black">{getReward(user.Balance)}</span>
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
    </Suspense>
  )
}

export default TaskList;