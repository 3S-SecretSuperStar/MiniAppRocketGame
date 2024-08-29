import { useState } from "react";
import InfoModal from "../component/atom/infoModel";
import AtomLabel from "../component/atom/atom-label";
import ShadowButton from "../component/atom/shadow-btn";
// import WalletInfo from "../component/atom/wallet-info";
import TgIcon from "../assets/icon/tg-icon";
import TgInst from "../assets/icon/tg-inst";
import TgTwitter from "../assets/icon/tg-twitter";
import TgYout from "../assets/icon/tg-yout";


const Wallet = () => {

    // const [walletAddress, setWalletAddress] = useState("");
    const [infoState, setInfoState] = useState(false)

    return (
        <div className="h-full pb-[76px] flex flex-col">
            <div className="flex-auto flex" style={{ height: "calc(100vh - 320px)" }}>
                <div className="my-auto flex flex-col items-center text-center gap-4 h-fit">
                    <img
                        src="/image/main/ton.png"
                        alt=""
                        className="h-full max-w-[200px]"
                    />
                    <div className="text-[15px] text-white">
                        Connect your TON wallet to be able to play with TON and receive rewards from the platform.
                    </div>
                </div>
            </div>
            <div className="w-full">
                <AtomLabel content={"Wallet"} />
                {/* <WalletInfo className={"mt-2"} address={walletAddress} /> */}
                <ShadowButton
                    className={"mt-4"}
                    content="Connect wallet"
                    // content={walletAddress ? "Disconnect wallet" : "Connect wallet"}
                    action={() => setInfoState(true)}
                />
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

export default Wallet;