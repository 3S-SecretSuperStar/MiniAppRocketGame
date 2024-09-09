import { useState } from "react";
import EarningTab from "../component/molecules/earning-tab";
import EarningTask from "../component/molecules/earning-task";
import { useAtom } from "jotai";
import { isActionState, userData } from "../store";
import InfoModal from "../component/atom/infoModel.jsx";
import Contact from "../component/molecules/contact.jsx";



const Earned = () => {
    const [actionState, setActionState] = useAtom(isActionState);
    const [user,] = useAtom(userData)
    const tabList = [
      {
        id: 1,
        src: "coin-y.svg",
        amount: user.Balance
      },
      {
        id: 2,
        src: "token.png",
        amount: 0
      }
    ]
    
    const [tabId, setTabId] = useState(1);
    const [infoState, setInfoState] = useState(false);
    setActionState('stop');
    if(tabId===2) {
      setTabId(1);
      setInfoState(true)
    }
    

    return (
        <div className="flex flex-col h-full gap-4">
            <EarningTab tabList={tabList} tabId={tabId} setTabId={setTabId} />
            <EarningTask />
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

export default Earned;