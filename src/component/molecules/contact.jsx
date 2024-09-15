import TgIcon from "../../assets/icon/tg-icon"
import TgInst from "../../assets/icon/tg-inst";
import TgTwitter from "../../assets/icon/tg-twitter";
import TgYout from "../../assets/icon/tg-yout";
import ShadowButton from "../atom/shadow-btn";
import { Link } from "react-router-dom";
const Contact = () => {
  return (
    <div className="px-8 flex justify-between w-full">
      <Link to='https://t.me/rocketton_official'>
        <ShadowButton className={"w-8 h-8 flex justify-center p-0 items-center rounded-lg"} content={<TgIcon />}></ShadowButton>
      </Link>
      <Link to='https://x.com/RocketTONApp'>
        <ShadowButton className={"w-8 h-8 flex justify-center p-0 items-center rounded-lg"} content={<TgTwitter />}></ShadowButton>
      </Link>
      <Link to='https://www.instagram.com/rocketton_official'>
        <ShadowButton className={"w-8 h-8 flex justify-center p-0 items-center rounded-lg"} content={<TgInst />}></ShadowButton>
      </Link>
      <Link to='https://www.youtube.com/@RocketTON_Official'>
        <ShadowButton className={"w-8 h-8 flex justify-center p-0 items-center rounded-lg"} content={<TgYout />}></ShadowButton>
      </Link>
    </div>

  )
}
export default Contact;