import React from "react";
import { Link } from "react-router-dom";
import { gameRunningState } from "../../store";
import { useAtom } from "jotai";

const ToggleButton = ({
  className,
  disabled,
  bgColor,
  textColor,
  text,
  img,
  fgColor
}) => {
  const [gameRunning,] = useAtom(gameRunningState);

  return (
    <Link
      to={gameRunning ? "#" : `/${text}`}
      className={`${className ? className : ""} 
        ${(disabled) ? (bgColor + " " + textColor) : (fgColor + " text-[#ACC1D9]")}
        flex flex-col text-center items-center rounded-lg text-[9px] font-medium h-[50px] gap-[2px] leading-[10px] justify-center cursor-pointer w-1/5`
      }
    >
      <div className="w-6 h-6">
        {img}
      </div>
      <div className="capitalize">{text}</div>
    </Link>
  )
}
export default ToggleButton;