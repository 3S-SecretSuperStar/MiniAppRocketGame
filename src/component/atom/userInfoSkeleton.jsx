const UserInfoSkeleton = () => {
  return (
    <div className="flex   justify-between rounded-[10px] shadow bg-[#0000001A] py-2 px-4 items-center">

      <div className="animate-pulse flex gap-1 items-center">
        <div className="rounded-full bg-gray-200 h-8 w-8"></div>
        <div className="flex flex-col text-[14px] text-white font-bold">
          <div className="h-4 w-48 bg-gray-200 rounded"></div>
          <div className="h-4 w-52 bg-gray-200 rounded"></div>
          <div className="h-4 w-12 bg-gray-200 rounded"></div>

        </div>
      </div>

      <div className="flex animate-pulse  items-center gap-2 text-[14px] font-medium">
        <div className="rounded-full bg-gray-200 h-6 w-6"></div>
        <div>
          <div className="h-6 w-8 bg-gray-200 rounded"></div>
        </div>
      </div>


    </div>
  )
}

export default UserInfoSkeleton