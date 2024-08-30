import { useState, useEffect } from "react";
import CheckMark from "../svg/check-mark";
import LoadingSpinner from "../svg/loading-spinner";
import toast from "react-hot-toast";
import { REACT_APP_SERVER } from "../../utils/privateData";
import { useAtom } from "jotai";
import { realGameState, userData } from "../../store";
import { Link, useActionData } from "react-router-dom";

const serverUrl = REACT_APP_SERVER;



const GenerateTask = ({ task, stateTask, index }) => {

  const [isClaim, setIsClaim] = useState(false);
  const [user,] = useAtom(userData);
  const [isReal, setIsReal] = useAtom(realGameState)

  const goClaim = () => {
    setIsClaim(true);
    const headers = new Headers()
    headers.append('Content-Type', 'application/json')
    fetch(`${serverUrl}/task_balance`, { method: 'POST', body: JSON.stringify({ userName: user.UserName, amount: task.amount, task: index, isReal: isReal }), headers })
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
        } catch (e) {
          // eslint-disable-next-line no-self-assign
          console.log(e);
        }
        setIsClaim(false)
        stateTask()
      })
  }

  return (
    <div className="bg-[#0000001A] rounded-lg flex justify-between items-center py-2 pl-2 pr-4 text-[14px]">
      <div className="flex gap-2 items-center">
        <img src={`/image/icon/${task.src}`} alt="" className="w-8 h-8" />
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

  const [user,] = useAtom(userData);
  const [isReal, setIsReal] = useAtom(realGameState)

  const stateTask = () => {
    const headers = new Headers()
    headers.append('Content-Type', 'application/json')

    fetch(`${serverUrl}/task_perform`, { method: 'POST', body: JSON.stringify({ userName: user.UserName, isReal: isReal }), headers })
      .then(res => Promise.all([res.status, res.json()]))
      .then(([status, data]) => {

        try {

          const performtask = isReal ? data.task.real.achieve_task : data.task.real.achieve_task
          const doneTask = isReal ? data.task.virtual.done_task : data.task.virtual.done_task
          taskState = [0, 0, 0, 0, 0,]
          performtask.forEach(item => {
            taskState[item] = 1;
          })
          doneTask.forEach(item => {
            taskState[item] = 2;
          })

          fetch(`${serverUrl}/get_task`, { method: 'POST', body: JSON.stringify({}), headers })
            .then(res => Promise.all([res.status, res.json()]))
            .then(([status, data]) => {

              try {
                if (isReal) {
                  setTaskData(prevState => {
                    let newState = [...prevState];
                    newState = data.task.real.map((item, index) => ({
                      src: item.src,
                      title: item.title,
                      amount: item.amount,
                      status: taskState[index],
                    }));
                    return newState;
                  });
                }
                else {
                  setTaskData(prevState => {
                    let newState = [...prevState];
                    newState = data.task.virtual.map((item, index) => ({
                      src: item.src,
                      title: item.title,
                      amount: item.amount,
                      status: taskState[index],
                    }));
                    return newState;
                  });
                }

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