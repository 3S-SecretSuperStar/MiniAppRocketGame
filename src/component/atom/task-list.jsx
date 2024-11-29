import { useState, useEffect, Suspense } from "react";
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
// import React from "react";

const serverUrl = REACT_APP_SERVER;


const AdController = window.Adsgram.init({ blockId: '5562' });


const GenerateTask = ({ task, stateTask, index, dailytaskIndex, fetchData, claimStateList, setClaimStateList, disableList, setDisableList }) => {

  const [isClaim, setIsClaim] = useState(false);
  const [isReal, setIsReal] = useAtom(realGameState);
  const [user, setUser] = useAtom(userData)
  const [isPending, setIsPending] = useState(false)
  const claimStateListData = claimStateList;
  const disableListData = disableList
  let wallet = useTonAddress();
  const tonwallet = useTonWallet()
  const [tonconnectUi] = useTonConnectUI();
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
          result = await goClaim();
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
        <LoadingSpinner className="w-4 h-4 mx-auto" /> :
        (
          <button className={`rounded-lg w-[61px] py-1 px-0 h-7 text-center text-[14px] ${task.status ? 'bg-mainFocus text-white' : 'bg-white text-[#080888]'}`}
            onClick={showAd} disabled={isPending}>
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
          result = await goClaim();
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
        <LoadingSpinner className="w-4 h-4 mx-auto" /> :
        (
          <button className={`rounded-lg w-[61px] py-1 px-0 h-7 text-center text-[14px] ${task.status ? 'bg-mainFocus text-white' : 'bg-white text-[#080888]'}`}
            onClick={showAd} disabled={isPending}>
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
          result = await goClaim();
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
        <LoadingSpinner className="w-4 h-4 mx-auto" /> :
        (
          <button className={`rounded-lg w-[61px] py-1 px-0 h-7 text-center text-[14px] ${task.status ? 'bg-mainFocus text-white' : 'bg-white text-[#080888]'}`}
            onClick={showAd} disabled={isPending}>
            {task.status == 1 ?
              "Start" :
              "Claim"}
          </button>
        )
    )
  }

  const addPerformList = async (performTask) => {
    try {
      const headers = new Headers();
      headers.append('Content-Type', 'application/json')
      await fetch(`${serverUrl}/add_perform_list`, { method: 'POST', body: JSON.stringify({ userId: user.UserId, performTask: performTask, isReal: isReal }), headers });
      if (!performTask.includes('32') && !performTask.includes('34') && !performTask.includes('36')) {
        console.log("state task log");
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

  const goClaim = async () => {
    setClaimStateList((prev) => [...prev, task.index])
    if (task.index !== dailytaskIndex) {
      if (task.index === 34 || task.index === 32 || task.index === 36) {
        try {
          await fetch(`${serverUrl}/perform_dailyADS`, { method: 'POST', body: JSON.stringify({ userId: user.UserId, isReal: isReal, amount: task.amount, task: task.index }), headers })
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
          updateBalance(task.amount)
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
    <div className="bg-[#0000001A] rounded-lg flex justify-between items-center gap-2 py-2 pl-2 pr-4 text-[14px]">
      <div className="flex gap-2 items-center">
        <img src={task.src} alt="" className="w-8 h-8 rounded-full" />
        <div className="flex flex-col">
          <div className="text-white">{task.title}</div>
          <div className="text-[#ffffff99] w-[210px]">+{task.amount}</div>
        </div>
      </div>
      {
        task.index === 32 || task.index == 34 || task.index == 36 ?
          (
            task.index == 32 ?
              <ShowAdButton /> :
              (
                task.index == 34 ?
                  <ShowPromoLinkButton /> :
                  <ShowADgramButton />
              )
          ) :
          task.status === 1 ?
            (
              (task.link === null || task.link === "") ?
                (
                  (task.index === 25 || task.index === 26 && !wallet) ?
                    <Link to={'/wallet'}>
                      <button className="rounded-lg w-[61px] py-1 px-0 h-7 bg-mainFocus text-white text-center text-[14px]" >
                        Start
                      </button>
                    </Link> :
                    (
                      (task.index === 26 && wallet) ?
                        <button className="rounded-lg w-[61px] py-1 px-0 h-7 bg-mainFocus text-white text-center text-[14px]" onClick={() => sendTransaction(500)} >
                          Start
                        </button> :
                        <Link to={'/play'}>
                          <button className="rounded-lg w-[61px] py-1 px-0 h-7 bg-mainFocus text-white text-center text-[14px]" >
                            Start
                          </button>
                        </Link>
                    )
                ) :
                <button className="rounded-lg w-[61px] py-1 px-0 h-7 bg-mainFocus text-white text-center text-[14px]"
                  onClick={() => followHandle(task.index)} >
                  {
                    isPending ?
                      <div className="flex w-full items-center text-center justify-center gap-1">
                        <LoadingSpinner className="w-4 h-4 my-auto mx-0 stroke-white" />
                        Wait
                      </div> :
                      "Start"
                  }
                </button>
            ) :
            (
              task.status === 0 ?
                <button
                  className="rounded-lg w-[61px] py-1 px-0 h-7 bg-white text-[#080888] text-center text-[14px]"
                  onClick={goClaim}
                  disabled={claimStateListData.includes(task.index)}
                >
                  {
                    claimStateListData.includes(task.index) ?
                      <LoadingSpinner className="w-4 h-4 mx-auto" /> :
                      "Claim"
                  }
                </button> :
                <div className="text-white">
                  <CheckMark />
                </div>)
      }
    </div>
  )
}

const TaskList = () => {
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
    fetch(`${serverUrl}/task_perform`, { method: 'POST', body: JSON.stringify({ userId: user.UserId }), headers })
      .then(res => Promise.all([res.status, res.json()]))
      .then(async ([status, data]) => {
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

          fetch(`${serverUrl}/get_task`, { method: 'POST', body: JSON.stringify({ userId: user.UserId }), headers })
            .then(res => Promise.all([res.status, res.json()]))
            .then(([status, data]) => {
              try {
                const taskItemData = data.task;
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

                    return {
                      src: item.icon_url,
                      title: item.title,
                      amount: (item.amount + " Coins"),
                      status: taskState[item.index],
                      link: item.link_url,
                      index: item.index,
                      sort: item.sort
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
                      sort: item.sort
                    };
                  });

                  setOtherTaskData(_otherTaskData);
                  setDisableList([]);
                  setClaimStateList([]);
                }
              } catch (e) {
                console.log(e)
                setDisableList([]);
                setClaimStateList([]);
              }
            })
        } catch (e) {
          // eslint-disable-next-line no-self-assign
          console.log(e);
        }

      })
  }

  const stateTask = async () => {
    performTask = []

    // await fetch(`${serverUrl}/add_perform_list`, { method: 'POST', body: JSON.stringify({ userId: user.UserId, performTask: performTask, isReal: isReal }), headers })
    fetchData()
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
                  .map((_task, _index) => <GenerateTask task={_task} stateTask={stateTask} key={_index} index={_index} dailytaskIndex={dailytaskIndex}
                    fetchData={fetchData} claimStateList={claimStateList} setClaimStateList={setClaimStateList} disableList={disableList} setDisableList={setDisableList} />)
              }
              {
                otherTaskData
                  .sort((a, b) => (a.status - b.status || a.sort - b.sort))
                  .map((_task, _index) => <GenerateTask task={_task} stateTask={stateTask} key={_index + 1} index={_index + 1} dailytaskIndex={dailytaskIndex}
                    claimStateList={claimStateList} setClaimStateList={setClaimStateList} fetchData={fetchData} disableList={disableList} setDisableList={setDisableList} />)
              }
            </>
        }
      </div>
    </Suspense>
  )
}

export default TaskList;