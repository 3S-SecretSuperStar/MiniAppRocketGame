import { useState } from "react";
import { useAtom } from "jotai";
import TabButton from "../component/atom/tab-button";
import StatList from "../component/molecules/stat-list";
import { isActionState, userData } from "../store";
import InfoModal from "../component/atom/infoModel.jsx";
import Contact from "../component/molecules/contact.jsx";

const Stats = () => {
  const [tabId, setTabId] = useState(1);
  const [user,] = useAtom(userData)
  const [infoState, setInfoState] = useState(false);
  const [actionState, setActionState] = useAtom(isActionState);
  const statsList = [
    {
      src: "coin-y.svg",
      amount: user.Balance,
      id: 1
    },
    {
      src: "token.png",
      amount: "0",
      id: 2
    }
  ]
  if (tabId === 2) {
    setTabId(1);
    setInfoState(true)
  }
  setActionState('stop');
  return (
    <div className="flex flex-col">
      <div className="mt-2">
        <TabButton tabList={statsList} tabNo={tabId} setTabNo={setTabId} />
      </div>
      <div className="mt-4 mb-[92px]">
        <StatList />
      </div>
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
          <Contact/>
        </div>

      </InfoModal>
    </div>
  )
}

export default Stats;