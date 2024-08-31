const FriendRanking = ({ data }) => {
    return (
        <div className="flex justify-between rounded-[10px] bg-[#0000001A] py-2 px-4 items-center">
            <div className="flex gap-2 items-center">
                <img
                    src={data.url}
                    alt=""
                    className="w-8 h-8 rounded-full"
                />
                <div className="flex flex-col text-[14px] text-white font-bold">
                    <div>{data.name}</div>
                    <div>{`${data.label} · ${data.rate}/10`}</div>
                    <div className="text-[#ffffff99] font-normal">{parseFloat(data.balance).toFixed(2)}</div>
                </div>
            </div>
            <div className="text-2xl" >
                {data.ranking}
            </div>
        </div>
    )
}

export default FriendRanking;