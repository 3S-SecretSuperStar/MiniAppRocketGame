import { useState } from "react";
import EarningTab from "../component/molecules/earning-tab";
import EarningTask from "../component/molecules/earning-task";
import { useAtom } from "jotai";
import { userData } from "../store";
import InfoModal from "../component/atom/infoModel.jsx";
import TgIcon from "../assets/icon/tg-icon";
import TgInst from "../assets/icon/tg-inst";
import TgTwitter from "../assets/icon/tg-twitter";
import TgYout from "../assets/icon/tg-yout";
import ShadowButton from "../component/atom/shadow-btn.jsx";



const Earned = () => {
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
                <div className="px-8 flex justify-between w-full">
                  <ShadowButton className={"w-8 h-8 flex justify-center p-0 items-center rounded-lg"} content={<TgIcon />}></ShadowButton>
                  <ShadowButton className={"w-8 h-8 flex justify-center p-0 items-center rounded-lg"} content={<TgTwitter />}></ShadowButton>
                  <ShadowButton className={"w-8 h-8 flex justify-center p-0 items-center rounded-lg"} content={<TgInst />}></ShadowButton>
                  <ShadowButton className={"w-8 h-8 flex justify-center p-0 items-center rounded-lg"} content={<TgYout />}></ShadowButton>
                </div>
              </div>

            </InfoModal>
        </div>
    )
}

export default Earned;