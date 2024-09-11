import { LazyLoadImage } from "react-lazy-load-image-component";
import FriendInfo from "../atom/friend-info";

const FriendsList = ({ friendData }) => {
  console.log(friendData)
  return (
    <div className="flex-auto flex w-full justify-center  " style={{ height: "calc(100vh - 500px)" }}>
      {
        friendData.length > 0 ?
          (
            <>
              <div className="flex flex-col gap-2 w-full overflow-auto" >
                {
                  friendData.map((_friend, _index) => {
                    return (

                      <FriendInfo key={_index} data={_friend} />
                    )
                  })
                }
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-4 text-center my-auto">
              <LazyLoadImage
                alt="friend"
                effect="blur"
                wrapperProps={{
                  style: {
                    transitionDelay: "1s",
                    maxHeight: "calc(100vh - 400px)",
                    maxWidth: 'auto'
                  },
                }}
                src="/image/main/friends.png" />

              <div className="text-[15px] text-white">
                Invite a friend and you'll both get 25 points.
              </div>
            </div>
          )
      }
    </div>
  )
}

export default FriendsList;