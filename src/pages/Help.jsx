import ShadowButton from "../component/atom/shadow-btn";
import SwitchButton from "../component/atom/switchButtton";
import SwitchButtonOption from "../component/atom/switchButtonOption";
import InputNumber from "../component/template/InputNumber";
import TgIcon from "../assets/icon/tg-icon";
import TgTwitter from "../assets/icon/tg-twitter";
import TgYout from "../assets/icon/tg-yout";
import TgInst from "../assets/icon/tg-inst";
import { Img } from "../assets/image";

const Help = () => {
  const operationOption = ['Increase Bet by', 'Return to base Bet'];
  const setData = () => { }

  return (
    <div className="flex flex-col gap-8 items-center h-[90vh] pb-4 overflow-y-auto">
      <div className="flex flex-col gap-4 items-center">
        <div className="text-[20px] text-blueFaded">🎲 <span className="text-[17px]">How to play</span></div>
        <div className="text-white text-[15px]">Place your bet and press the Start button to launch the rocket! As the rocket flies, a multiplier increases your bet. Press the Stop button to get your profit! But be careful, because the rocket can crash at any moment, and if it does, you'll lose your bet!</div>
        <div>
          <img src={Img.imgButtons} height="80px" className="h-20" alt="buttons" />
        </div>
      </div>
      <div className="flex flex-col gap-4 items-center">
        <div className="text-[20px] text-blueFaded">🎛 <span className="text-[17px]">Game modes</span></div>
        <div className="text-white text-[15px]">You can play in Manual or Auto mode. In both modes you can specify an automatic stop to stop the rocket and get reward.</div>
        <div >
          <img src={Img.imgSelectButton} height="54px" className="h-[54px]" alt="switch button" />
        </div>
        <div className="text-white text-[15px]">In automatic mode the rocket will be launched automatically until you press the stop button.</div>
      </div>
      <div className="flex flex-col gap-4 items-center">
        <div className="text-[20px] text-blueFaded">👨‍🚀 <span className="text-[17px]">Build your strategy</span></div>
        <div className="text-white text-[15px]">In automatic mode you can set up a betting strategy so that the bet automatically increases according to the specified coefficient or resets to the original value in case of winning or losing.</div>
        <div>
         <img src={Img.imgAfterAction} height="324px" className="h-[324px]" alt="After Action" />
        </div>
        <div className="flex flex-col gap-4 items-center w-full">
          <div className="text-[20px] text-blueFaded">📢 <span className="text-[17px]">Any questions?</span></div>
          <div className="text-white text-[15px]">Join our social media to stay up to date:</div>
          <div className="px-8 flex justify-between w-full">
            <ShadowButton className={"w-8 h-8 flex justify-center p-0 items-center rounded-lg"} content={<TgIcon />}></ShadowButton>
            <ShadowButton className={"w-8 h-8 flex justify-center p-0 items-center rounded-lg"} content={<TgTwitter />}></ShadowButton>
            <ShadowButton className={"w-8 h-8 flex justify-center p-0 items-center rounded-lg"} content={<TgInst />}></ShadowButton>
            <ShadowButton className={"w-8 h-8 flex justify-center p-0 items-center rounded-lg"} content={<TgYout />}></ShadowButton>
          </div>
        </div>
      </div>
      </div>
      )
}

      export default Help;