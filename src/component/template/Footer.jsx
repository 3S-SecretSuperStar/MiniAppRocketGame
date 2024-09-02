import React from "react";
import { useLocation } from "react-router";
import { useAtom } from "jotai";
import ToggleButton from "../atom/toggleButton";
import { isActionState } from "../../store";
import NavEarn from "../svg/nav_earn";
import NavFriends from "../svg/nav_friends";
import NavPlay from "../svg/nav_play";
import NavStats from "../svg/nav-stats";
import NavWallet from "../svg/nav_wallet";

const footerData = [
  { img: <NavPlay color="white" />, text: "play" },
  { img: <NavEarn color="white" />, text: "earn" },
  { img: <NavFriends color="white" />, text: "friends" },
  { img: <NavStats color="white" />, text: "stats" },
  { img: <NavWallet color="white" />, text: "wallet" },
]

const Footer = () => {
  const [isVisuable,] = useAtom(isActionState);
  const location = useLocation().pathname;

  const footerItems = footerData.map((data, index) => {
    return (
      <ToggleButton key={index}
        img={data.img}
        text={data.text}
        bgColor={" bg-white bg-opacity-40 "}
        textColor={"text-white"}
        fgColor={" bg-transparent "}
        disabled={location === `/${data.text}` || (location === "/" && data.text === "play")}
      />
    )
  })
  return (
    <div className={`fixed transition transform bottom-0 p-4 w-full z-[1] ${isVisuable === "start" ||isVisuable === "loading" ? "translate-y-20" : ""}`}>
      <div className="flex bg-bgNavbar w-full gap-1.5 h-15 rounded-xl p-[5px] justify-between">
        {footerItems}
      </div>
    </div>
  )
}

export default Footer;