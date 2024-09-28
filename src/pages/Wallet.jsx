import { useState, useEffect } from "react";
import InfoModal from "../component/atom/infoModel";
import AtomLabel from "../component/atom/atom-label";
import ShadowButton from "../component/atom/shadow-btn";
import Contact from "../component/molecules/contact";
import { useAtom } from "jotai";
import { isActionState, userData } from "../store";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useTonAddress, useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import CheckMark from "../component/svg/check-mark";
import WalletInfo from "../component/atom/wallet-info";
import InputNumber from "../component/template/InputNumber";
import { REACT_APP_SERVER } from "../utils/privateData";
import toast from "react-hot-toast";
import WarnningIcon from "../component/svg/warning";
import {beginCell} from "@ton/ton"
// import { configDotenv } from "dotenv";



const Wallet = () => {
  const serverUrl = REACT_APP_SERVER;
  const [user,] = useAtom(userData)
  // const [walletAddress, setWalletAddress] = useState("");
  const [infoState, setInfoState] = useState(false)
  const [, setActionState] = useAtom(isActionState);
  let wallet = useTonAddress();
  const tonwallet = useTonWallet();
  // const adminWalletAdress = process.env.REACT_APP_ADMIN_WALLET;
  const adminWalletAddress = "UQCwD5RFiujnfjK7TUGkBUrKJtaoDmDv_r_qxenV7dPM4HOn";
  const Chain = {
    Mainnet: '-239',
    Testnet: '3'
  }
  // const wallet = "0x23265323454232";
  const [tonconnectUi] = useTonConnectUI();
  // console.log("adminWalletAdress", adminWalletAddress)

  const [tokenNumber, setTokenNumber] = useState(1000);


  const disconnectFunction = async () => {
    await tonconnectUi.disconnect();
  }


  const createTransaction = (tokenCount) => {
    const body = beginCell()
    .storeUint(0,32)
    .storeStringTail("RocketTON Coins purchased")
    .endCell()


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

        // Uncomment the following message to send two messages in one transaction.
        /*
        {
          // Note: Funds sent to this address will not be returned back to the sender.
          address: 'UQAuz15H1ZHrZ_psVrAra7HealMIVeFq0wguqlmFno1f3B-m',
          amount: toNano('0.01').toString(),
        }
        */

      ],
    };
  }


  const tonWalletAction = () => {
    if (!wallet) {
      tonconnectUi.openModal()
    }
    else {
      disconnectFunction()
    }
  }

  const transactionProcess = async (tokenCount) => {

    const tx = createTransaction(tokenCount)
    // console.log("transaction : ", tx)
    const userId = user.UserId;
    // console.log("user Id : ", user.UserId)
    // console.log("user Id : ", userId)
    try {
      
      if (tonwallet.account.chain === Chain.Mainnet) {
        const transferResult = await tonconnectUi.sendTransaction(tx);
        // console.log("transfer result : ", transferResult)
        if (transferResult) {
          const headers = new Headers();
          headers.append('Content-Type', 'application/json')
          fetch(`${serverUrl}/charge_balance`, { method: 'POST', body: JSON.stringify({ userId: userId, amount: tokenCount }), headers })
            .then(
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
            )

        }
      }
      else{
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

  // const onChange = useCallback((value) => setTx(value.updated_src), [])
  // console.log("wallet", tonwallet)
  // console.log("ton number", tokenNumber)
  // console.log("wallet network : ", tonwallet.account.address)
  // console.log("wallet network : ", wallet)
  setActionState('stop')
  return (
    <div className="h-full pb-[76px] flex flex-col gap-4 font-roboto">
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
      <div className="w-full flex flex-col gap-4">
        <AtomLabel content={"Wallet"} />
        <WalletInfo
          address={wallet ? `${wallet.slice(0, 6)}...${wallet.slice(-6)}` : ''} />
        {
          wallet && (
            <>
              <div className="flex flex-col gap-4 text-base text-white">
                <div className="flex flex-col gap-1">
                  Buy coins
                  <InputNumber
                    InputProps={{
                      value: tokenNumber,
                      min: 1,
                      step: 1,
                      onChange: e => setTokenNumber(parseFloat(e.target.value))
                    }}
                  />
                  1TON = 1000 coins
                </div>
              </div>

              <ShadowButton
                className={"text-base font-bold leading-5 py-3.5"}
                content={"Buy Coins"}
                action={() => transactionProcess(tokenNumber)}
              />
            </>)


        }

        <ShadowButton
          className={` ${wallet ? 'bg-[#CC070A] shadow-btn-red-border invite-btn-red-shadow' : 'bg-[#3434DA]'} py-3.5`}
          content={wallet ? "Disconnect wallet" : "Connect wallet"}
          action={() => tonWalletAction()}
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