import React, { useEffect, useState } from "react";
import moment from "moment/moment";
import { useAtom } from "jotai";
import StatInfo from "../atom/stat-info";
import { realGameState, userData } from "../../store";
import { REACT_APP_SERVER } from "../../utils/privateData";


const StatList = () => {
  const [isReal,] = useAtom(realGameState)
  const [user,] = useAtom(userData);
  const serverUrl = REACT_APP_SERVER;
  const [statData, setStatData] = useState([]);
  const realName = user.RealName;
  const userId = user.UserId;

  const convertFormatData = (date) => {
    const nowDate = moment().startOf('day');
    const selectedDate = moment(date).utc().local().startOf('day');
    const selectedDate1 = moment(date).utc().startOf('day');
    console.log("nowDate : ",nowDate)
    console.log("selected date : ",selectedDate)
    console.log("selected date1 : ",selectedDate1)
    const diffDate = nowDate.diff(selectedDate, 'days');
    console.log("diff date : ",diffDate)
    if (diffDate === 0) return "Today";
    if (diffDate === 1) return "Yesterday";
    return selectedDate.format('L');
  }
  useEffect(() => {
    let isMounted = true
    const headers = new Headers()
    headers.append('Content-Type', 'application/json')
    fetch(`${serverUrl}/game_history`, { method: 'POST', body: JSON.stringify({ historySize: 100, realName: realName, userId: userId }), headers })
      .then(res => Promise.all([res.status, res.json()]))
      .then(([status, data]) => {
        if (isMounted) {
          try {
            console.log("stats real state",isReal)
            const myData = data.gamesHistory
            const newHistoryGames = isReal ? myData.real.reverse() : myData.virtual.reverse()
            console.log(newHistoryGames)
            const groupedData = newHistoryGames.reduce((_statsData, current) => {
              console.log("database date", current.date)
              const currentDate = convertFormatData(current.date)
              console.log(currentDate)
              if (!_statsData[currentDate]) {
                _statsData[currentDate] =
                {
                  date: currentDate,
                  data: []
                }
              }
              _statsData[currentDate].data.push(
                { bet: current.bet, stop: current.stop === 'x' ? 0 : current.stop }
              )
              return _statsData;
            }, {})
            const convertedData = Object.values(groupedData);
            setStatData(convertedData)

          } catch (e) {
            // eslint-disable-next-line no-self-assign
            document.location.href = document.location.href
          }
        }
      })
    return () => { isMounted = false }

  }, [isReal])


  return (
    <div className="text-[14px] font-medium">
      <div className="flex w-full justify-between text-blueFaded border-b border-white_20 px-4 py-2">
        <div>Bet</div>
        <div>Stop/Crash</div>
        <div>Profit</div>
      </div>
      <div className="overflow-auto" style={{ height: "calc(100vh - 180px)" }}>
        {
          statData.map((_statdata, _index) => (
            <StatInfo data={_statdata} key={_index} />
          ))
        }
      </div>
    </div>
  )
}

export default StatList;