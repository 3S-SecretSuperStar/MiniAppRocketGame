import { useState, useEffect } from "react";
import CheckMark from "../svg/check-mark";
import LoadingSpinner from "../svg/loading-spinner";
import toast from "react-hot-toast";
import { REACT_APP_SERVER } from "../../utils/privateData";
import { useAtom } from "jotai";
import { realGameState, TaskContent, userData } from "../../store";
import { Link, useActionData } from "react-router-dom";
import moment from "moment";

const serverUrl = REACT_APP_SERVER;

const GenerateTask = ({ task, stateTask, index, dailytaskIndex, fetchData }) => {


  const [isClaim, setIsClaim] = useState(false);
  const [isReal, setIsReal] = useAtom(realGameState);
  const [user, setUser] = useAtom(userData)
  const [isPending, setIsPenging] = useState(false)


  const updateBalance = (profit) => {
    setUser(user => {
      const newUserBalance = (parseFloat(user.Balance) + parseFloat(profit)).toFixed(2)
      return { ...user, Balance: newUserBalance }
    })
  };
  const headers = new Headers()
  headers.append('Content-Type', 'application/json')

  const goClaim = () => {
    setIsClaim(true);

    if (index !== dailytaskIndex) {
      console.log("index daily: ", index)
      fetch(`${serverUrl}/task_balance`, { method: 'POST', body: JSON.stringify({ userId: user.UserId, amount: task.amount, task: index, isReal: isReal }), headers })
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
          setIsClaim(false)
        })
    } else {
      let dailyAmount = parseFloat(task.amount.split(" ")[0])
      console.log("index : ", index)
      console.log("Daily Amount : ", dailyAmount)

      fetch(`${serverUrl}/perform_dailyReward`, { method: 'POST', body: JSON.stringify({ userId: user.UserId, isReal: isReal, amount: dailyAmount }), headers })
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
          setIsClaim(false)
        })
    }
  }
  const followHandle = (index) => {
    setIsPenging(true)
    window.open(task.link, '_blank')
    fetch(`${serverUrl}/add_perform_list`, { method: 'POST', body: JSON.stringify({ userId: user.UserId, performTask: [index,], isReal: isReal }), headers })
    setTimeout(() => {
      fetchData()
    }, 1000 * 60 * 10)

    return () => setIsPenging(false)
  }
  // console.log("friend number", user.FriendNumber)
  // console.log("user Info in generate task : ", user.DailyConsecutiveDays)
  return (
    <div className="bg-[#0000001A] rounded-lg flex justify-between items-center gap-2 py-2 pl-2 pr-4 text-[14px]">
      <div className="flex gap-2 items-center">
        <img src={`/image/task/${task.src}`} alt="" className="w-8 h-8" />
        <div className="flex flex-col">
          <div className="text-white">{task.title}</div>
          <div className="text-[#ffffff99] w-[210px]">+{task.amount}</div>
        </div>
      </div>
      {
        task.status === 0 ?
          task.link === "" ? <Link to={'/play'}>
            <button className="rounded-lg w-[61px] py-1 px-0 h-7 bg-[#3861FB] text-white text-center text-[14px]" >
              Start
            </button>
          </Link> :

            <button className="rounded-lg w-[61px] py-1 px-0 h-7 bg-[#3861FB] text-white text-center text-[14px]"
              onClick={() => followHandle(index)} >
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
          task.status === 1 ?
            <button
              className="rounded-lg w-[61px] py-1 px-0 h-7 bg-white text-[#080888] text-center text-[14px]"
              onClick={goClaim}
            >
              {
                isClaim ?
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

  const [taskData, setTaskData] = useState([]);
  const [isReal, setIsReal] = useAtom(realGameState)
  const [taskList, setTaskList] = useAtom(TaskContent)
  const [user, setUser] = useAtom(userData)
  let dailytaskIndex = 3
  let performTask = []
  let dailyDays = 1;
  const headers = new Headers()
  headers.append('Content-Type', 'application/json')



  const updateBalance = (profit) => {
    setUser(user => {
      const newUserBalance = (parseFloat(user.Balance) + parseFloat(profit)).toFixed(2)
      return { ...user, Balance: newUserBalance }
    })
  };

  const fetchData = async () => {
    await fetch(`${serverUrl}/task_perform`, { method: 'POST', body: JSON.stringify({ userId: user.UserId }), headers })
      .then(res => Promise.all([res.status, res.json()]))
      .then(async ([status, data]) => {
        console.log("fetch data")

        try {
          console.log("fetch data : ",data);
          const userBalance = isReal ? parseFloat(data.balance.real.toFixed(2)) : parseFloat(data.balance.virtual.toFixed(2));
          console.log(userBalance)
          setUser(user => ({ ...user, Balance: userBalance }))
          const performtask = isReal ? data.task.real.achieve_task : data.task.virtual.achieve_task
          const doneTask = isReal ? data.task.real.done_task : data.task.virtual.done_task
          console.log("perform task", performtask)
          taskState = new Array(taskList.length).fill(0)
          performtask.forEach(item => {
            taskState[item] = 1;
          })
          doneTask.forEach(item => {
            taskState[item] = 2;
          })
          await fetch(`${serverUrl}/check_dailyReward`, { method: 'POST', body: JSON.stringify({ userId: user.UserId }), headers })
            .then(res => Promise.all([res.status, res.json()]))
            .then(([status, data]) => {
              try {
                console.log(data)
                console.log(data.dailyRewardInfo)
                const dailyDate = data.dailyRewardInfo.date;
                dailytaskIndex = taskList.findIndex(item => item.type === 'daily_reward')
                dailyDays = data.dailyRewardInfo.consecutive_days + 1
                setUser((user)=>({ ...user, DailyConsecutiveDays: dailyDays }));
                const nowDate = moment().startOf('day');
                if (dailyDate === "") taskState[dailytaskIndex] = 1;
                else {
                  console.log("dailyRewardDate : ", dailyDate)
                  const selectedDate = moment(dailyDate).utc().local().startOf('day');
                  console.log("nowDate : ", nowDate)
                  console.log("selected date : ", selectedDate)
                  const diffDate = nowDate.diff(selectedDate, 'days');
                  console.log("diff date : ", diffDate)
                  console.log('taskstates', taskState)
                  if (diffDate >= 1) taskState[dailytaskIndex] = 1;
                  else taskState[dailytaskIndex] = 2;
                  if (diffDate >= 2) setUser((user)=>({ ...user, DailyConsecutiveDays: 1 }));
                }
              } catch (e) {
                console.log(e)
              }
            })

          fetch(`${serverUrl}/get_task`, { method: 'POST', body: JSON.stringify({}), headers })
            .then(res => Promise.all([res.status, res.json()]))
            .then(([status, data]) => {
              console.log("task data", data)
              const taskItemData = data.task;

              try {
                console.log('taskstates', taskState)
                setTaskData(prevState => {
                  let newState = [...prevState];
                  newState = taskItemData.map((item, index) => {
                    let taskDescription = "";
                    let imgSrc = ""
                    let dailyState = 0;
                    let link = ""
                    switch (item.type) {
                      case 'type1-1':
                      case 'type1-2': {
                        imgSrc = "Type1.png";
                        break;
                      }
                      case 'daily_reward': {
                        imgSrc = "DailyReward.png";
                        taskDescription = item.description
                        dailyState = dailyDays > item.count ? item.count : dailyDays;
                        break;
                      }
                      case 'sub-tg': {
                        imgSrc = "Avatar-tg.png";
                        link = "https://t.me/rocketton_official"
                        break;
                      }
                      case 'join-tg': {
                        imgSrc = "Avatar-tg.png";
                        link = "https://t.me/RocketTON_Chat"
                        break;
                      }
                      case 'sub-you': {
                        imgSrc = "Avatar-you.png";
                        link = "https://www.youtube.com/@RocketTON_Official"
                        break;
                      }
                      case 'sub-X': {
                        imgSrc = "Avatar-X.png";
                        link = "https://x.com/RocketTON_Game"
                        break;
                      }
                      case 'sub-ins': {
                        imgSrc = "Avatar-ins.png";
                        link = "https://www.instagram.com/rocketton_official"
                        break;
                      }
                      case 'type2-2': {
                        imgSrc = "Type2-2.png";
                        break;
                      }
                      case 'type2-3': {
                        imgSrc = "Type2-3.png";
                        break;
                      }
                      case 'type2-5': {
                        imgSrc = "Type2-5.png";
                        break;
                      }
                      case 'type2-10': {
                        imgSrc = "Type2-10.png";
                        break;
                      }
                      case 'type2-25': {
                        imgSrc = "Type2-25.png";
                        break;
                      }
                      case 'type3': {
                        imgSrc = "Type3.png";
                        break;
                      }
                      case 'type4': {
                        imgSrc = "Type4.png";
                        break;
                      }
                      case 'type5': {
                        imgSrc = "Type5.png";
                        break;
                      }
                      default: break;
                    }

                    return ({
                      src: imgSrc,
                      title: (item.title),
                      amount: (item.amount + (20* dailyState) + " Coins " + taskDescription),
                      status: taskState[index],
                      link: link
                    })
                  });
                  return newState;
                });
                // setTaskList(type)
                // console.log("task content : ", data.content)
              } catch (e) {
                console.log(e);
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
  const stateTask = () => {



    performTask = []
    performTask = taskList.reduce((performList, task, index) => {
      const taskType = task.type;
      if (taskType === "type1-1" && user.GameWon >= 1)
        performList.push(index)
      if ((user.GameLost + user.GameWon) >= task.count && taskType === "type1-2")
        performList.push(index)
      if (task.count <= user.FriendNumber && taskType === "type4")
        performList.push(index);
      return performList
    }, [])
    fetch(`${serverUrl}/add_perform_list`, { method: 'POST', body: JSON.stringify({ userId: user.UserId, performTask: performTask, isReal: isReal }), headers })
      .then(res => Promise.all([res.status, res.json()]))
      .then(async (res) => {
        console.log("before fetch data")
        fetchData()
      })

    console.log("after fetch data")



  }


  useEffect(() => {
    let isMounted = true
    if (isMounted) {
      stateTask();
    }
    return () => { isMounted = false }
  }, [])
  // console.log(user.FriendNumber)
  // console.log("user Info in taskList : ", user.DailyConsecutiveDays)
  return (
    <div className="flex flex-col gap-2 text-[14px] overflow-auto pb-4" style={{ height: "calc(100vh - 200px)" }}>
      {
        taskData.map((_task, _index) => <GenerateTask task={_task} stateTask={stateTask} key={_index} index={_index} dailytaskIndex={dailytaskIndex} fetchData={fetchData} />)
      }
    </div>
  )
}

export default TaskList;