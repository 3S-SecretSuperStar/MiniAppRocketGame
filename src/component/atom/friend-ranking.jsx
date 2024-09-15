import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'

const FriendRanking = ({ data }) => {
    console.log(data)

    return (
        <div className="flex justify-between rounded-[10px] bg-[#0000001A] py-2 px-4 items-center">
            <div className="flex gap-1 items-center">
                {<img
                    src={data.url}
                    alt=""
                    className="w-8 h-8 rounded-full"
                />||<Skeleton/>}
                <div className="flex flex-col text-[14px] text-white font-bold">
                    <div className="text-ellipsis overflow-hidden w-52 whitespace-nowrap">{data.name||<Skeleton/>}</div>
                    <div>{`${data.label} · ${data.rate}/10`||<Skeleton/>}</div>
                    <div className="text-[#ffffff99] font-normal">{data.ranking||<Skeleton/>}</div>
                </div>
            </div>
            <div className="flex items-center gap-2 text-[14px] font-medium">
                    {<img
                        src="/image/coin-y.svg"
                        alt=""
                        className="w-6 h-6"
                    />||<Skeleton/>}
                    <div>
                        {data.balance||<Skeleton/>}
                    </div>
                </div>
        </div>
    )
}

export default FriendRanking;