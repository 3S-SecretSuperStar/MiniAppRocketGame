import { useState, useEffect, Suspense } from "react";
import CheckMark from "../svg/check-mark";
import LoadingSpinner from "../svg/loading-spinner";
import toast, { useToasterStore } from "react-hot-toast";
import { ADMIN_WALLET_ADDRESS, REACT_APP_SERVER } from "../../utils/privateData";
import { useAtom } from "jotai";
import { realGameState, TaskContent, userData } from "../../store";
import { Link, useActionData } from "react-router-dom";
import moment from "moment";
import FetchLoading from "../template/FetchLoading";
import { isActionState } from "../../store";
import { useTonAddress, useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import { beginCell } from "@ton/ton";
import WarnningIcon from "../svg/warning";

const serverUrl = REACT_APP_SERVER;

const GenerateTask = ({ task, stateTask, index, dailytaskIndex, fetchData, claimStateList, setClaimStateList }) => {


  const [isClaim, setIsClaim] = useState(false);
  const [isReal, setIsReal] = useAtom(realGameState);
  const [user, setUser] = useAtom(userData)
  const [isPending, setIsPending] = useState(false)
  const claimStateListData = claimStateList;
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

  const addPerformList = async (performTask) => {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json')
    console.log("perform task: ", performTask)
    console.log("headers", headers)
    await fetch(`${serverUrl}/add_perform_list`, { method: 'POST', body: JSON.stringify({ userId: user.UserId, performTask: performTask, isReal: isReal }), headers })
      .then(res => Promise.all([res.status, res.json()]))
      .then(() => { stateTask() })
  }
  // console.log(claimStateListData);
  // console.log(claimStateList)
  const createTransaction = (tokenCount) => {
    // console.log("begin  ")
    const body = beginCell()
      .storeUint(0, 32)
      .storeStringTail("RocketTON Coins purchased")
      .endCell()

    // console.log("return before")
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
    // console.log("1 ")


    // console.log("transaction : ", tx)
    const userId = user.UserId;
    // console.log("2 ")
    // console.log("user Id : ", user.UserId)
    // console.log("user Id : ", userId)
    try {

      if (tonwallet.account.chain === Chain.Mainnet) {
        const transferResult = await tonconnectUi.sendTransaction(tx);
        // console.log("transfer result : ", transferResult)
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
              console.log("add perform task 26")
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

  const goClaim = () => {
    setClaimStateList((prev) => [...prev, task.index])
    setIsClaim(true);

    // console.log("task index", task.index)
    if (task.index !== dailytaskIndex) {
      // console.log("index indaily: ", index)
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
            // eslint-disable-next-line no-self-assign
            console.log(e);
          }

          stateTask()


        })
      // stateTask();
    } else {
      let dailyAmount = parseFloat(task.amount.split(" ")[0])
      // console.log("index : ", index)
      // console.log("task index : ", task.index)
      // console.log("Daily Amount : ", dailyAmount)
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
  // console.log("friend number", user.FriendNumber)
  // console.log("user Info in generate task : ", user.DailyConsecutiveDays)
  return (
    <div className="bg-[#0000001A] rounded-lg flex justify-between items-center gap-2 py-2 pl-2 pr-4 text-[14px]">
      <div className="flex gap-2 items-center">
        <img src={`/image/task/${task.src}`} alt="" className="w-8 h-8 rounded-full" />
        <div className="flex flex-col">
          <div className="text-white">{task.title}</div>
          <div className="text-[#ffffff99] w-[210px]">+{task.amount}</div>
        </div>
      </div>
      {
        task.status === 1 ?
          task.link === "" ?
            task.index === 25 || task.index === 26 && !wallet ?
              <Link to={'/wallet'}>
                <button className="rounded-lg w-[61px] py-1 px-0 h-7 bg-[#3861FB] text-white text-center text-[14px]" >
                  Start
                </button>
              </Link> :
              (task.index === 26 && wallet) ?
                <button className="rounded-lg w-[61px] py-1 px-0 h-7 bg-[#3861FB] text-white text-center text-[14px]" onClick={() => sendTransaction(500)} >
                  Start
                </button> :
                <Link to={'/play'}>
                  <button className="rounded-lg w-[61px] py-1 px-0 h-7 bg-[#3861FB] text-white text-center text-[14px]" >
                    Start
                  </button>
                </Link> :

            <button className="rounded-lg w-[61px] py-1 px-0 h-7 bg-[#3861FB] text-white text-center text-[14px]"
              onClick={() => followHandle(task.index)} >
              {
                isPending ?
                  <div className="flex w-full items-center text-center justify-center gap-1">
                    <LoadingSpinner className="w-4 h-4  my-auto mx-0 stroke-white" />
                    Wait
                  </div> :
                  "Start"
              }
            </button>


          :
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
            </div>
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
  const headers = new Headers();
  headers.append('Content-Type', 'application/json')

  let dailytaskIndex = 3
  let performTask = []
  let dailyDays = 1;
  let dailyState = 0;

  const typeToImageMap = {
    'type1-1': { imgSrc: "Type1.png", link: "" },
    'type1-2': { imgSrc: "Type1.png", link: "" },
    'sub-tg': { imgSrc: "Avatar-tg.png", link: "https://t.me/rocketton_official" },
    'join-partner': { imgSrc: "Avatar-partner.png", link: " https://t.me/FileMarketAIPlayBot/game?startapp=13174" },
    'join-tg': { imgSrc: "Avatar-tg.png", link: "https://t.me/RocketTON_Chat" },
    'sub-you': { imgSrc: "Avatar-you.png", link: "https://www.youtube.com/@RocketTON_Official" },
    'sub-X': { imgSrc: "Avatar-X.png", link: "https://x.com/RocketTONApp" },
    'sub-ins': { imgSrc: "Avatar-ins.png", link: "https://www.instagram.com/rocketton_official" },
    'type2-2': { imgSrc: "Type2-2.png", link: "" },
    'type2-3': { imgSrc: "Type2-3.png", link: "" },
    'type2-5': { imgSrc: "Type2-5.png", link: "" },
    'type2-10': { imgSrc: "Type2-10.png", link: "" },
    'type2-25': { imgSrc: "Type2-25.png", link: "" },
    'type3': { imgSrc: "Type3.png", link: "" },
    'type4': { imgSrc: "Type4.png", link: "" },
    'type5': { imgSrc: "Type5.png", link: "" },
    'type6': { imgSrc: "Type6.png", link: "" },
  };


  useEffect(() => {
    let isMounted = true
    if (isMounted) {
      stateTask();
    }
    return () => { isMounted = false }
  }, [])

  const fetchData = async () => {
    await fetch(`${serverUrl}/task_perform`, { method: 'POST', body: JSON.stringify({ userId: user.UserId }), headers })
      .then(res => Promise.all([res.status, res.json()]))
      .then(async ([status, data]) => {
        // console.log("fetch data")

        try {
          // console.log("fetch data : ", data);
          const userBalance = isReal ? parseFloat(data.balance.real.toFixed(2)) : parseFloat(data.balance.virtual.toFixed(2));
          // console.log(userBalance)
          setUser(user => ({ ...user, Balance: userBalance }))
          const performtask = isReal ? data.task.real.achieve_task : data.task.virtual.achieve_task
          const doneTask = isReal ? data.task.real.done_task : data.task.virtual.done_task
          // console.log("perform task", performtask)
          taskState = new Array(taskList.length).fill(1)
          performtask.forEach(item => {
            taskState[item] = 0;
          })
          doneTask.forEach(item => {
            taskState[item] = 2;
          })
          await fetch(`${serverUrl}/check_dailyReward`, { method: 'POST', body: JSON.stringify({ userId: user.UserId }), headers })
            .then(res => Promise.all([res.status, res.json()]))
            .then(([status, data]) => {
              try {
                // console.log(data)
                // console.log(data.dailyRewardInfo)
                const dailyDate = data.dailyRewardInfo.date;
                dailytaskIndex = taskList[taskList.findIndex(item => item.type === 'daily_reward')].index
                dailyDays = data.dailyRewardInfo.consecutive_days
                setUser((user) => ({ ...user, DailyConsecutiveDays: dailyDays + 1 }));
                const nowDate = moment().startOf('day');
                if (dailyDate === "") dailyState = 0;
                else {
                  // console.log("dailyRewardDate : ", dailyDate)
                  const selectedDate = moment(dailyDate).utc().local().startOf('day');
                  // console.log("nowDate : ", nowDate)
                  // console.log("selected date : ", selectedDate)
                  const diffDate = nowDate.diff(selectedDate, 'days');
                  // console.log("diff date : ", diffDate)
                  // console.log('taskstates', taskState)
                  if (diffDate >= 1) dailyState = 0;
                  else dailyState = 2;
                  if (diffDate >= 2) {
                    setUser((user) => ({ ...user, DailyConsecutiveDays: 1 }))
                    dailyDays = 0;
                  };
                }
              } catch (e) {
                console.log(e)
              }
            })

          fetch(`${serverUrl}/get_task`, { method: 'POST', body: JSON.stringify({}), headers })
            .then(res => Promise.all([res.status, res.json()]))
            .then(([status, data]) => {
              try {
                // console.log("task data", data)
                const taskItemData = data.task;
                const fixedTaskItems = taskItemData.filter(item => (item.type === 'type6'));
                const otherTaskItems = taskItemData.filter(item => !(item.type === "daily_reward" || item.type === 'type6'));
                // console.log('otherTaskItems: ', otherTaskItems)
                let dailyItemData = {}
                if (fixedTaskItems.length > 0) {
                  // console.log('fixed task: ', fixedTaskItems)
                  const dailyData = taskItemData.find(item => item.type === "daily_reward");
                  if (dailyData) {
                    dailyItemData = {
                      src: "DailyReward.png",
                      title: dailyData.title,
                      amount: (dailyData.amount + (20 * dailyDays) + " Coins " + dailyData.description),
                      status: dailyState,
                      link: "",
                      index: dailyData.index,
                      sort: dailyData.sort
                    }
                  }
                  // setFixedTaskData([dailyItemData])
                  const _fixedTaskData = fixedTaskItems.map(item => {

                    const { imgSrc, link } = typeToImageMap[item.type];

                    // console.log("item:", item);

                    return {
                      src: imgSrc,
                      title: item.title,
                      amount: (item.amount + " Coins"),
                      status: taskState[item.index],
                      link: link,
                      index: item.index,
                      sort: item.sort
                    };

                  })
                  setFixedTaskData([dailyItemData, ..._fixedTaskData])

                }

                if (otherTaskItems.length > 0) {
                  // console.log('task states:', taskState);
                  const _otherTaskData = otherTaskItems.map(item => {
                    const { imgSrc, link } = typeToImageMap[item.type];

                    // console.log("item:", item);

                    return {
                      src: imgSrc,
                      title: item.title,
                      amount: (item.amount + " Coins"),
                      status: taskState[item.index],
                      link: link,
                      index: item.index,
                      sort: item.sort
                    };
                  });

                  setOtherTaskData(_otherTaskData);
                }
              } catch (e) {
                console.log(e)
              }
              finally {
                setTimeout(() => {
                  setLoading(false)
                  firstLoading && setActionState("ready")
                  setFirstLoading(false);
                }, 500)
              }
            })


        } catch (e) {
          // eslint-disable-next-line no-self-assign
          console.log(e);
        }

      })

  }
  // console.log("taskList: ", taskList)
  // console.log("friend number", user.FriendNumber)
  const stateTask = async () => {
    // console.log("user in state task :", user)
    performTask = []
    performTask = taskList.reduce((performList, task) => {
      const taskType = task.type;
      if (user.GameWon >= task.count && taskType === "type1-1") {
        // console.log("game won : ", user.GameWon)
        // console.log("task count : ", task.count)
        // console.log("task index : ", task.index)
        // console.log("state : ", user.GameWon >= task.count)
        performList.push(task.index)
      }
      if ((user.GameLost + user.GameWon) >= task.count && taskType === "type1-2") {
        performList.push(task.index)
        // console.log("state : ", (user.GameLost + user.GameWon) >= task.count)
      }
      if (task.count <= user.FriendNumber && taskType === "type4")
        performList.push(task.index);
      return performList
    }, [])
    await fetch(`${serverUrl}/add_perform_list`, { method: 'POST', body: JSON.stringify({ userId: user.UserId, performTask: performTask, isReal: isReal }), headers })
      .then(res => Promise.all([res.status, res.json()]))
      .then(async (res) => {
        // console.log("before fetch data")
        await fetchData().then(
          console.log("fetch data")
        )
      })

    // console.log("after fetch data")

  }

  if (loading && firstLoading) {
    setActionState("start")
    return <FetchLoading />
  }
  // console.log("fixedTaskData : ", fixedTaskData)
  // console.log("otherTaskData : ", otherTaskData)
  // console.log("task data of taskData : ", taskData)
  // console.log(user.FriendNumber)
  // console.log("user Info in taskList : ", user.DailyConsecutiveDays)
  return (
    <Suspense fallback={<fetchData />}>
      <div className="flex flex-col gap-2 text-[14px] overflow-auto pb-4" style={{ height: "calc(100vh - 200px)" }}>
        {
          fixedTaskData
            .sort((a, b) => (a.sort - b.sort))
            .map((_task, _index) => <GenerateTask task={_task} stateTask={stateTask} key={_index} index={_index} dailytaskIndex={dailytaskIndex} fetchData={fetchData} claimStateList={claimStateList} setClaimStateList={setClaimStateList} />)
        }
        {
          otherTaskData
            .sort((a, b) => (a.status - b.status || a.sort - b.sort))
            .map((_task, _index) => <GenerateTask task={_task} stateTask={stateTask} key={_index + 1} index={_index + 1} dailytaskIndex={dailytaskIndex} claimStateList={claimStateList} setClaimStateList={setClaimStateList} fetchData={fetchData} />)
        }
      </div>
    </Suspense>
  )
}

export default TaskList;