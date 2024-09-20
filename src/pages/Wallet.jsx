import { useCallback, useState } from "react";
import InfoModal from "../component/atom/infoModel";
import AtomLabel from "../component/atom/atom-label";
import ShadowButton from "../component/atom/shadow-btn";

import Contact from "../component/molecules/contact";
import { useAtom } from "jotai";
import { isActionState } from "../store";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import { Img } from "../assets/image";
import NavWallet from "../component/svg/nav_wallet";
import CheckMark from "../component/svg/check-mark";
import WalletInfo from "../component/atom/wallet-info";
import InputNumber from "../component/template/InputNumber";


const Wallet = () => {

  // const [walletAddress, setWalletAddress] = useState("");
  const [infoState, setInfoState] = useState(false)
  const [, setActionState] = useAtom(isActionState);
  const [tx, setTx] = useState({})
  const wallet = useTonWallet();
  const [tonconnectUi] = useTonConnectUI();
  const [tokenNumber, setTokenNumber] = useState(1000);

  const onChange = useCallback((value) => setTx(value.updated_src), [])

  setActionState('stop')
  return (
    <div className="h-full pb-[76px] flex flex-col">
      <div className="flex-auto flex" style={{ height: "calc(100vh - 320px)" }}>
        <div className="my-auto flex flex-col items-center text-center gap-4 h-fit">

          <LazyLoadImage
            alt="wallet"
            effect="opacity"
            wrapperProps={{
              style: {
                transitionDelay: "1s",
                maxHeight: "auto",
                maxWidth: '200px'
              },
            }}
            src="/image/main/ton.png" />
          <div className="text-[15px] text-white">
            Connect your Token wallet to be able to play with Token and receive rewards from the platform.
          </div>
        </div>
      </div>
      <div className="w-full">
        <AtomLabel content={"Wallet"} />
        <WalletInfo address={wallet}/>
        {
          wallet &&
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
            Buy coins
            <InputNumber InputProps = {{value:tokenNumber,min:1,onchange: e=>setTokenNumber(e.target.value)}} />
            1TON = 100 coins
            </div>
          </div>
              
            


        }
        {/* <WalletInfo className={"mt-2"} address={walletAddress} /> */}

            <ShadowButton
                className={`mt-4 ${wallet?'bg-[#CC070A]':'bg-[#3434DA]'}`}
                content={wallet ? "Disconnect wallet" : "Connect wallet"}
                action={() => setInfoState(true)}
              />

      </div>
      <InfoModal title="Coming soon!" isOpen={infoState} setIsOpen={() => setInfoState(false)} height="h-[280px]">
        <div className="flex items-center justify-center">
          <img src='/image/icon/rocketx.svg' width="48px" height="48px" className="max-w-[48px] h-[48px]" alt="token" />
        </div>
        <div className="flex flex-col gap-6 text-black text-center text-[15px] font-normal leading-5 tracking-[-2%]">
          <div>
            🛠 Our token is under development!
          </div>
          <div>
            📢 Join our social media to stay up to date.
          </div>

          <Contact />
        </div>

      </InfoModal>
    </div>
  )
}

export default Wallet;