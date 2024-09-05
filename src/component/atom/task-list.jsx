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

const GenerateTask = ({ task, stateTask, index }) => {


  const [isClaim, setIsClaim] = useState(false);
  const [isReal, setIsReal] = useAtom(realGameState);
  const [user, setUser] = useAtom(userData)


  const updateBalance = (profit) => {
    setUser(user => {
      const newUserBalance = (parseFloat(user.Balance) + parseFloat(profit)).toFixed(2)
      return { ...user, Balance: newUserBalance }
    })
  };

  const goClaim = () => {
    setIsClaim(true);
    const headers = new Headers()
    headers.append('Content-Type', 'application/json')
    if (index !== 0) {
      console.log("index : ", index)
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
      console.log("index daily: ", index)
      fetch(`${serverUrl}/perform_dailyReward`, { method: 'POST', body: JSON.stringify({ userId: user.UserId, isReal: isReal }), headers })
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
            updateBalance(10)
          } catch (e) {
            // eslint-disable-next-line no-self-assign
            console.log(e);
          }
          stateTask()
          setIsClaim(false)
        })
    }
  }

  return (
    <div className="bg-[#0000001A] rounded-lg flex justify-between items-center py-2 pl-2 pr-4 text-[14px]">
      <div className="flex gap-2 items-center">
        <img src={`/image/task/${task.src}`} alt="" className="w-8 h-8" />
        <div className="flex flex-col">
          <div className="text-white">{task.title}</div>
          <div className="text-[#ffffff99]">+{task.amount} Coins</div>
        </div>
      </div>
      {
        task.status === 0 ?
          <Link to={'/play'}>
            <button className="rounded-lg w-[61px] py-1 px-0 h-7 bg-[#3861FB] text-white text-center text-[14px]" >
              Start
            </button>
          </Link> :
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


  const updateBalance = (profit) => {
    setUser(user => {
      const newUserBalance = (parseFloat(user.Balance) + parseFloat(profit)).toFixed(2)
      return { ...user, Balance: newUserBalance }
    })
  };


  const stateTask = () => {
    const headers = new Headers()
    headers.append('Content-Type', 'application/json')

    fetch(`${serverUrl}/task_perform`, { method: 'POST', body: JSON.stringify({ userId: user.UserId }), headers })
      .then(res => Promise.all([res.status, res.json()]))
      .then(async ([status, data]) => {

        try {
          const performtask = isReal ? data.task.real.achieve_task : data.task.virtual.achieve_task
          const doneTask = isReal ? data.task.real.done_task : data.task.virtual.done_task
          console.log("perform task", performtask)
          taskState = [0, 0, 0, 0, 0, 0,]
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
                console.log(data.dailyRewardDate)
                const nowDate = moment().startOf('day');
                if (data.dailyRewardDate === "") taskState[0] = 1;
                else {
                  console.log("dailyRewardDate : ", data.dailyRewardDate)
                  const selectedDate = moment(data.dailyRewardDate).utc().local().startOf('day');
                  console.log("nowDate : ", nowDate)
                  console.log("selected date : ", selectedDate)
                  const diffDate = nowDate.diff(selectedDate, 'days');
                  console.log("diff date : ", diffDate)
                  console.log('taskstates', taskState)
                  if (diffDate >= 1) taskState[0] = 1;
                  else taskState[0] = 2;
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
                    switch (item.type) {
                      case 'type1-1' || 'type1-2': {
                        imgSrc = "Type1.png";
                        break;
                      }
                      case 'daily-reward': {
                        imgSrc = "DailyReward.png";
                        taskDescription = item.description
                        break;
                      }
                      case 'sub-tg' || 'join-tg': {
                        imgSrc = "Avatar-tg.png";
                        break;
                      }
                      case 'sub-you': {
                        imgSrc = "Avatar-you.png";
                        break;
                      }
                      case 'sub-ins': {
                        imgSrc = "Avatar-ins.png";
                        break;
                      }
                      case 'sub-ins': {
                        imgSrc = "Avatar-ins.png";
                        break;
                      }
                      case 'sub-X': {
                        imgSrc = "Avatar-X.png";
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
                      title: (item.title + taskDescription),
                      amount: item.amount,
                      status: taskState[index],
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


  useEffect(() => {
    let isMounted = true
    if (isMounted) {
      stateTask();
    }
    return () => { isMounted = false }
  }, [])


  return (
    <div className="flex flex-col gap-2 text-[14px] overflow-auto pb-4" style={{ height: "calc(100vh - 200px)" }}>
      {
        taskData.map((_task, _index) => <GenerateTask task={_task} stateTask={stateTask} key={_index} index={_index} />)
      }
    </div>
  )
}

export default TaskList;