import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { initUtils } from '@telegram-apps/sdk'
import ScrollModal from "../component/atom/scroll-modal";
import ShadowButton from "../component/atom/shadow-btn";
import FriendComment from "../component/molecules/friend-comment";
import FriendEarned from "../component/molecules/friend-earned";
import FriendsList from "../component/molecules/friends-list";
import CheckMark from "../component/svg/check-mark";
import NavFriends from "../component/svg/nav_friends";
import { RANKINGDATA } from "../utils/globals.js";
import { REACT_APP_SERVER } from "../utils/privateData.js";
import { avatar } from "../assets/avatar/index.jsx";
import { isActionState } from "../store/actionState.jsx";
import { useAtom } from "jotai";
import { userData } from "../store/userData.jsx";



const Friends = () => {
  const [friendList, setFriendList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const serverUrl = REACT_APP_SERVER; 
  const webapp = window.Telegram.WebApp.initDataUnsafe;
  const userId = webapp["user"]["id"];
  const [actionState, setActionState] = useAtom(isActionState)
  const utils = initUtils();
  const [user,setUser] = useAtom(userData)
  const avatarData = [avatar.avatarBeginner, avatar.avatarPilot, avatar.avatarExplorer,
    avatar.avatarAstronaut, avatar.avatarCaptain, avatar.avatarCommander, avatar.avatarAdmiral,
    avatar.avatarLegend, avatar.avatarMasterOfTheUniverse, avatar.avatarGodOfSpace]
  setActionState('stop')
  function nFormatter(num, digits) {

    const lookup = [
      { value: 1, symbol: "" },
      { value: 1e3, symbol: "K" },
      { value: 1e6, symbol: "M" },
      { value: 1e9, symbol: "B" }
    ];
    const regexp = /\.0+$|(?<=\.[0-9]*[1-9])0+$/;
    const item = lookup.findLast(item => num >= item.value);
    return item ? (num / item.value).toFixed(digits).replace(regexp, "").concat(item.symbol) : "0";
  }
  useEffect(() => {
    let isMounted = true
    const webapp = window.Telegram.WebApp.initDataUnsafe;
    if (webapp) {

      const userId = webapp["user"]["id"];
      const headers = new Headers()

      headers.append('Content-Type', 'application/json')
      if (isMounted) {
        fetch(`${serverUrl}/get_friend`, { method: 'POST', body: JSON.stringify({ userId: userId }), headers })
          .then(res => Promise.all([res.status, res.json()]))
          .then(([status, data]) => {
            try {
              const myData = data.friendData
                .sort((a, b) => b.balance.virtual - a.balance.virtual)
                .map((i, index) => { i.rank = index + 1; return i })
                .filter(i => parseInt(i.friend) === userId)
              const friendData = myData.map((data) => {
                return {
                  url: data.avatar_url?data.avatar_url:avatarData[RANKINGDATA.indexOf(data.ranking.virtual)],
                  name: data.name,
                  label: data.ranking.virtual,
                  rate: (RANKINGDATA.indexOf(data.ranking.virtual) + 1),
                  id: data.rank,
                  coin: nFormatter(data.balance.virtual,2),
                  token: ""
                }
              })
              console.log(friendData)
              setFriendList(friendData);

            } catch (e) {
              console.log(e)
            }
          })
        return () => { isMounted = false }
      }
    }
    setUser({...user,FriendNumber:friendList.length})
  }, [])

  // Function to generate an invite link
  const generateInviteLink = () => {
    const tmpURL = `https://t.me/GetYourRocketBot?start=${userId}`;
    const tmpTEXT = "Rocket Game: Play and Get Rewards.🚀💰🤑";
    const fullURL = `https://t.me/share/url?url=${tmpURL}&text=${tmpTEXT}`;
    return fullURL;
  };

  // Function to handle invite
  const inviteUser = () => {
    utils.openTelegramLink(generateInviteLink());
  };



  const copyLink = async () => {
    toast('Referral link is copied',
      {
        position: "top-center",
        icon: <CheckMark />,
        style: {
          borderRadius: '8px',
          background: '#7886A0',
          color: '#fff',
          width: '90vw'
        },
      }
    )
    const link = `https://t.me/GetYourRocketBot?start=${userId}`;

    
    console.log(link);
    try {
      const textField = document.createElement('textarea');
      textField.innerText = link;
      const parentElement = document.getElementById("clipboard");
      parentElement.appendChild(textField);
      textField.select();
      document.execCommand('copy');
      parentElement.removeChild(textField);
      console.log("success");
    } catch (err) {
      console.log(err);
    }
  }


  return (
    <div className="flex flex-col h-full gap-4 pb-[76px] justify-between">
      <FriendComment friendData={friendList} />
      <FriendsList friendData={friendList} />
      <FriendEarned setIsModalOpen={setIsOpen} friendNumber= {friendList.length} />
      <ScrollModal icon={<NavFriends />} title={"Invite a Friend"} isOpen={isOpen} setIsOpen={setIsOpen}>
        <div className="pb-6 flex flex-col gap-4 px-4" id="clipboard">
          <ShadowButton className={"bg-[#3434DA] shadow-btn-lightblue-border"} content={"Send invitation"} action={inviteUser} />
          <ShadowButton className={"bg-[#3434DA] shadow-btn-lightblue-border"} content={"Copy link"} action={copyLink} />
        </div>
      </ScrollModal>
    </div>
  )
}

export default Friends;