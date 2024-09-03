import { Img } from "../assets/image";
import Contact from "../component/molecules/contact";

const Help = () => {
  return (
    <div className="flex flex-col gap-8 items-center h-full pb-[92px] overflow-y-auto ">
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
          <Contact/>
        </div>
      </div>
      </div>
      )
}

      export default Help;